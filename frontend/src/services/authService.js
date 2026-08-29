import api from "./api";

// Sends registration details to the backend and returns { token, user }
export const registerUser = async (formData) => {
  const response = await api.post("/auth/register", formData);
  return response.data;
};

// Sends login credentials to the backend and returns { token, user }
export const loginUser = async (formData) => {
  const response = await api.post("/auth/login", formData);
  return response.data;
};

// Fetches the currently logged-in user's details
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Updates the logged-in user's shop name, owner name, and/or phone number
export const updateProfile = async (data) => {
  const response = await api.put("/auth/profile", data);
  return response.data.user;
};
