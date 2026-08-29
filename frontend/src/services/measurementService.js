import api from "./api";

// Fetches all saved measurements for a customer, grouped by category
export const getMeasurements = async (customerId) => {
  const response = await api.get(`/measurements/${customerId}`);
  return response.data.measurements; // { Blouse: {...}, Chudithar: {...}, Pant: {...} }
};

// Lists customers who have a saved measurement for one category (for the
// category → customer-list screen), optionally filtered by name search
export const getMeasurementsByCategory = async (category, search = "") => {
  const response = await api.get(`/measurements/category/${category}`, {
    params: search ? { search } : {},
  });
  return response.data.entries;
};

// Saves (creates or updates) a customer's measurements for one category
export const saveMeasurement = async ({ customerId, category, values }) => {
  const response = await api.post("/measurements", { customerId, category, values });
  return response.data;
};
