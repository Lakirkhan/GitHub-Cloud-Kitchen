const CheckoutProgress = ({ activeTab, tabsCompleted }) => {
  return (
    <div className="ch-checkout-progress">
      <div
        className={`ch-progress-step ${
          activeTab === "billing" ? "ch-active" : ""
        } ${tabsCompleted.billing ? "ch-completed" : ""}`}
      >
        <div className="ch-step-number">1</div>
        <div className="ch-step-label">Billing</div>
      </div>
      <div className="ch-progress-line"></div>
      <div
        className={`ch-progress-step ${
          activeTab === "shipping" ? "ch-active" : ""
        } ${tabsCompleted.shipping ? "ch-completed" : ""}`}
      >
        <div className="ch-step-number">2</div>
        <div className="ch-step-label">Shipping</div>
      </div>
      <div className="ch-progress-line"></div>
      <div
        className={`ch-progress-step ${
          activeTab === "payment" ? "ch-active" : ""
        } ${tabsCompleted.payment ? "ch-completed" : ""}`}
      >
        <div className="ch-step-number">3</div>
        <div className="ch-step-label">Payment</div>
      </div>
    </div>
  );
};

export default CheckoutProgress;
