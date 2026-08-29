import { useState } from "react";
import { HiOutlineUpload, HiOutlineX } from "react-icons/hi";
import { getImageUrl } from "../../utils/getImageUrl";

// Matches the Figma "New products" screen: labeled Name/Price fields, an
// Image box with an Import button, and Save (green) / Cancel (red) actions.
// Used for both "Add Product" and "Edit Product" — pass `initialProduct` to edit.
const ProductForm = ({ initialProduct = null, onSubmit, onCancel, isSaving }) => {
  const [name, setName] = useState(initialProduct?.name || "");
  const [price, setPrice] = useState(initialProduct?.price ?? "");
  const [costPrice, setCostPrice] = useState(initialProduct?.costPrice ?? "");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(getImageUrl(initialProduct?.image));
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || price === "") {
      setError("Please enter a product name and price");
      return;
    }
    if (Number(price) < 0) {
      setError("Price cannot be negative");
      return;
    }
    if (costPrice !== "" && Number(costPrice) < 0) {
      setError("Cost price cannot be negative");
      return;
    }
    setError("");

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("price", price);
    formData.append("costPrice", costPrice === "" ? 0 : costPrice);
    if (imageFile) formData.append("image", imageFile);

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4 mb-4"
    >
      <h2 className="text-sm font-semibold text-textmain dark:text-card mb-4">
        {initialProduct ? "Edit Product" : "New Product"}
      </h2>

      <label className="block mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        Name:
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full h-11 px-3 mb-3 rounded-btn bg-background dark:bg-[#121717] text-sm text-textmain dark:text-card focus:outline-none focus:ring-2 focus:ring-primary/40"
      />

      <label className="block mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        Price: ₹
      </label>
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        min="0"
        className="w-full h-11 px-3 mb-3 rounded-btn bg-background dark:bg-[#121717] text-sm text-textmain dark:text-card focus:outline-none focus:ring-2 focus:ring-primary/40"
      />

      <label className="block mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        Cost / Investment: ₹ <span className="text-gray-400">(optional, for profit tracking)</span>
      </label>
      <input
        value={costPrice}
        onChange={(e) => setCostPrice(e.target.value)}
        type="number"
        min="0"
        className="w-full h-11 px-3 mb-3 rounded-btn bg-background dark:bg-[#121717] text-sm text-textmain dark:text-card focus:outline-none focus:ring-2 focus:ring-primary/40"
      />

      <label className="block mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        Image:
      </label>
      <div className="w-full h-24 mb-4 rounded-btn bg-background dark:bg-[#121717] border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden relative">
        {previewUrl ? (
          <img src={previewUrl} alt="Product preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-gray-400">No image selected</span>
        )}
        <label className="absolute bottom-2 right-2 flex items-center gap-1 px-3 h-8 rounded-btn bg-white dark:bg-[#1A2020] shadow-softer text-xs font-semibold text-textmain dark:text-card cursor-pointer">
          <HiOutlineUpload className="text-sm" />
          Import
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
      </div>

      {error && <p className="text-xs text-danger mb-2">{error}</p>}

      <div className="flex gap-2 mt-1">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 h-12 rounded-btn bg-success text-white text-sm font-semibold disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-12 rounded-btn bg-danger text-white text-sm font-semibold flex items-center justify-center gap-1"
        >
          <HiOutlineX /> Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
