import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiOutlinePlus, HiOutlineShoppingBag } from "react-icons/hi";
import ProductForm from "../components/products/ProductForm";
import ProductCard from "../components/products/ProductCard";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";
import getErrorMessage from "../utils/getErrorMessage";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [formMode, setFormMode] = useState(null); // null | "add" | product-being-edited
  const [isSaving, setIsSaving] = useState(false);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (formData) => {
    setIsSaving(true);
    setError("");
    try {
      if (formMode && formMode !== "add") {
        await updateProduct(formMode._id, formData);
      } else {
        await createProduct(formData);
      }
      setFormMode(null);
      loadProducts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete "${product.name}"? This can't be undone.`);
    if (!confirmed) return;

    try {
      await deleteProduct(product._id);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#121717]">
      <div className="max-w-app mx-auto px-4 pt-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              aria-label="Back"
              className="w-9 h-9 rounded-btn bg-white dark:bg-[#1A2020] shadow-softer flex items-center justify-center text-textmain dark:text-card"
            >
              <HiArrowLeft />
            </button>
            <h1 className="text-lg font-bold text-textmain dark:text-card">Products</h1>
          </div>

          {!formMode && (
            <button
              onClick={() => setFormMode("add")}
              className="flex items-center gap-1 px-3 h-9 rounded-btn bg-primary text-white text-xs font-semibold"
            >
              <HiOutlinePlus /> Add
            </button>
          )}
        </div>

        {error && (
          <p className="text-sm text-danger bg-danger/10 rounded-btn px-3 py-2 mb-4">{error}</p>
        )}

        {formMode && (
          <ProductForm
            initialProduct={formMode !== "add" ? formMode : null}
            onSubmit={handleSubmit}
            onCancel={() => setFormMode(null)}
            isSaving={isSaving}
          />
        )}

        <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4">
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-btn bg-background dark:bg-[#121717] animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <div className="text-center py-10">
              <HiOutlineShoppingBag className="text-3xl text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No products yet. Tap "Add" to create your first one.
              </p>
            </div>
          )}

          {!isLoading &&
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={setFormMode}
                onDelete={handleDelete}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
