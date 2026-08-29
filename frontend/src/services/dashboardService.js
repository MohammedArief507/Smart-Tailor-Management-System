import api from "./api";

// Fetches today's income, today's bills, total customers, total products,
// and recent transactions for the logged-in shop
export const getDashboardData = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};
