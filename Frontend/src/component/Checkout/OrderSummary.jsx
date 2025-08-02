import { AlertTriangle } from "lucide-react";

const OrderSummary = ({
  cartItems,
  subtotalAmount,
  shippingMethod,
  shippingCharge,
  taxAmount,
  totalAmount,
}) => {
  return (
    <div className="ch-order-summary">
      <div className="ch-summary-title">ORDER SUMMARY</div>

      {cartItems.length === 0 ? (
        <div className="ch-empty-cart-message">
          <AlertTriangle size={18} />
          <div className="ch-empty-cart-text">Your cart is empty</div>
        </div>
      ) : (
        <>
          <div className="ch-order-items">
            {cartItems.map((item) => (
              <div key={item.item_id} className="ch-order-item">
                <img
                  src={`${import.meta.env.VITE_baseUrl}${item.item_image}`}
                  alt={item.item_name}
                  className="ch-item-image"
                />
                <div className="ch-item-details">
                  <div className="ch-item-name">{item.item_name}</div>
                  <div className="ch-item-price">
                    {item.item_qty} x ₹{item.item_price}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="ch-order-totals">
            <div className="ch-order-total-row">
              <span className="ch-total-label">Subtotal:</span>
              <span className="ch-total-value">
                ₹{subtotalAmount.toFixed(2)}
              </span>
            </div>

            {shippingMethod && (
              <div className="ch-order-total-row">
                <span className="ch-total-label">
                  Shipping ({shippingMethod}):
                </span>
                <span className="ch-total-value">
                  ₹{shippingCharge.toFixed(2)}
                </span>
              </div>
            )}

            <div className="ch-order-total-row">
              <span className="ch-total-label">Tax (18%):</span>
              <span className="ch-total-value">₹{taxAmount.toFixed(2)}</span>
            </div>

            <div className="ch-order-total-row ch-grand-total">
              <span className="ch-total-label">Total:</span>
              <span className="ch-total-value">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSummary;
