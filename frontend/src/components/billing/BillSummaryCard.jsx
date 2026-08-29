import { formatCurrency } from "../../utils/format";

const paymentOptions = ["Cash", "GPay"];

// Matches the Figma "Billing" screen: a single card with the cart items,
// a Cash/GPay pill selector, Subtotal / Investment / Total rows, and
// Save/Cancel actions — replacing the old separate cart + sticky footer.
const BillSummaryCard = ({ cartItems, paymentMethod, onSelectPayment, onSave, onCancel, isSaving }) => {
  const items = Object.values(cartItems);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const investment = items.reduce(
    (sum, item) => sum + (item.product.costPrice || 0) * item.quantity,
    0
  );
  const total = subtotal;

  if (items.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4">
      <h2 className="text-sm font-semibold text-textmain dark:text-card mb-3">Bill Summary</h2>

      {/* Items */}
      <div className="mb-3">
        {items.map(({ product, quantity }) => (
          <div key={product._id} className="flex items-center justify-between py-1.5 text-sm">
            <span className="text-textmain dark:text-card">
              {product.name} <span className="text-gray-400">× {quantity}</span>
            </span>
            <span className="text-textmain dark:text-card font-medium">
              {formatCurrency(product.price * quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Payment method pills */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <span className="text-xs text-gray-500 dark:text-gray-400">Payment:</span>
        {paymentOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelectPayment(option)}
            className="flex items-center gap-1.5"
          >
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === option ? "border-primary" : "border-gray-300 dark:border-gray-600"
              }`}
            >
              {paymentMethod === option && <span className="w-2 h-2 rounded-full bg-primary" />}
            </span>
            <span className="text-sm font-medium text-textmain dark:text-card">{option}</span>
          </button>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
          <span className="text-textmain dark:text-card font-medium">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Investment</span>
          <span className="text-danger font-medium">{formatCurrency(investment)}</span>
        </div>
        <div className="flex items-center justify-between rounded-btn bg-primary/10 px-3 py-2.5 mt-2">
          <span className="text-sm font-semibold text-textmain dark:text-card">Total Amount</span>
          <span className="text-base font-bold text-primary">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-12 rounded-btn bg-danger/10 text-danger text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !paymentMethod}
          className="flex-1 h-12 rounded-btn bg-success text-white text-sm font-semibold disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Bill"}
        </button>
      </div>
    </div>
  );
};

export default BillSummaryCard;
