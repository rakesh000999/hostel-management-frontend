import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

const getStoredToken = () => {
  const raw =
    localStorage.getItem("token") ||
    localStorage.getItem("jwtToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken");

  if (!raw) {
    return null;
  }

  return raw.replace(/^Bearer\s+/i, "").trim();
};

// Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Handle network errors
    if (!error.response) {
      console.error(
        "Network error - backend may not be running at localhost:8080",
      );
    }

    return Promise.reject(error);
  },
);

export default api;
