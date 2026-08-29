// The API base URL points at .../api — uploaded files are served one level up,
// e.g. http://localhost:5000/uploads/products/xyz.jpg
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

// Turns a stored relative path like "/uploads/products/xyz.jpg" into a full URL.
// Returns null if there's no image, so callers can fall back to a placeholder.
export const getImageUrl = (relativePath) => {
  if (!relativePath) return null;
  return `${SERVER_ORIGIN}${relativePath}`;
};
