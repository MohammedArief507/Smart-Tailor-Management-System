import api from "./api";

// Fetches saved transactions, optionally filtered by search term and/or date (YYYY-MM-DD)
export const getTransactions = async ({ search = "", date = "" } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (date) params.date = date;

  const response = await api.get("/transactions", { params });
  return response.data.transactions;
};
