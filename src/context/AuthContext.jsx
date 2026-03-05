import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isInitialLoadRef = useRef(true);

    // Fetch current user details when token exists
    useEffect(() => {
        if (token) {
            fetchUserDetails();
        } else {
            setLoading(false);
            isInitialLoadRef.current = false;
        }
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await api.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            setError(null);
            isInitialLoadRef.current = false;
        } catch (err) {
            console.error("Error fetching user details:", err);

            // Only show error if not the initial load or if it's a real auth error
            if (!isInitialLoadRef.current && err.response?.status === 401) {
                setError("Session expired. Please login again.");
            }

            setToken(null);
            localStorage.removeItem("token");
            setUser(null);
            isInitialLoadRef.current = false;
        } finally {
            setLoading(false);
        }
    };

    const register = useCallback(async (data) => {
        try {
            setError(null);
            const response = await api.post("/auth/register", data);
            return response.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Registration failed. Please try again.";
            setError(errorMessage);
            throw err;
        }
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            setError(null);
            console.log("Attempting login with email:", email);
            const response = await api.post("/auth/login", { email, password });
            console.log("Login response:", response.data);
            const { token: newToken } = response.data;

            if (!newToken) {
                throw new Error("No token received from server");
            }

            // Store token
            localStorage.setItem("token", newToken);
            setToken(newToken);

            // Fetch user details after login
            const userResponse = await api.get("/auth/me", {
                headers: { Authorization: `Bearer ${newToken}` },
            });
            console.log("User details:", userResponse.data);
            setUser(userResponse.data);
            return userResponse.data;
        } catch (err) {
            console.error("Login error details:", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
                url: err.config?.url,
            });
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Login failed. Please check your credentials and try again.";
            setError(errorMessage);
            throw err;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setError(null);
    }, []);

    const isAuthenticated = !!token && !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                error,
                register,
                login,
                logout,
                isAuthenticated,
                setError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
