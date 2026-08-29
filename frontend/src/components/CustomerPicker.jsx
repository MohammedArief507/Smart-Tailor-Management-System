import { useEffect, useState } from "react";
import { HiOutlineSearch, HiOutlinePlus, HiOutlineUser, HiOutlinePencil } from "react-icons/hi";
import { getCustomers, createCustomer } from "../services/customerService";
import getErrorMessage from "../utils/getErrorMessage";

const CustomerPicker = ({ selectedCustomer, onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Debounced search as the user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const customers = await getCustomers(query);
        setResults(customers);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) {
      setError("Please enter a name and phone number");
      return;
    }
    setError("");
    setIsSaving(true);
    try {
      const customer = await createCustomer(newCustomer);
      onSelect(customer);
      setShowAddForm(false);
      setNewCustomer({ name: "", phone: "" });
      setQuery("");
      setResults([]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  // Already selected — show a compact confirmation card with a "Change" action
  if (selectedCustomer && !showAddForm) {
    return (
      <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <HiOutlineUser className="text-lg" />
          </div>
          <div>
            <p className="text-sm font-semibold text-textmain dark:text-card">
              {selectedCustomer.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{selectedCustomer.phone}</p>
          </div>
        </div>
        <button
          onClick={() => onSelect(null)}
          className="text-xs font-semibold text-primary flex items-center gap-1"
        >
          <HiOutlinePencil /> Change
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4">
      {!showAddForm ? (
        <>
          <div className="relative mb-2">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customer by name or phone"
              className="w-full h-11 pl-10 pr-3 rounded-btn bg-background dark:bg-[#121717] text-sm text-textmain dark:text-card placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {isSearching && <p className="text-xs text-gray-400 px-1">Searching...</p>}

          {results.length > 0 && (
            <div className="max-h-44 overflow-y-auto mb-2">
              {results.map((customer) => (
                <button
                  key={customer._id}
                  onClick={() => {
                    onSelect(customer);
                    setQuery("");
                    setResults([]);
                  }}
                  className="w-full text-left px-2 py-2.5 rounded-btn hover:bg-background dark:hover:bg-[#121717] flex items-center justify-between"
                >
                  <span className="text-sm text-textmain dark:text-card">{customer.name}</span>
                  <span className="text-xs text-gray-400">{customer.phone}</span>
                </button>
              ))}
            </div>
          )}

          {query.trim() && !isSearching && results.length === 0 && (
            <p className="text-xs text-gray-400 px-1 mb-2">No matching customers found</p>
          )}

          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-primary py-2"
          >
            <HiOutlinePlus /> Add New Customer
          </button>
        </>
      ) : (
        <form onSubmit={handleAddCustomer}>
          <p className="text-sm font-semibold text-textmain dark:text-card mb-3">New Customer</p>
          <input
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            placeholder="Customer name"
            className="w-full h-11 px-3 mb-2.5 rounded-btn bg-background dark:bg-[#121717] text-sm text-textmain dark:text-card placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            placeholder="Phone number"
            type="tel"
            className="w-full h-11 px-3 mb-2.5 rounded-btn bg-background dark:bg-[#121717] text-sm text-textmain dark:text-card placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          {error && <p className="text-xs text-danger mb-2">{error}</p>}

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setError("");
              }}
              className="flex-1 h-11 rounded-btn bg-background dark:bg-[#121717] text-sm font-semibold text-textmain dark:text-card"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 h-11 rounded-btn bg-primary text-white text-sm font-semibold disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CustomerPicker;
