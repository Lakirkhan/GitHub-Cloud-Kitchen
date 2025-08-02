 

import { useState, useEffect } from "react";
import { Edit, Info, Plus } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormField from "./FormField";
import {
  addAddressapi,
  getAddressapi,
  updateAddressapi,
} from "../../services/BillingForApi";

const BillingForm = ({
  billingInfo,
  setBillingInfo,
  handleBillingChange,
  formErrors,
  handleTabChange,
  setFormErrors,
  updateSavedAddresses,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getAddressapi();
        console.log("Fetched addresses in BillingForm:", response);
        if (response.status === "success" && Array.isArray(response.address)) {
          setAddresses(response.address);
          setShowForm(response.address.length === 0);
        } else {
          setAddresses([]);
          setShowForm(true);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setAddresses([]);
        setShowForm(true);
      }
    };
    fetchAddresses();
  }, []);

  const handleSelectAddress = (addr) => {
    console.log("Selected address:", addr);
    setSelectedAddress(addr);

    // Update billing info with the selected address
    setBillingInfo({
      recipient_name: addr.recipient_name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });

    if (typeof setFormErrors === "function") {
      setFormErrors({});
    }

    setShowForm(false);
    toast.info(`Address selected: ${addr.recipient_name}`, {
      position: "top-right",
      autoClose: 1000,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log("Edit form submitted with billingInfo:", billingInfo);

    // Validate form fields
    const errors = {};
    if (!billingInfo.recipient_name) errors.recipient_name = "Name is required";
    if (!billingInfo.phone) errors.phone = "Phone is required";
    if (!billingInfo.address) errors.address = "Address is required";
    if (!billingInfo.city) errors.city = "City is required";
    if (!billingInfo.state) errors.state = "State is required";
    if (!billingInfo.pincode) errors.pincode = "Postal code is required";

    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
      if (typeof setFormErrors === "function") {
        setFormErrors(errors);
      }
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSaving(true);
      const addressToUpdate = {
        id: editingAddress.id,
        recipient_name: billingInfo.recipient_name,
        phone: billingInfo.phone,
        address: billingInfo.address,
        city: billingInfo.city,
        state: billingInfo.state,
        pincode: billingInfo.pincode,
      };

      console.log("Updating address with data:", addressToUpdate);
      const response = await updateAddressapi(addressToUpdate);
      console.log("Update address response:", response);

      if (response.status === "success") {
        const updatedAddress = response.address || addressToUpdate;

        // Update local addresses state
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === updatedAddress.id ? updatedAddress : addr
          )
        );

        // Update parent component's saved addresses if the function exists
        if (typeof updateSavedAddresses === "function") {
          updateSavedAddresses((prev) =>
            prev.map((addr) =>
              addr.id === updatedAddress.id ? updatedAddress : addr
            )
          );
        }

        // Update selected address if it was the one being edited
        if (selectedAddress && selectedAddress.id === updatedAddress.id) {
          setSelectedAddress(updatedAddress);
        }

        // Update billing info state to reflect changes
        setBillingInfo({
          recipient_name: updatedAddress.recipient_name,
          phone: updatedAddress.phone,
          address: updatedAddress.address,
          city: updatedAddress.city,
          state: updatedAddress.state,
          pincode: updatedAddress.pincode,
        });

        toast.success("Address updated successfully!",{
          position: "top-right",
          autoClose: 1000,
        });
      } else {
        toast.error(
          "Failed to update address: " + (response.message || "Unknown error ",{
            position: "top-right",
            autoClose: 1000,
          })
        );
      }
      setEditingAddress(null);
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address.",{
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDetails = async () => {
    console.log("Save details clicked with billingInfo:", billingInfo);

    // Validate form fields
    const errors = {};
    if (!billingInfo.recipient_name) errors.recipient_name = "Name is required";
    if (!billingInfo.phone) errors.phone = "Phone is required";
    if (!billingInfo.address) errors.address = "Address is required";
    if (!billingInfo.city) errors.city = "City is required";
    if (!billingInfo.state) errors.state = "State is required";
    if (!billingInfo.pincode) errors.pincode = "Postal code is required";

    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
      if (typeof setFormErrors === "function") {
        setFormErrors(errors);
      }
      toast.error("Please fill all required fields",{
        position: "top-right",
        autoClose: 1000,
      });
      return;
    }

    console.log("Billing address validation passed, proceeding to save");

    try {
      setIsSaving(true);
      console.log("Saving billing address with data:", billingInfo);

      const response = await addAddressapi(
        billingInfo.recipient_name,
        billingInfo.phone,
        billingInfo.address,
        billingInfo.city,
        billingInfo.state,
        billingInfo.pincode
      );

      console.log("Address saved response:", response);

      if (response.status === "success") {
        // Add the new address to the list with the ID from the response
        const newAddress = {
          id: response.address.id,
          ...billingInfo,
        };

        setAddresses((prev) => [...prev, newAddress]);

        if (typeof updateSavedAddresses === "function") {
          updateSavedAddresses((prev) => [...prev, newAddress]);
        }

        setSelectedAddress(newAddress);
        setShowForm(false);
        toast.success("Billing details saved successfully!",{
          position: "top-right",
          autoClose: 1000,
        });

        // Continue to shipping after saving
        handleTabChange("shipping");
      } else {
        toast.error(
          "Failed to save address: " + (response.message || "Unknown error",{
            position: "top-right",
            autoClose: 1000,
          })
        );
      }
    } catch (error) {
      console.error("Billing save error:", error);
      toast.error("Failed to save billing details.",{
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinueToShipping = () => {
    console.log("Continue to Shipping clicked");

    // Clear any form errors to ensure validation passes
    if (typeof setFormErrors === "function") {
      setFormErrors({});
    }

    console.log("Selected billing address for checkout:", selectedAddress);
    console.log("Billing info being passed to shipping:", billingInfo);

    // Force the tabsCompleted state to mark billing as complete
    handleTabChange("shipping");
  };

  const handleEditClick = (e, addr) => {
    e.stopPropagation(); // Prevent address selection when clicking edit
    console.log("Edit icon clicked for address:", addr);

    // Set the form values to the address being edited
    setBillingInfo({
      recipient_name: addr.recipient_name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });

    setEditingAddress(addr);
  };

  return (
    <div className="ch-billing-info">
      <div style={{ position: "relative" }}>
        <div className="ch-section-title">Billing Information</div>
        <div className="ch-section-subtitle">
          Manage your saved addresses or add a new one.
        </div>
        <div
          className="ch-add-new-address-box"
          onClick={() => {
            console.log("Add new address clicked");
            setEditingAddress(null); // Clear any editing state
            setShowForm(true);

            // Reset billing info when adding a new address
            setBillingInfo({
              recipient_name: "",
              phone: "",
              address: "",
              city: "",
              state: "",
              pincode: "",
            });
          }}
        >
          <Plus size={24} className="ch-add-icon" />
        </div>
      </div>
      {addresses.length > 0 && (
        <div className="ch-saved-details-box">
          <h3>Saved Billing Addresses</h3>
          <div className="ch-address-container">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`ch-saved-address-box ${
                  selectedAddress?.id === addr.id ? "selected" : ""
                }`}
                onClick={() => {
                  // Only select the address if we're not in edit mode
                  if (editingAddress?.id !== addr.id) {
                    handleSelectAddress(addr);
                  }
                }}
              >
                {editingAddress?.id === addr.id ? (
                  <form
                    onSubmit={handleEditSubmit}
                    className="ch-edit-form"
                    onClick={(e) => e.stopPropagation()} // Prevent address selection when clicking the form
                  >
                    <FormField
                      id="recipient_name"
                      name="recipient_name"
                      label="Full Name"
                      type="text"
                      value={billingInfo.recipient_name || ""}
                      onChange={handleBillingChange}
                      error={formErrors?.recipient_name}
                    />
                    <FormField
                      id="phone"
                      name="phone"
                      label="Phone Number"
                      type="tel"
                      value={billingInfo.phone || ""}
                      onChange={handleBillingChange}
                      error={formErrors?.phone}
                    />
                    <FormField
                      id="address"
                      name="address"
                      label="Street Address"
                      type="text"
                      value={billingInfo.address || ""}
                      onChange={handleBillingChange}
                      fullWidth
                      error={formErrors?.address}
                    />
                    <div className="ch-form-group">
                      <FormField
                        id="city"
                        name="city"
                        label="City"
                        type="text"
                        value={billingInfo.city || ""}
                        onChange={handleBillingChange}
                        error={formErrors?.city}
                      />
                      <FormField
                        id="state"
                        name="state"
                        label="State/Province"
                        type="text"
                        value={billingInfo.state || ""}
                        onChange={handleBillingChange}
                        error={formErrors?.state}
                      />
                      <FormField
                        id="pincode"
                        name="pincode"
                        label="Postal Code"
                        type="text"
                        value={billingInfo.pincode || ""}
                        onChange={handleBillingChange}
                        error={formErrors?.pincode}
                      />
                    </div>
                    <div className="ch-edit-form-buttons">
                      <button
                        type="submit"
                        className="ch-save-btn"
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        className="ch-cancel-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAddress(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p>
                      <strong>Name:</strong> {addr.recipient_name}
                    </p>
                    <p>
                      <strong>Phone:</strong> {addr.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {addr.address}, {addr.city},{" "}
                      {addr.state}, {addr.pincode}
                    </p>
                    <Edit
                      size={18}
                      className="ch-edit-icon"
                      onClick={(e) => handleEditClick(e, addr)}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
          {selectedAddress && !editingAddress && (
            <button
              className="ch-primary-button ch-shipping-button"
              onClick={handleContinueToShipping}
              disabled={isSaving}
            >
              Continue to Shipping
            </button>
          )}
        </div>
      )}
      {showForm && !editingAddress && (
        <>
          <div className="ch-form-info-box">
            <Info size={18} />
            <span className="ch-info-text">
              All fields marked with * are required
            </span>
          </div>
          <FormField
            id="recipient_name"
            name="recipient_name"
            label="Full Name *"
            type="text"
            value={billingInfo.recipient_name || ""}
            onChange={handleBillingChange}
            error={formErrors?.recipient_name}
          />
          <FormField
            id="phone"
            name="phone"
            label="Phone Number *"
            type="tel"
            value={billingInfo.phone || ""}
            onChange={handleBillingChange}
            error={formErrors?.phone}
          />
          <FormField
            id="address"
            name="address"
            label="Street Address *"
            type="text"
            value={billingInfo.address || ""}
            onChange={handleBillingChange}
            fullWidth
            error={formErrors?.address}
          />
          <div className="ch-form-group">
            <FormField
              id="city"
              name="city"
              label="City *"
              type="text"
              value={billingInfo.city || ""}
              onChange={handleBillingChange}
              error={formErrors?.city}
            />
            <FormField
              id="state"
              name="state"
              label="State/Province *"
              type="text"
              value={billingInfo.state || ""}
              onChange={handleBillingChange}
              error={formErrors?.state}
            />
            <FormField
              id="pincode"
              name="pincode"
              label="Postal Code *"
              type="text"
              value={billingInfo.pincode || ""}
              onChange={handleBillingChange}
              error={formErrors?.pincode}
            />
          </div>
          <button
            className="ch-primary-button"
            onClick={handleSaveDetails}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Continue to Shipping"}
          </button>
        </>
      )}
    </div>
  );
};

export default BillingForm;
