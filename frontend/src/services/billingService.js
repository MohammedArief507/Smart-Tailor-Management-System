import api from "./api";

// Saves a bill. The backend automatically creates a transaction record from it.
export const saveBill = async ({ customerId, items, paymentMethod }) => {
  const response = await api.post("/transactions", { customerId, items, paymentMethod });
  return response.data.transaction;
};
