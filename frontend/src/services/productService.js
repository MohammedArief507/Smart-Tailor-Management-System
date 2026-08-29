import api from "./api";

// Fetches the shop's products, optionally filtered by a search term
export const getProducts = async (search = "") => {
  const response = await api.get("/products", { params: search ? { search } : {} });
  return response.data.products;
};

// Creates a new product. Pass a FormData object (with an "image" field) to
// include a photo, or a plain object for a quick, image-less add.
export const createProduct = async (data) => {
  const response = await api.post("/products", data);
  return response.data.product;
};

// Updates a product's name, price, and/or image
export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data.product;
};

// Deletes a product
export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};
