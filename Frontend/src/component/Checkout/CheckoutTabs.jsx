import { CheckCircle } from "lucide-react";

const CheckoutTabs = ({ activeTab, tabsCompleted, handleTabChange }) => {
  return (
    <div className="ch-checkout-tabs">
      <div
        className={`ch-tab ${activeTab === "billing" ? "ch-active" : ""} ${
          tabsCompleted.billing ? "ch-completed" : ""
        }`}
        onClick={() => handleTabChange("billing")}
      >
        🧾 Billing Info
        {tabsCompleted.billing && (
          <CheckCircle size={16} className="ch-tab-check" />
        )}
      </div>
      <div
        className={`ch-tab ${activeTab === "shipping" ? "ch-active" : ""} ${
          tabsCompleted.shipping ? "ch-completed" : ""
        }`}
        onClick={() => handleTabChange("shipping")}
      >
        🚚 Shipping Info
        {tabsCompleted.shipping && (
          <CheckCircle size={16} className="ch-tab-check" />
        )}
      </div>
      <div
        className={`ch-tab ${activeTab === "payment" ? "ch-active" : ""} ${
          tabsCompleted.payment ? "ch-completed" : ""
        }`}
        onClick={() => handleTabChange("payment")}
      >
        💳 Payment Info
        {tabsCompleted.payment && (
          <CheckCircle size={16} className="ch-tab-check" />
        )}
      </div>
    </div>
  );
};

export default CheckoutTabs;
