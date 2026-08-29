import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { getProducts } from "../../services/productService";
import ProductGridCard from "./ProductGridCard";

// Renders the Figma-style 2-column product grid. Adding/editing products
// themselves happens on the full Product Management screen (Module 4) —
// tapping a card's pencil, or the "Manage Products" link when the grid is
// empty, takes you there, so there's only one place that logic lives.
const ProductPicker = ({ cartItems, onIncrease, onDecrease }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  const getQuantity = (productId) => cartItems[productId]?.quantity || 0;

  return (
    <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-textmain dark:text-card">Products</h2>
        <button
          onClick={() => navigate("/products")}
          className="text-xs font-semibold text-primary"
        >
          Manage
        </button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-card bg-background dark:bg-[#121717] animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="text-center py-6">
          <HiOutlineShoppingBag className="text-3xl text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No products yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="px-4 h-9 rounded-btn bg-primary text-white text-xs font-semibold"
          >
            Add Your First Product
          </button>
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => {
            const quantity = getQuantity(product._id);
            return (
              <ProductGridCard
                key={product._id}
                product={product}
                quantity={quantity}
                onAdd={() => onIncrease(product)}
                onIncrease={() => onIncrease(product)}
                onDecrease={() => onDecrease(product._id)}
                onEdit={() => navigate("/products")}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductPicker;
