import { useEffect, useState } from "react";
import { HiChevronRight, HiOutlineSearch, HiOutlineFilter, HiPlus } from "react-icons/hi";
import MainLayout from "../layouts/MainLayout";
import CustomerPicker from "../components/CustomerPicker";
import MeasurementForm from "../components/measurements/MeasurementForm";
import { MEASUREMENT_CATEGORIES } from "../utils/measurementFields";
import { getMeasurements, getMeasurementsByCategory, saveMeasurement } from "../services/measurementService";
import getErrorMessage from "../utils/getErrorMessage";

// Formats a date compactly, e.g. "12-03-26" (matches the Figma "last modified" style)
const formatShortDate = (dateString) => {
  const d = new Date(dateString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${String(d.getFullYear()).slice(-2)}`;
};

// Three-screen flow matching the Figma reference:
//   1. "categories" — Blouse / Chudithar / Pant menu
//   2. "list"       — customers who already have that category saved
//   3. "form"       — pick/add a customer, then fill in that category's fields
const Measurements = () => {
  const [view, setView] = useState("categories");
  const [activeCategory, setActiveCategory] = useState(null);

  // List view state
  const [entries, setEntries] = useState([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // Form view state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [savedValues, setSavedValues] = useState(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadList = async (category, term) => {
    setIsListLoading(true);
    try {
      const data = await getMeasurementsByCategory(category, term);
      setEntries(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsListLoading(false);
    }
  };

  const openCategory = (category) => {
    setActiveCategory(category);
    setView("list");
    setSearch("");
    loadList(category, "");
  };

  // Debounced search within the customer list
  useEffect(() => {
    if (view !== "list" || !activeCategory) return;
    const timer = setTimeout(() => loadList(activeCategory, search), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const openForm = async (customer) => {
    setSelectedCustomer(customer || null);
    setSavedValues(null);
    setError("");
    setView("form");

    if (customer) {
      setIsFormLoading(true);
      try {
        const data = await getMeasurements(customer._id);
        setSavedValues(data[activeCategory] || null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsFormLoading(false);
      }
    }
  };

  const handleSave = async (values) => {
    if (!selectedCustomer) {
      setError("Please select a customer");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await saveMeasurement({ customerId: selectedCustomer._id, category: activeCategory, values });
      setView("list");
      loadList(activeCategory, search);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout showFab={false}>
      {/* Screen 1: category menu */}
      {view === "categories" && (
        <div className="measurement-category-list">
          {MEASUREMENT_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => openCategory(category)}
              className="measurement-category-box w-full flex items-center justify-between hover:shadow-lg"
            >
              <span className="text-xl font-bold text-textmain dark:text-card">{category}</span>
              <HiChevronRight className="text-gray-300 size-10 " />
            </button>
          ))}
        </div>
      )}

      {/* Screen 2: customers who have this category saved */}
      {view === "list" && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full h-11 pl-10 pr-3 rounded-btn bg-white dark:bg-[#1A2020] shadow-softer text-sm text-textmain dark:text-card placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="h-11 px-4 rounded-btn bg-white dark:bg-[#1A2020] shadow-softer text-sm font-semibold text-textmain dark:text-card flex items-center gap-1.5"
            >
              <HiOutlineFilter />
              Filter
            </button>
          </div>

          <button
            onClick={() => openForm(null)}
            className="w-full h-11 rounded-btn bg-primary text-white text-sm font-semibold mb-4"
          >
            Create new
          </button>

          <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4">
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-gray-200 dark:border-gray-700">
              <span className="text-[10px] font-semibold text-gray-400 uppercase">Name</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase">Last Modified</span>
            </div>

            {isListLoading && (
              <div className="space-y-2 pt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-9 rounded-btn bg-background dark:bg-[#121717] animate-pulse" />
                ))}
              </div>
            )}

            {!isListLoading && entries.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No {activeCategory} measurements saved yet.
              </p>
            )}

            {!isListLoading &&
              entries.map((entry) => (
                <button
                  key={entry.customerId}
                  onClick={() => openForm({ _id: entry.customerId, name: entry.customerName, phone: entry.customerPhone })}
                  className="w-full flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0"
                >
                  <span className="text-sm text-textmain dark:text-card">{entry.customerName}</span>
                  <span className="text-xs text-gray-400">{formatShortDate(entry.updatedAt)}</span>
                </button>
              ))}
          </div>

          <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none">
            <div className="relative w-full max-w-app h-0">
              <button
                onClick={() => openForm(null)}
                aria-label="Add measurement"
                className="pointer-events-auto absolute bottom-24 right-4 w-14 h-14 rounded-full bg-primary text-white shadow-soft flex items-center justify-center active:scale-95 transition-transform"
              >
                <HiPlus className="text-2xl" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Screen 3: pick/add a customer, then fill in the category's fields */}
      {view === "form" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side: Form */}
          <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4">
            <h2 className="text-sm font-semibold text-textmain dark:text-card mb-3">
              {activeCategory} Measurements
            </h2>

            <div className="mb-4">
              <CustomerPicker selectedCustomer={selectedCustomer} onSelect={setSelectedCustomer} />
            </div>

            {error && (
              <p className="text-sm text-danger bg-danger/10 rounded-btn px-3 py-2 mb-3">{error}</p>
            )}

            {selectedCustomer &&
              (isFormLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-9 rounded-btn bg-background dark:bg-[#121717] animate-pulse" />
                  ))}
                </div>
              ) : (
                <MeasurementForm
                  category={activeCategory}
                  savedValues={savedValues}
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              ))}
          </div>


        </div>
      )}
    </MainLayout>
  );
};

export default Measurements;
