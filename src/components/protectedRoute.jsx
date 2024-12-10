import React from "react";
import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const auth = useAuth();

    if (auth.isLoading) {
        return <div>Loading...</div>; // Display a spinner or loading indicator
    }

    if (!auth.isAuthenticated) {
        // Redirect to the login page if not authenticated
        return <Navigate to="/" />;
    }

    // Render the protected component if authenticated
    return children;
};

export default ProtectedRoute;
