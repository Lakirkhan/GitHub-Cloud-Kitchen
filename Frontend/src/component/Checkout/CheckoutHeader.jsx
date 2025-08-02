const CheckoutHeader = ({ sessionTimeout, formatTime }) => {
  return (
    <div className="ch-checkout-header">
      <div className="ch-checkout-title">Secure Checkout</div>
      <div className="ch-session-timer">
        <span className="ch-timer-text">
          Session expires in: {formatTime(sessionTimeout)}
        </span>
      </div>
    </div>
  );
};

export default CheckoutHeader;
 