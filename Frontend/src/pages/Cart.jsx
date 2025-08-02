import { useEffect, useState } from "react";
import {
  clearcartApi,
  getcartItemsApi,
  updateCartQuantityApi,
} from "../services/Cart_api";
import { useNavigate } from "react-router-dom";
import "../styles/Cart_Styles/Cart.css";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    grandTotal: 0,
    total: 0,
  });

  const flag = parseInt(localStorage.getItem("flag"));
  const role = parseInt(localStorage.getItem("role"));

  useEffect(() => {
    console.log("flag:", flag);
    console.log("role:", role);
  }, [flag, role]);

  const isloggedin = localStorage.getItem("token") !== null;

  const handleClick = () => {
    if (!isloggedin) {
      toast.error("Please log in to continue.", {
        position: "top-right",
        autoClose: 1000,
      });
      navigate("/login");
      return;
    }
    if (flag === 2) {
      navigate("/checkout");
    } else {
      toast.error("You do not have permission to access the checkout.", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await getcartItemsApi();
        console.log("Fetched cart items:", data);
        if (data.status === "success" && data.cartItems) {
          setCartItems(data.cartItems);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateOrderSummary();
  }, [cartItems, isCouponApplied]);

  const handleQuantityChange = async (itemId, newQty) => {
    try {
      const response = await updateCartQuantityApi(itemId, newQty);
      if (response.status === "removed") {
        setCartItems(response.cart);
      } else if (response.status === "success") {
        setCartItems((prevCart) =>
          prevCart.map((item) =>
            item.item_id === itemId ? { ...item, item_qty: newQty } : item
          )
        );
      }
    } catch (error) {
      console.error("Quantity update failed:", error);
    }
  };

  const calculateOrderSummary = () => {
    const grandTotal = cartItems.reduce(
      (acc, item) => acc + item.item_price * item.item_qty,
      0
    );

    setOrderSummary({ grandTotal });
  };

  const applyCoupon = () => {
    if (couponCode === "HYPBM") {
      setIsCouponApplied(true);
    } else {
      alert("Invalid coupon code!");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await clearcartApi(itemId);
      if (response.status === "success") {
        setCartItems((prevCart) =>
          prevCart.filter((item) => item.item_id !== itemId)
        );
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  return (
    <div className="cart-page-container">
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <img
            src="src/assets/Cart icon/noun-delete-cart-4792940.png"
            alt="Empty Cart"
            className="cart-empty-image"
          />
          <h2>Your Cart is Empty!</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button
            className="cart-shop-now-btn"
            onClick={() => navigate("/menu")}
          >
            Order Now
          </button>
        </div>
      ) : (
        <div className="cart-content-wrapper">
          <div className="cart-order-details-container">
            <h2 className="cart-section-title">Order Details</h2>
            <div className="cart-order-details-divider"></div>

            <div className="cart-order-header">
              <div className="cart-product-header">Product</div>
              <div className="cart-quantity-header">Quantity</div>
              <div className="cart-price-header">Price</div>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.item_id} className="cart-item">
                  <div className="cart-product-info">
                    <img
                      src={`${import.meta.env.VITE_baseUrl}${item.item_image}`}
                      alt={item.item_name}
                      className="cart-product-image"
                    />
                    <div className="cart-product-details">
                      <h3 className="cart-product-name">{item.item_name}</h3>
                      <p className="cart-product-variant">
                        Size: {item.item_size || "Color"}
                      </p>
                    </div>
                  </div>

                  <div className="cart-quantity-control">
                    <button
                      className="cart-quantity-btn cart-minus"
                      onClick={() =>
                        handleQuantityChange(item.item_id, item.item_qty - 1)
                      }
                    >
                      -
                    </button>
                    <span className="cart-quantity-value">{item.item_qty}</span>
                    <button
                      className="cart-quantity-btn cart-plus"
                      onClick={() =>
                        handleQuantityChange(item.item_id, item.item_qty + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-price-section">
                    <span className="cart-item-price">
                      ₹{item.item_price.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <button
                      className="cart-remove-item-btn"
                      onClick={() => handleRemoveItem(item.item_id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-sidebar">
            <div className="cart-coupon-container">
              <h2 className="cart-section-title">Coupon Code</h2>
              <div className="cart-coupon-divider"></div>

              <div className="cart-coupon-input-wrapper">
                <input
                  type="text"
                  className="cart-coupon-input"
                  placeholder="Enter Your Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className="cart-apply-coupon-btn" onClick={applyCoupon}>
                  Apply Your Coupon Code
                </button>
              </div>
            </div>

            <div className="cart-order-summary-container">
              <h2 className="cart-section-title">Order Summary</h2>
              <div className="cart-summary-divider"></div>

              <div className="cart-summary-item cart-total">
                <span className="cart-summary-label">Total</span>
                <span className="cart-summary-value">
                  ₹{orderSummary.grandTotal}
                </span>
              </div>

              <button className="cart-checkout-btn" onClick={handleClick}>
                Continue To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

