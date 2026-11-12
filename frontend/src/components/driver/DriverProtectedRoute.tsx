
import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import DriverLogin from "../../pages/driver/DriverLogin";

const checkDriverAuth = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    try {
        const user = storedUser ? JSON.parse(storedUser) : null;

        return Boolean(token && user?.role === "driver");
    } catch {
        return false;
    }
};

function DriverProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(checkDriverAuth);
    const location = useLocation();

    useEffect(() => {
        const handleAuthChange = () => {
            setIsAuthenticated(checkDriverAuth());
        };

        window.addEventListener("driver-auth-changed", handleAuthChange);

        return () => {
            window.removeEventListener("driver-auth-changed", handleAuthChange);
        };
    }, []);

    if (!isAuthenticated) {
        return (
            <DriverLogin
                onLoginSuccess={() => setIsAuthenticated(true)}
            />
        );
    }

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const mustChangePassword = user?.mustChangePassword === true;
    const isChangePasswordPage =
        location.pathname === "/driver/change-password";

    // Force first-time drivers to change their temporary password
    if (mustChangePassword && !isChangePasswordPage) {
        return <Navigate to="/driver/change-password" replace />;
    }

    // Prevent drivers from returning to the change-password page unnecessarily
    if (!mustChangePassword && isChangePasswordPage) {
        return <Navigate to="/driver/dashboard" replace />;
    }

    return <Outlet />;
}

export default DriverProtectedRoute;
