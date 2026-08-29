import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiPlus } from "react-icons/hi";
import MainLayout from "../layouts/MainLayout";
import CustomerPicker from "../components/CustomerPicker";
import ProductPicker from "../components/billing/ProductPicker";
import BillSummaryCard from "../components/billing/BillSummaryCard";
import { saveBill } from "../services/billingService";
import getErrorMessage from "../utils/getErrorMessage";

const Billing = () => {
  const navigate = useNavigate();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cartItems, setCartItems] = useState({}); // { [productId]: { product, quantity } }
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const itemCount = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);

  const handleIncrease = (product) => {
    setCartItems((prev) => {
      const existing = prev[product._id];
      return {
        ...prev,
        [product._id]: {
          product,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
  };

  const handleDecrease = (productId) => {
    setCartItems((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;

      if (existing.quantity <= 1) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }

      return {
        ...prev,
        [productId]: { ...existing, quantity: existing.quantity - 1 },
      };
    });
  };

  const handleCancel = () => {
    setCartItems({});
    setSelectedCustomer(null);
    setPaymentMethod(null);
    setError("");
  };

  const handleSaveBill = async () => {
    if (!selectedCustomer) {
      setError("Please select a customer");
      return;
    }
    if (itemCount === 0) {
      setError("Please add at least one product");
      return;
    }
    if (!paymentMethod) {
      setError("Please choose a payment method");
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      await saveBill({
        customerId: selectedCustomer._id,
        items: Object.values(cartItems).map(({ product, quantity }) => ({
          productId: product._id,
          quantity,
        })),
        paymentMethod,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout showFab={false}>
      <div className="space-y-4">
        {/* Bill Summary appears at the top when products are added */}
        {Object.keys(cartItems).length > 0 && (
          <BillSummaryCard
            cartItems={cartItems}
            paymentMethod={paymentMethod}
            onSelectPayment={setPaymentMethod}
            onSave={handleSaveBill}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        )}

        <CustomerPicker selectedCustomer={selectedCustomer} onSelect={setSelectedCustomer} />

        <ProductPicker
          cartItems={cartItems}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />

        {error && (
          <p className="text-sm text-danger bg-danger/10 rounded-btn px-3 py-2">{error}</p>
        )}
      </div>

      {/* Matches the Figma "Calculator page" floating + — opens Product Management to add a new product */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none">
        <div className="relative w-full max-w-app h-0">
          <button
            onClick={() => navigate("/products")}
            aria-label="Add Product"
            className="pointer-events-auto absolute bottom-24 right-4 w-14 h-14 rounded-full bg-primary text-white shadow-soft flex items-center justify-center active:scale-95 transition-transform"
          >
            <HiPlus className="text-2xl" />
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Billing;
