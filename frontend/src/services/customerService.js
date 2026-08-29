import api from "./api";

// Fetches/searches the shop's customers
export const getCustomers = async (search = "") => {
  const response = await api.get("/customers", { params: search ? { search } : {} });
  return response.data.customers;
};

// Quickly creates a new customer (used inline during Billing;
// full Customers module with editing comes in Module 7)
export const createCustomer = async (data) => {
  const response = await api.post("/customers", data);
  return response.data.customer;
};

// Updates an existing customer's details
export const updateCustomer = async (id, data) => {
  const response = await api.put(`/customers/${id}`, data);
  return response.data.customer;
};
