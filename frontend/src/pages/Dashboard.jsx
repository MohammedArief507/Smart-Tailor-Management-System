import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCurrencyRupee,
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import TransactionListItem from "../components/TransactionListItem";
import { useAuth } from "../context/AuthContext";
import { getDashboardData } from "../services/dashboardService";
import { formatCurrency } from "../utils/format";
import getErrorMessage from "../utils/getErrorMessage";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardData();
        setData(result);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
        <h1 className="text-xl font-bold text-textmain dark:text-card">{user?.shopName}</h1>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-card bg-white/60 dark:bg-[#1A2020]/60 animate-pulse" />
          ))}
        </div>
      )}

      {error && !isLoading && (
        <p className="text-sm text-danger bg-danger/10 rounded-btn px-3 py-2 mb-4">{error}</p>
      )}

      {data && !isLoading && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard
              label="Today's Income"
              value={formatCurrency(data.todayIncome)}
              icon={HiOutlineCurrencyRupee}
              accent="success"
            />
            <StatCard
              label="Today's Bills"
              value={data.todayBills}
              icon={HiOutlineDocumentText}
              accent="primary"
            />
            <StatCard
              label="Total Customers"
              value={data.totalCustomers}
              icon={HiOutlineUsers}
              accent="primary"
              onClick={() => navigate("/customers")}
            />
            <StatCard
              label="Total Products"
              value={data.totalProducts}
              icon={HiOutlineShoppingBag}
              accent="primary"
              onClick={() => navigate("/products")}
            />
          </div>

          {/* Recent transactions */}
          <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4">
            <h2 className="text-sm font-semibold text-textmain dark:text-card mb-1">
              Recent Transactions
            </h2>
            {data.recentTransactions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
                No transactions yet. Create your first bill using the + button.
              </p>
            ) : (
              <div>
                {data.recentTransactions.map((txn) => (
                  <TransactionListItem key={txn.id} transaction={txn} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Dashboard;
