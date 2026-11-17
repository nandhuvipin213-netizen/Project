
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Menu, X } from "lucide-react";

// Customer pages
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerRegister from "./pages/customer/CustomerRegister";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import TrackShipment from "./pages/customer/TrackShipment";
import BookShipment from "./pages/customer/BookShipment";
import AdvancePayment from "./pages/customer/AdvancePayment";
import ShipmentHistory from "./pages/customer/ShipmentHistory";
import MyProfile from "./pages/customer/MyProfile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import VehicleManagement from "./pages/admin/VehicleManagement";
import AdminLogin from "./pages/admin/AdminLogin";
import ShipmentManagement from "./pages/admin/ManageShipment";
import DriverManagement from "./pages/admin/ManageDriver";
import LiveTracking from "./pages/admin/LiveTracking";
import AssignmentsRoutes from "./pages/admin/AssignmentsRoutes";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import AdminProfile from "./pages/admin/AdminProfile";

// Driver pages
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverProtectedRoute from "./components/driver/DriverProtectedRoute";
import MyShipments from "./pages/driver/MyShipment";
import ActiveDelivery from "./pages/driver/ActiveDelivery";
import DeliveryHistory from "./pages/driver/DeliveryHistory";
import MyRoute from "./pages/driver/MyRoute";
import DriverNotifications from "./pages/driver/DriverNotifications";
import DriverProfile from "./pages/driver/DriverProfile";
import DriverSettings from "./pages/driver/DriverSettings";
import ChangePassword from "./pages/driver/ChangePassword";
import DriverLayoutContent from "./layouts/DriverLayout";
import ForgotPassword from "./pages/ForgotPassword";

// Public pages
import Home from "./page/Home";
import Services from "./page/Services";
import About from "./page/About";
import Contact from "./page/Contact";
import Footer from "./page/Footer";

// Common login
import CommonLogin from "./components/CommonLogin";


function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-950 text-white">

      {/* Navigation Bar */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">

        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-16">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center"
          >
            <img
              src="/logo-full.svg"
              alt="Smart Logistics"
              className="h-10 w-auto object-contain sm:h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">

            <Link to="/" className="text-slate-300 transition hover:text-blue-400">
              Home
            </Link>

            <Link to="/about" className="text-slate-300 transition hover:text-blue-400">
              About
            </Link>

            <Link to="/services" className="text-slate-300 transition hover:text-blue-400">
              Services
            </Link>

            <Link to="/contact" className="text-slate-300 transition hover:text-blue-400">
              Contact
            </Link>

          </div>

          {/* Desktop Login Button */}
          <Link
            to="/customer/login"
            className="hidden rounded-lg bg-blue-500 px-5 py-3 font-semibold transition hover:bg-blue-600 md:block"
          >
            Customer Login
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="rounded-lg border border-slate-700 p-2 text-white transition hover:bg-slate-800 md:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="border-t border-slate-800 bg-slate-950 px-4 py-5 sm:px-6 md:hidden">

            <div className="flex flex-col gap-5">

              <Link to="/" onClick={closeMenu} className="text-slate-300 transition hover:text-blue-400">
                Home
              </Link>

              <Link to="/about" onClick={closeMenu} className="text-slate-300 transition hover:text-blue-400">
                About
              </Link>

              <Link to="/services" onClick={closeMenu} className="text-slate-300 transition hover:text-blue-400">
                Services
              </Link>

              <Link to="/contact" onClick={closeMenu} className="text-slate-300 transition hover:text-blue-400">
                Contact
              </Link>

              <Link
                to="/customer/login"
                onClick={closeMenu}
                className="rounded-lg bg-blue-500 px-5 py-3 text-center font-semibold transition hover:bg-blue-600"
              >
                Customer Login
              </Link>

            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="min-h-screen min-w-0 w-full pt-16 sm:pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Website */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Common Login */}
        <Route path="/login" element={<CommonLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Customer Routes */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/track-shipment" element={<TrackShipment />} />
        <Route path="/customer/book-shipment" element={<BookShipment />} />
        <Route path="/customer/advance-payment" element={<AdvancePayment />} />
        <Route path="/customer/history" element={<ShipmentHistory />} />
        <Route path="/customer/profile" element={<MyProfile />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="vehicles" element={<VehicleManagement />} />
          <Route path="shipments" element={<ShipmentManagement />} />
          <Route path="drivers" element={<DriverManagement />} />
          <Route path="tracking" element={<LiveTracking />} />
          <Route path="assignments" element={<AssignmentsRoutes />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Old Driver Login URL */}
        <Route
          path="/driver/login"
          element={<Navigate to="/driver/dashboard" replace />}
        />

        {/* Protected Driver Portal */}
        <Route element={<DriverProtectedRoute />}>

          {/* First Login Password Change */}
          <Route
            path="/driver/change-password"
            element={<ChangePassword />}
          />

          {/* Driver Portal */}
          <Route path="/driver" element={<DriverLayoutContent />}>
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="shipments" element={<MyShipments />} />
            <Route path="active-delivery" element={<ActiveDelivery />} />
            <Route path="history" element={<DeliveryHistory />} />
            <Route path="route" element={<MyRoute />} />
            <Route path="notifications" element={<DriverNotifications />} />
            <Route path="profile" element={<DriverProfile />} />
            <Route path="settings" element={<DriverSettings />} />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
