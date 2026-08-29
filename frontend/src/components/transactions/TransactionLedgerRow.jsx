import { formatCurrency } from "../../utils/format";

// Formats a date compactly for the table, e.g. "26/07/26"
const formatLedgerDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "2-digit" });
};

// A single row of the Transactions table — matches the Figma layout
// (Date | Customer | Amount | Payment | Status), with Investment added
// as small red text under the amount since that's an explicitly requested
// feature that the reference frames didn't have a column for.
const TransactionLedgerRow = ({ transaction }) => {
  return (
    <div className="grid grid-cols-[52px_1fr_60px_50px] gap-x-2 items-center py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-b-0 text-xs">
      <span className="text-gray-500 dark:text-gray-400">{formatLedgerDate(transaction.createdAt)}</span>
      <span className="text-textmain dark:text-card font-medium truncate">
        {transaction.customerName}
      </span>
      <div className="text-right">
        <p className="text-textmain dark:text-card font-semibold">
          {formatCurrency(transaction.totalAmount)}
        </p>
        {transaction.investmentAmount > 0 && (
          <p className="text-danger text-[10px]">-{formatCurrency(transaction.investmentAmount)}</p>
        )}
      </div>
      <span className="text-gray-500 dark:text-gray-400 text-right">{transaction.paymentMethod}</span>
    </div>
  );
};

export default TransactionLedgerRow;
