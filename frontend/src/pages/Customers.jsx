import { useEffect, useState } from "react";
import { HiOutlineSearch, HiOutlinePlus, HiOutlineUsers } from "react-icons/hi";
import MainLayout from "../layouts/MainLayout";
import CustomerForm from "../components/customers/CustomerForm";
import CustomerCard from "../components/customers/CustomerCard";
import { getCustomers, createCustomer, updateCustomer } from "../services/customerService";
import getErrorMessage from "../utils/getErrorMessage";

const Customers = () => {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [formMode, setFormMode] = useState(null); // null | "add" | customer-being-edited
  const [isSaving, setIsSaving] = useState(false);

  const loadCustomers = async (term = search) => {
    setIsLoading(true);
    try {
      const data = await getCustomers(term);
      setCustomers(data);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search as the user types
  useEffect(() => {
    const timer = setTimeout(() => {
      loadCustomers(search);
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSubmit = async (data) => {
    setIsSaving(true);
    setError("");
    try {
      if (formMode && formMode !== "add") {
        await updateCustomer(formMode._id, data);
      } else {
        await createCustomer(data);
      }
      setFormMode(null);
      loadCustomers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-textmain dark:text-card">Customers</h1>
        {!formMode && (
          <button
            onClick={() => setFormMode("add")}
            className="flex items-center gap-1 px-3 h-9 rounded-btn bg-primary text-white text-xs font-semibold"
          >
            <HiOutlinePlus /> Add
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone"
          className="w-full h-11 pl-10 pr-3 rounded-btn bg-white dark:bg-[#1A2020] shadow-softer text-sm text-textmain dark:text-card placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {formMode && (
        <CustomerForm
          initialCustomer={formMode !== "add" ? formMode : null}
          onSubmit={handleSubmit}
          onCancel={() => setFormMode(null)}
          isSaving={isSaving}
        />
      )}

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-btn px-3 py-2 mb-4">{error}</p>
      )}

      <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-btn bg-background dark:bg-[#121717] animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && customers.length === 0 && (
          <div className="text-center py-10">
            <HiOutlineUsers className="text-3xl text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {search ? "No matching customers found." : 'No customers yet. Tap "Add" to create one.'}
            </p>
          </div>
        )}

        {!isLoading &&
          customers.map((customer) => (
            <CustomerCard key={customer._id} customer={customer} onEdit={setFormMode} />
          ))}
      </div>
    </MainLayout>
  );
};

export default Customers;
