import { useState, useEffect } from "react";
import FormField from "./FormField";
import SavedAddresses from "./SavedAddresses";
import ShippingMethods from "./ShippingMethods";
import { addAddressapi } from "../../services/BillingForApi";
import { toast } from "react-toastify";

const ShippingForm = ({
  savedAddresses,
  selectedAddress,
  setSelectedAddress,
  isNewAddress,
  setIsNewAddress,
  shippingInfo,
  handleShippingChange,
  formErrors,
  setFormErrors,
  shippingMethod,
  setShippingMethod,
  setShippingCharge,
  orderNotes,
  setOrderNotes,
  handleTabChange,
  updateSavedAddresses,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(isNewAddress);

  useEffect(() => {
    if (selectedAddress && !isNewAddress && savedAddresses.length > 0) {
      const selectedAddressData = savedAddresses.find(
        (addr) => addr.id === selectedAddress
      );

      if (selectedAddressData) {
        handleShippingChange({
          target: {
            name: "recipient_name",
            value: selectedAddressData.recipient_name,
          },
        });
        handleShippingChange({
          target: { name: "phone", value: selectedAddressData.phone },
        });
        handleShippingChange({
          target: { name: "address", value: selectedAddressData.address },
        });
        handleShippingChange({
          target: { name: "city", value: selectedAddressData.city },
        });
        handleShippingChange({
          target: { name: "state", value: selectedAddressData.state },
        });
        handleShippingChange({
          target: { name: "pincode", value: selectedAddressData.pincode },
        });
      }
    }
  }, [selectedAddress, isNewAddress, savedAddresses]);

  const handleSaveShippingDetails = async () => {
    const errors = {};
    if (!shippingInfo.recipient_name)
      errors.recipient_name = "Name is required";
    if (!shippingInfo.phone) errors.phone = "Phone is required";
    if (!shippingInfo.address) errors.address = "Address is required";
    if (!shippingInfo.city) errors.city = "City is required";
    if (!shippingInfo.state) errors.state = "State is required";
    if (!shippingInfo.pincode) errors.pincode = "Postal code is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill all required fields", {
        autoClose: 1000,
      });
      return;
    }

    try {
      setIsSaving(true);
      toast.info("Saving shipping details...", { autoClose: 1000 });

      const response = await addAddressapi(
        shippingInfo.recipient_name,
        shippingInfo.phone,
        shippingInfo.address,
        shippingInfo.city,
        shippingInfo.state,
        shippingInfo.pincode
      );

      if (response.status === "success") {
        toast.success("Shipping details saved successfully!", {
          autoClose: 1000,
        });

        setIsNewAddress(false);
        setSelectedAddress(response.address.id);
        updateSavedAddresses((prev) => [...prev, response.address]);

        handleTabChange("payment");
      } else {
        toast.error(
          "Failed to save address: " + (response.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Shipping save error:", error);
      toast.error("Failed to save shipping details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ch-shipping-info">
      <div className="ch-section-title">Shipping Information</div>
      <div className="ch-section-subtitle">
        Select a saved address or add a new one.
      </div>

      {/* Updated Radio Toggle */}
      <div className="ch-radio-toggle-group">
        <label className="ch-radio-label">
          <input
            type="radio"
            name="addressOption"
            checked={!showNewAddressForm}
            onChange={() => {
              setShowNewAddressForm(false);
              setIsNewAddress(false);
            }}
          />
          Use Existing Address
        </label>

        <label className="ch-radio-label">
          <input
            type="radio"
            name="addressOption"
            checked={showNewAddressForm}
            onChange={() => {
              setShowNewAddressForm(true);
              setIsNewAddress(true);
              setSelectedAddress(null); // Reset saved address selection
            }}
          />
          Add a New Address
        </label>
      </div>

      {!showNewAddressForm ? (
        <SavedAddresses
          savedAddresses={savedAddresses}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          isNewAddress={isNewAddress}
          setIsNewAddress={setIsNewAddress}
          setFormErrors={setFormErrors}
        />
      ) : (
        <div className="ch-new-address-form">
          <div className="ch-form-info-box">
            <span className="ch-info-text">
              All fields marked with * are required
            </span>
          </div>

          <FormField
            id="recipient_name"
            name="recipient_name"
            label="Full Name *"
            type="text"
            value={shippingInfo.recipient_name}
            onChange={handleShippingChange}
            error={formErrors.recipient_name}
          />

          <FormField
            id="address"
            name="address"
            label="Shipping Address *"
            type="text"
            value={shippingInfo.address}
            onChange={handleShippingChange}
            error={formErrors.address}
          />

          <div className="ch-form-group">
            <FormField
              id="city"
              name="city"
              label="City *"
              type="text"
              value={shippingInfo.city}
              onChange={handleShippingChange}
              error={formErrors.city}
            />

            <FormField
              id="state"
              name="state"
              label="State/Province *"
              type="text"
              value={shippingInfo.state}
              onChange={handleShippingChange}
              error={formErrors.state}
            />

            <FormField
              id="pincode"
              name="pincode"
              label="Postal Code *"
              type="text"
              value={shippingInfo.pincode}
              onChange={handleShippingChange}
              error={formErrors.pincode}
            />
          </div>

          <FormField
            id="phone"
            name="phone"
            label="Phone Number *"
            type="tel"
            value={shippingInfo.phone}
            onChange={handleShippingChange}
            error={formErrors.phone}
          />
        </div>
      )}

      <ShippingMethods
        shippingMethod={shippingMethod}
        setShippingMethod={setShippingMethod}
        setShippingCharge={setShippingCharge}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
      />

      <FormField
        id="orderNotes"
        name="orderNotes"
        label="Order Notes (Optional)"
        as="textarea"
        value={orderNotes}
        onChange={(e) => setOrderNotes(e.target.value)}
        placeholder="Special instructions for delivery or order"
        fullWidth
      />

      <div className="ch-form-actions">
        <button
          className="ch-secondary-button"
          onClick={() => handleTabChange("billing")}
        >
          ← Back to Billing
        </button>
        {showNewAddressForm ? (
          <button
            className="ch-primary-button"
            onClick={handleSaveShippingDetails}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Address and Continue"}
          </button>
        ) : (
          <button
            className="ch-primary-button"
            onClick={() => handleTabChange("payment")}
            disabled={!selectedAddress || !shippingMethod}
          >
            Continue to Payment
          </button>
        )}
      </div>
    </div>
  );
};

export default ShippingForm;
