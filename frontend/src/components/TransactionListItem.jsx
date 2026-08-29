import { HiOutlineCash, HiOutlineDeviceMobile } from "react-icons/hi";
import { formatCurrency, formatDateTime } from "../utils/format";

// A single row in the "Recent Transactions" list on the Dashboard
const TransactionListItem = ({ transaction }) => {
  const isCash = transaction.paymentMethod === "Cash";

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isCash ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
          }`}
        >
          {isCash ? <HiOutlineCash className="text-lg" /> : <HiOutlineDeviceMobile className="text-lg" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-textmain dark:text-card">
            {transaction.customerName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDateTime(transaction.createdAt)} · {transaction.paymentMethod}
          </p>
        </div>
      </div>
      <p className="text-sm font-bold text-textmain dark:text-card">
        {formatCurrency(transaction.totalAmount)}
      </p>
    </div>
  );
};

export default TransactionListItem;
