const PaymentMethods = ({
  paymentMethod,
  setPaymentMethod,
  formErrors,
  setFormErrors,
}) => {
  return (
    <div className="ch-payment-methods">
      <div
        className={`ch-payment-method-card ${
          paymentMethod === "card" ? "ch-selected" : ""
        }`}
      >
        <input
          type="radio"
          id="card-payment"
          name="payment"
          value="card"
          checked={paymentMethod === "card"}
          onChange={(e) => {
            setPaymentMethod(e.target.value);
            // Clear payment method error
            if (formErrors.paymentMethod) {
              const { paymentMethod, ...otherErrors } = formErrors;
              setFormErrors(otherErrors);
            }
          }}
          className="ch-radio-input"
        />
        <label htmlFor="card-payment" className="ch-payment-label">
          <div className="ch-payment-method-name">Credit/Debit Card</div>
          <div className="ch-payment-method-icons">
            <span className="ch-card-icon ch-visa">Visa</span>
            <span className="ch-card-icon ch-mastercard">Mastercard</span>
            <span className="ch-card-icon ch-amex">Amex</span>
          </div>
        </label>
      </div>

      <div
        className={`ch-payment-method-card ${
          paymentMethod === "cod" ? "ch-selected" : ""
        }`}
      >
        <input
          type="radio"
          id="cod-payment"
          name="payment"
          value="cod"
          checked={paymentMethod === "cod"}
          onChange={(e) => {
            setPaymentMethod(e.target.value);
            // Clear payment method error
            if (formErrors.paymentMethod) {
              const { paymentMethod, ...otherErrors } = formErrors;
              setFormErrors(otherErrors);
            }
          }}
          className="ch-radio-input"
        />
        <label htmlFor="cod-payment" className="ch-payment-label">
          <div className="ch-payment-method-name">Cash on Delivery</div>
          <div className="ch-payment-method-description">
            Pay when you receive your order
          </div>
        </label>
      </div>

      {formErrors.paymentMethod && (
        <div className="ch-error-message">{formErrors.paymentMethod}</div>
      )}
    </div>
  );
};

export default PaymentMethods;
