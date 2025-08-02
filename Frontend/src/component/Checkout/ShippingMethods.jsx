const ShippingMethods = ({
  shippingMethod,
  setShippingMethod,
  setShippingCharge,
  formErrors,
  setFormErrors,
}) => {
  return (
    <div className="ch-shipping-methods">
      <div className="ch-shipping-title">Select Shipping Method *</div>

      <div className="ch-shipping-method-options">
        <div
          className={`ch-shipping-method-card ${
            shippingMethod === "standard" ? "ch-selected" : ""
          }`}
        >
          <input
            type="radio"
            id="standard-shipping"
            name="shipping-method"
            value="standard"
            checked={shippingMethod === "standard"}
            onChange={() => {
              setShippingMethod("standard");
              setShippingCharge(50);
              // Clear shipping method error
              if (formErrors.shippingMethod) {
                const { shippingMethod, ...otherErrors } = formErrors;
                setFormErrors(otherErrors);
              }
            }}
            className="ch-radio-input"
          />
          <label htmlFor="standard-shipping" className="ch-shipping-label">
            <div className="ch-shipping-method-info">
              <div className="ch-shipping-method-name">Standard Shipping</div>
              <div className="ch-shipping-method-price">₹50</div>
              {/* <div className="ch-shipping-method-time"></div> */}
            </div>
          </label>
        </div>

        <div
          className={`ch-shipping-method-card ${
            shippingMethod === "express" ? "ch-selected" : ""
          }`}
        >
          <input
            type="radio"
            id="express-shipping"
            name="shipping-method"
            value="express"
            checked={shippingMethod === "express"}
            onChange={() => {
              setShippingMethod("express");
              setShippingCharge(100);
              // Clear shipping method error
              if (formErrors.shippingMethod) {
                const { shippingMethod, ...otherErrors } = formErrors;
                setFormErrors(otherErrors);
              }
            }}
            className="ch-radio-input"
          />
          <label htmlFor="express-shipping" className="ch-shipping-label">
            <div className="ch-shipping-method-info">
              <div className="ch-shipping-method-name">Express Shipping</div>
              <div className="ch-shipping-method-price">₹100</div>
              {/* <div className="ch-shipping-method-time">2-3 Business Days</div> */}
            </div>
          </label>
        </div>
      </div>

      {formErrors.shippingMethod && (
        <div className="ch-error-message">{formErrors.shippingMethod}</div>
      )}
    </div>
  );
};

export default ShippingMethods;
