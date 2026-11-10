import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerRegister from "./pages/customer/CustomerRegister";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import VehicleManagement from "./pages/admin/VehicleManagement";
import AdminLogin from "./pages/admin/AdminLogin";
import ShipmentManagement from "./pages/admin/ManageShipment";
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverProtectedRoute from "./components/driver/DriverProtectedRoute";
import MyShipments from "./pages/driver/MyShipment";
import ActiveDelivery from "./pages/driver/ActiveDelivery";
import DeliveryHistory from "./pages/driver/DeliveryHistory";
import MyRoute from "./pages/driver/MyRoute";
import DriverNotifications from "./pages/driver/DriverNotifications";
import DriverProfile from "./pages/driver/DriverProfile";
import DriverSettings from "./pages/driver/DriverSettings";
import DriverLayoutContent from "./layouts/DriverLayout";
import TrackShipment from "./pages/customer/TrackShipment";
import BookShipment from "./pages/customer/BookShipment";
import AdvancePayment from "./pages/customer/AdvancePayment";


function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-6 lg:px-16">
        <h1 className="text-2xl font-bold tracking-wide">
          Smart<span className="text-blue-400">Logistics.</span>
        </h1>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-slate-300 hover:text-white">Home</a>
          <a href="#about" className="text-slate-300 hover:text-white">About</a>
          <a href="#services" className="text-slate-300 hover:text-white">Services</a>
          <a href="#contact" className="text-slate-300 hover:text-white">Contact</a>
        </div>

        <Link
          to="/customer/login"
          className="rounded-lg bg-blue-500 px-5 py-3 font-semibold hover:bg-blue-600"
        >
          Customer Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center"
      >
        <p className="mb-5 rounded-full border border-blue-400/30 px-5 py-2 text-sm text-blue-300">
          SMART FLEET MANAGEMENT PLATFORM
        </p>

        <h2 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Smarter Logistics.
          <span className="block text-blue-400">
            Faster Deliveries.
          </span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Manage your fleet, optimize delivery routes, and track shipments
          in one powerful platform designed to make logistics easier.
        </p>


        <div className="flex items-center gap-3">
          <Link
            to="/customer/login"
            className="rounded-lg border border-blue-400 px-5 py-3 font-semibold text-blue-300 transition hover:bg-blue-400 hover:text-white"
          >
            Login
          </Link>

          <Link
            to="/customer/register"
            className="rounded-lg bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            Register
          </Link>
        </div>

      </section>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Admin and Driver Login */}
        {/* <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/driver/login" element={<DriverLogin />} /> */}

        {/* Customer Authentication */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        {/* Customer Dashboard */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/track-shipment" element={<TrackShipment />} />
        <Route path="/customer/book-shipment" element={<BookShipment />} />
        <Route path="/customer/advance-payment"element={<AdvancePayment />}
         />

        {/* Customer Dashboard Layout */}

        <Route path="customer/dashboard" element={<CustomerDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="vehicles" element={<VehicleManagement />} />
          <Route path="shipments" element={<ShipmentManagement />} />
        </Route>

        {/* Old login URL redirects to the single Driver Portal URL */}
        <Route
          path="/driver/login"
          element={<Navigate to="/driver/dashboard" replace />}
        />

        {/* Protected Driver Portal */}
        <Route element={<DriverProtectedRoute />}>
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