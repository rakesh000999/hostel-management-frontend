import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, loading, user } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ message: 'Please login to continue' }} />;
    }

    if (roles && roles.length > 0) {
        // check if user has any of the required roles
        if (!user || !roles.includes(user.role)) {
            const msg = 'You do not have permission to view this page.';
            return <Navigate to="/" replace state={{ message: msg }} />;
        }
    }

    return children;
};

export default ProtectedRoute;
