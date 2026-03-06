import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/**
 * @typedef {Object} StructuredApiError
 * @property {string} [timestamp]
 * @property {number} [status]
 * @property {string} [error]
 * @property {string} [message]
 * @property {string} [path]
 */

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

export const parseApiError = (error) => {
  const fallback = {
    status: 0,
    error: "Unknown Error",
    message: "Something went wrong. Please try again.",
    path: "",
    timestamp: new Date().toISOString(),
  };

  if (!error) {
    return fallback;
  }

  const responseData = error?.response?.data;
  if (responseData && typeof responseData === "object") {
    return {
      timestamp: responseData.timestamp || fallback.timestamp,
      status: Number(
        responseData.status || error?.response?.status || fallback.status,
      ),
      error:
        responseData.error || error?.response?.statusText || fallback.error,
      message: responseData.message || error.message || fallback.message,
      path: responseData.path || error?.config?.url || fallback.path,
    };
  }

  return {
    ...fallback,
    status: Number(error?.response?.status || fallback.status),
    error: error?.response?.statusText || fallback.error,
    message: error?.message || fallback.message,
    path: error?.config?.url || fallback.path,
  };
};

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

client.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(parseApiError(error)),
);

export default client;
