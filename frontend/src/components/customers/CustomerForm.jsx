import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";

// Used for both "Add Customer" and "Edit Customer" — pass `initialCustomer` to edit
const CustomerForm = ({ initialCustomer = null, onSubmit, onCancel, isSaving }) => {
  const [name, setName] = useState(initialCustomer?.name || "");
  const [phone, setPhone] = useState(initialCustomer?.phone || "");
  const [address, setAddress] = useState(initialCustomer?.address || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Please enter a name and phone number");
      return;
    }
    setError("");
    onSubmit({ name: name.trim(), phone: phone.trim(), address: address.trim() });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4 mb-4"
    >
      <h2 className="text-sm font-semibold text-textmain dark:text-card mb-3">
        {initialCustomer ? "Edit Customer" : "Add Customer"}
      </h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Customer name"
        className="w-full h-11 px-3 mb-2.5 rounded-btn bg-background dark:bg-[#121717] text-sm text-textmain dark:text-card placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
        type="tel"
        className="w-full h-11 px-3 mb-2.5 rounded-btn bg-background dark:bg-[#121717] text-sm text-textmain dark:text-card placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address (optional)"
        className="w-full h-11 px-3 mb-2.5 rounded-btn bg-background dark:bg-[#121717] text-sm text-textmain dark:text-card placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />

      {error && <p className="text-xs text-danger mb-2">{error}</p>}

      <div className="flex gap-2 mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-11 rounded-btn bg-background dark:bg-[#121717] text-sm font-semibold text-textmain dark:text-card flex items-center justify-center gap-1"
        >
          <HiOutlineX /> Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 h-11 rounded-btn bg-primary text-white text-sm font-semibold disabled:opacity-60"
        >
          {isSaving ? "Saving..." : initialCustomer ? "Update" : "Add Customer"}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
