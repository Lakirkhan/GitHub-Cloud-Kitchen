 

import { useEffect, useState } from "react";
import "../styles/Checkout_Styles/Checkout.css";
import { useNavigate } from "react-router-dom";
import { getcartItemsApi } from "../services/Cart_api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import CheckoutHeader from "../component/Checkout/CheckoutHeader";
import CheckoutProgress from "../component/Checkout/CheckoutProgress";
import CheckoutTabs from "../component/Checkout/CheckoutTabs";
import BillingForm from "../component/Checkout/BillingForm";
import ShippingForm from "../component/Checkout/ShippingForm";
import PaymentForm from "../component/Checkout/PaymentForm";
import OrderSummary from "../component/Checkout/OrderSummary";
import { getAddressapi } from "../services/BillingForApi";
import { submitOrderApi } from "../services/OrdersApi";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [activeTab, setActiveTab] = useState("billing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [tabsCompleted, setTabsCompleted] = useState({
    billing: false,
    shipping: false,
    payment: false,
  });

  // Updated billing info state with field names matching the API
  const [billingInfo, setBillingInfo] = useState({
    recipient_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Updated shipping info state with field names matching the API
  const [shippingInfo, setShippingInfo] = useState({
    recipient_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // New payment info state
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getAddressapi();
        console.log("Fetched addresses in Checkout:", response);

        if (response.status === "success") {
          setSavedAddresses(response.address);
        } else {
          setSavedAddresses([]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setSavedAddresses([]);
      }
    };

    fetchAddresses();
  }, []);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingCharge, setShippingCharge] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState(900);

  // Session timeout handler
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimeout((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error(
            "Your session has expired. Please start again for security reasons.",
            {
              position: "top-center",
              autoClose: false,
            }
          );
          navigate("/cart");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Reset timer on user activity
    const resetTimer = () => setSessionTimeout(500);
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
    };
  }, [navigate]);

  // Format session timeout for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await getcartItemsApi();
        console.log("Fetched cart items:", data);

        if (data.status === "success" && data.cartItems) {
          if (data.cartItems.length === 0) {
            toast.error(
              "Your cart is empty. Please add items before checkout."
            );
            navigate("/products");
            return;
          }
          setCartItems(data.cartItems);
        } else {
          toast.error("Failed to load cart items. Please try again.");
          navigate("/cart");
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Error loading your cart. Please try again later.");
        navigate("/cart");
      }
    };
    fetchCartItems();
  }, [navigate]);

  const subtotalAmount = cartItems.reduce(
    (acc, item) => acc + item.item_price * item.item_qty,
    0
  );

  const taxAmount = subtotalAmount * 0.18; // 18% tax
  const totalAmount = subtotalAmount + shippingCharge + taxAmount;

  // Handle billing info changes
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating billing field ${name} to ${value}`);
    setBillingInfo({
      ...billingInfo,
      [name]: value,
    });
  };

  // Handle shipping info changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });
  };

  // Handle payment info changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    }

    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .substring(0, 5);
    }

    // Limit CVV to 3-4 digits
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    console.log(`Updating payment field ${name} to ${formattedValue}`);
    setPaymentInfo({
      ...paymentInfo,
      [name]: formattedValue,
    });
  };

  const validateBillingInfo = () => {
    // If all billing fields are filled, validation passes
    if (
      billingInfo.recipient_name &&
      billingInfo.phone &&
      billingInfo.address &&
      billingInfo.city &&
      billingInfo.state &&
      billingInfo.pincode
    ) {
      return true;
    }

    // Otherwise, check for errors
    const errors = {};
    if (!billingInfo.recipient_name) errors.recipient_name = "Name is required";
    if (!billingInfo.phone) errors.phone = "Phone is required";
    if (!billingInfo.address) errors.address = "Address is required";
    if (!billingInfo.city) errors.city = "City is required";
    if (!billingInfo.state) errors.state = "State is required";
    if (!billingInfo.pincode) errors.pincode = "Postal code is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateShippingInfo = () => {
    const errors = {};

    // If using a new address, validate all fields
    if (isNewAddress) {
      if (!shippingInfo.recipient_name)
        errors.recipient_name = "Name is required";
      if (!shippingInfo.phone) errors.phone = "Phone is required";
      if (!shippingInfo.address) errors.address = "Address is required";
      if (!shippingInfo.city) errors.city = "City is required";
      if (!shippingInfo.state) errors.state = "State is required";
      if (!shippingInfo.pincode) errors.pincode = "Postal code is required";
    } else if (!selectedAddress) {
      // If not using a new address, make sure an address is selected
      errors.address = "Please select a shipping address";
    }

    // Validate shipping method
    if (!shippingMethod) {
      errors.shippingMethod = "Please select a shipping method";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle tab navigation with validation
  const handleTabChange = (tab) => {

    // Allow backward navigation freely
    if (
      (activeTab === "shipping" && tab === "billing") ||
      (activeTab === "payment" && (tab === "billing" || tab === "shipping"))
    ) {
      setActiveTab(tab);
      return;
    }

    // Validate before proceeding forward
    if (activeTab === "billing" && tab === "shipping") {
      console.log("Validating billing info...");
      // Always set billing as completed when moving to shipping
      // The validation is already done in the BillingForm component
      setTabsCompleted((prev) => ({ ...prev, billing: true }));
      setActiveTab("shipping");
    } else if (activeTab === "shipping" && tab === "payment") {
      console.log("Validating shipping info...");
      if (validateShippingInfo()) {
        console.log("Shipping info valid, updating state...");

        setTabsCompleted((prev) => {
          const updatedState = { ...prev, shipping: true };
          console.log("Updated tabsCompleted:", updatedState);

          // Update activeTab after state update
          setActiveTab("payment");
          return updatedState;
        });
      }
    }
  };

  // Handle form submission
  const handlePlaceOrder = async () => {
    console.log("Attempting to place order");
    console.log("Billing info:", billingInfo);
    console.log("Shipping info state:", shippingInfo);
    console.log("Selected address ID:", selectedAddress);
    console.log("Is new address:", isNewAddress);
    console.log("Saved addresses:", savedAddresses);
    console.log("Payment method:", paymentMethod);
    console.log("Payment info:", paymentInfo);
    console.log("Terms accepted:", termsAccepted);

    if (!termsAccepted) {
      setFormErrors({ terms: "You must accept the terms and conditions" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the shipping address data
      const shippingAddressData = isNewAddress
        ? shippingInfo
        : savedAddresses.find((addr) => addr.id === selectedAddress);

      console.log("Using shipping address:", shippingAddressData);

      // Fix: Make sure we're using the correct billing address
      // If billing info is empty, use the first saved address or the shipping address
      let billingAddressData = { ...billingInfo };

      // Check if billing info is empty (all fields are empty strings)
      const isBillingEmpty = Object.values(billingInfo).every(
        (val) => val === ""
      );

      if (isBillingEmpty) {
        console.log("Billing info is empty, using fallback");
        // Use the first saved address or the shipping address as fallback
        billingAddressData =
          savedAddresses.length > 0 ? savedAddresses[0] : shippingAddressData;

        console.log("Using fallback billing address:", billingAddressData);
      }

      console.log("Final billing address being used:", billingAddressData);

      // Prepare order data
      const orderData = {
        cartItems,
        billingInfo: billingAddressData,
        shippingInfo: shippingAddressData,
        paymentMethod,
        totalAmount,
        status: "pending",
      };

      console.log("Cart items being submitted:", cartItems);
      console.log("Shipping method selected:", shippingMethod);
      console.log("Shipping charge applied:", shippingCharge);
      console.log("Tax amount calculated:", taxAmount);

      console.log("Submitting order with data:", orderData);

      // Submit the order
      const response = await submitOrderApi(orderData);
      console.log("Order submission response:", response);

      // console.log(
      //   "Order ID received:",
      //   response.orderId || "No order ID returned"
      // );

      if (response.status === "success") {
        // Success
        toast.success(
          "Order placed successfully! Your order number is #" +
            Math.floor(100000 + Math.random() * 900000),
          {
            position: "top-center",
            autoClose: 1000,
          }
        );

        // Clear cart and navigate to order confirmation
        setCartItems([]);
        navigate("/");
      } else {
        toast.error(
          "Failed to place order: " + (response.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ch-checkout-container capitalize">
      <CheckoutHeader sessionTimeout={sessionTimeout} formatTime={formatTime} />

      <CheckoutProgress activeTab={activeTab} tabsCompleted={tabsCompleted} />

      <CheckoutTabs
        activeTab={activeTab}
        tabsCompleted={tabsCompleted}
        handleTabChange={handleTabChange}
      />

      <div className="ch-checkout-content">
        {/* Billing Information */}
        {activeTab === "billing" && (
          <BillingForm
            billingInfo={billingInfo}
            setBillingInfo={setBillingInfo}
            handleBillingChange={handleBillingChange}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            handleTabChange={handleTabChange}
            updateSavedAddresses={setSavedAddresses}
          />
        )}

        {/* Shipping Information */}
        {activeTab === "shipping" && (
          <ShippingForm
            savedAddresses={savedAddresses}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            isNewAddress={isNewAddress}
            setIsNewAddress={setIsNewAddress}
            shippingInfo={shippingInfo}
            handleShippingChange={handleShippingChange}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
            setShippingCharge={setShippingCharge}
            orderNotes={orderNotes}
            setOrderNotes={setOrderNotes}
            handleTabChange={handleTabChange}
            updateSavedAddresses={setSavedAddresses}
          />
        )}

        {/* Payment Information */}
        {activeTab === "payment" && (
          <PaymentForm
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            paymentInfo={paymentInfo}
            handlePaymentChange={handlePaymentChange}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
            handleTabChange={handleTabChange}
            handlePlaceOrder={handlePlaceOrder}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Order Summary */}
        <OrderSummary
          cartItems={cartItems}
          subtotalAmount={subtotalAmount}
          shippingMethod={shippingMethod}
          shippingCharge={shippingCharge}
          taxAmount={taxAmount}
          totalAmount={totalAmount}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default Checkout;
