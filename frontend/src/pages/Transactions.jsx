import { useEffect, useState } from "react";
import { HiOutlineSearch, HiOutlineClipboardList } from "react-icons/hi";
import MainLayout from "../layouts/MainLayout";
import TransactionLedgerRow from "../components/transactions/TransactionLedgerRow";
import { getTransactions } from "../services/transactionService";
import getErrorMessage from "../utils/getErrorMessage";

const Transactions = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // "latest" or "earliest"
  const [paymentFilter, setPaymentFilter] = useState(null); // null, "GPay", or "Cash"
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounced fetch whenever the search term changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await getTransactions({ search });
        let filtered = [...data];

        // Filter by payment method
        if (paymentFilter) {
          filtered = filtered.filter((txn) => txn.paymentMethod === paymentFilter);
        }

        // Sort by date
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortBy === "latest" ? dateB - dateA : dateA - dateB;
        });

        setTransactions(filtered);
        setError("");
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [search, sortBy, paymentFilter]);

  return (
    <MainLayout>
      {/* Search input */}
      <div className="mb-4">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full h-11 pl-10 pr-3 rounded-btn bg-white dark:bg-[#1A2020] shadow-softer text-sm text-textmain dark:text-card placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Filter buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4 sm:flex sm:flex-wrap">
        {/* Sort buttons */}
        <button
          onClick={() => setSortBy("latest")}
          className={`px-3 h-10 rounded-btn text-sm font-semibold transition-colors ${
            sortBy === "latest"
              ? "bg-primary text-white"
              : "bg-white dark:bg-[#1A2020] text-textmain dark:text-card shadow-softer"
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => setSortBy("earliest")}
          className={`px-3 h-10 rounded-btn text-sm font-semibold transition-colors ${
            sortBy === "earliest"
              ? "bg-primary text-white"
              : "bg-white dark:bg-[#1A2020] text-textmain dark:text-card shadow-softer"
          }`}
        >
          Earliest
        </button>

        {/* Payment method filters */}
        <button
          onClick={() => setPaymentFilter(paymentFilter === "GPay" ? null : "GPay")}
          className={`px-3 h-10 rounded-btn text-sm font-semibold transition-colors ${
            paymentFilter === "GPay"
              ? "bg-primary text-white"
              : "bg-white dark:bg-[#1A2020] text-textmain dark:text-card shadow-softer"
          }`}
        >
          GPay
        </button>
        <button
          onClick={() => setPaymentFilter(paymentFilter === "Cash" ? null : "Cash")}
          className={`px-3 h-10 rounded-btn text-sm font-semibold transition-colors ${
            paymentFilter === "Cash"
              ? "bg-primary text-white"
              : "bg-white dark:bg-[#1A2020] text-textmain dark:text-card shadow-softer"
          }`}
        >
          Cash
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-btn bg-background dark:bg-[#121717] animate-pulse" />
            ))}
          </div>
        )}

        {error && !isLoading && <p className="text-sm text-danger">{error}</p>}

        {!isLoading && !error && transactions.length === 0 && (
          <div className="text-center py-10">
            <HiOutlineClipboardList className="text-3xl text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {search || paymentFilter ? "No matching transactions found." : "No transactions yet."}
            </p>
          </div>
        )}

        {!isLoading && !error && transactions.length > 0 && (
          <>
            <div className="grid grid-cols-[52px_1fr_60px_50px] gap-x-2 pb-2 mb-1 border-b border-gray-200 dark:border-gray-700">
              <span className="text-[10px] font-semibold text-gray-400 uppercase">Date</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase">Customer</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase text-right">
                Amount
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase text-right">
                Payment
              </span>
            </div>
            {transactions.map((txn) => (
              <TransactionLedgerRow key={txn.id} transaction={txn} />
            ))}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Transactions;
