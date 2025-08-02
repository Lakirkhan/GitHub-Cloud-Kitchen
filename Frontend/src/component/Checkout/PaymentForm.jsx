import { Shield } from "lucide-react";
import FormField from "./FormField";
import PaymentMethods from "./PaymentMethods";
import { useEffect } from "react";
import { clearcartApi } from "../../services/Cart_api";
import { toast } from "react-toastify";

const PaymentForm = ({
  paymentMethod,
  setPaymentMethod,
  paymentInfo,
  handlePaymentChange,
  formErrors,
  setFormErrors,
  termsAccepted,
  setTermsAccepted,
  handleTabChange,
  handlePlaceOrder,
  isSubmitting,
}) => {
  const validatePaymentForm = () => {
    const errors = {};

    if (paymentMethod === "card") {
      if (!paymentInfo.cardName) errors.cardName = "Name on card is required";
      if (!paymentInfo.cardNumber)
        errors.cardNumber = "Card number is required";
      else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(paymentInfo.cardNumber))
        errors.cardNumber = "Invalid card number format";

      if (!paymentInfo.expiryDate)
        errors.expiryDate = "Expiry date is required";
      else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate))
        errors.expiryDate = "Invalid expiry date format (MM/YY)";

      if (!paymentInfo.cvv) errors.cvv = "CVV is required";
      else if (!/^\d{3,4}$/.test(paymentInfo.cvv))
        errors.cvv = "CVV must be 3 or 4 digits";
    }

    if (!termsAccepted)
      errors.terms = "You must accept the terms and conditions";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onPlaceOrder = async () => {
    console.log("Validating payment form before placing order");

    if (validatePaymentForm()) {
      console.log(
        "Payment form validation passed, clearing cart and proceeding with order"
      );

      try {
        // Call clearCart API before proceeding with the order
        await clearcartApi();
        console.log("Cart cleared successfully");

        // Proceed to handle placing the order
        handlePlaceOrder();
        toast.success("Order placed successfully!", {
          position: "top-center",
          autoClose: 1000,
        });
      } catch (error) {
        console.log("Failed to clear cart, order will not be placed");
        // You might want to handle the error (e.g., show a notification or message to the user)
      }
    } else {
      console.log("Payment form validation failed");
    }
  };

  return (
    <div className="ch-payment-info">
      <div className="ch-section-title">Payment Information</div>
      <div className="ch-section-subtitle">
        Select a payment method to complete your order.
      </div>

      <div className="ch-security-notice">
        <Shield size={18} />
        <span className="ch-security-text">
          Your payment information is encrypted and secure
        </span>
      </div>

      <PaymentMethods
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
      />

      {paymentMethod === "card" && (
        <div className="ch-card-details">
          <FormField
            id="cardName"
            name="cardName"
            label="Name on Card *"
            type="text"
            value={paymentInfo.cardName}
            onChange={handlePaymentChange}
            error={formErrors.cardName}
            placeholder="As it appears on your card"
          />

          <FormField
            id="cardNumber"
            name="cardNumber"
            label="Card Number *"
            type="text"
            value={paymentInfo.cardNumber}
            onChange={handlePaymentChange}
            error={formErrors.cardNumber}
            placeholder="XXXX XXXX XXXX XXXX"
            maxLength={19}
          />

          <div className="ch-form-group">
            <FormField
              id="expiryDate"
              name="expiryDate"
              label="Expiry Date (MM/YY) *"
              type="text"
              value={paymentInfo.expiryDate}
              onChange={handlePaymentChange}
              error={formErrors.expiryDate}
              placeholder="MM/YY"
              maxLength={5}
            />

            <FormField
              id="cvv"
              name="cvv"
              label="CVV *"
              type="text"
              value={paymentInfo.cvv}
              onChange={handlePaymentChange}
              error={formErrors.cvv}
              placeholder="XXX"
              maxLength={4}
            />
          </div>
        </div>
      )}

      <div className="ch-terms-and-conditions">
        <div className="ch-form-checkbox">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={() => {
              setTermsAccepted(!termsAccepted);
              // Clear terms error when checked
              if (formErrors.terms) {
                const { terms, ...otherErrors } = formErrors;
                setFormErrors(otherErrors);
              }
            }}
            className={
              formErrors.terms ? "ch-checkbox ch-error" : "ch-checkbox"
            }
          />
          <label htmlFor="terms" className="ch-checkbox-label">
            I agree to the{" "}
            <a href="#" className="ch-terms-link">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="ch-privacy-link">
              Privacy Policy
            </a>{" "}
            *
          </label>
        </div>
        {formErrors.terms && (
          <div className="ch-error-message">{formErrors.terms}</div>
        )}
      </div>

      <div className="ch-form-actions">
        <button
          className="ch-secondary-button"
          onClick={() => handleTabChange("shipping")}
        >
          ← Back to Shipping
        </button>
        <button
          className={`ch-primary-button ${isSubmitting ? "ch-loading" : ""}`}
          onClick={onPlaceOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
