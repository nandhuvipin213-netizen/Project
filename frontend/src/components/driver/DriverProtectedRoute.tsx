import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
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

  return <Outlet />;
}


export default DriverProtectedRoute;