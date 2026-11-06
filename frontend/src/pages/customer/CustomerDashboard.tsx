
import { Link, useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Total Shipments",
    value: "24",
    subtitle: "All shipments",
    icon: "📦",
    color: "bg-[#142B4A]",
  },
  {
    title: "Active Shipments",
    value: "08",
    subtitle: "Currently in transit",
    icon: "🚚",
    color: "bg-teal-600",
  },
  {
    title: "Delivered",
    value: "12",
    subtitle: "Successfully delivered",
    icon: "✓",
    color: "bg-green-600",
  },
];

const shipments = [
  {
    id: "#SHP001",
    pickup: "Kochi",
    delivery: "Kottayam",
    date: "03 Nov 2026",
    time: "10:30 AM",
    status: "In Transit",
  },
  {
    id: "#SHP002",
    pickup: "Alappuzha",
    delivery: "Thrissur",
    date: "02 Nov 2026",
    time: "11:45 AM",
    status: "Delivered",
  },
  {
    id: "#SHP003",
    pickup: "Ernakulam",
    delivery: "Palakkad",
    date: "01 Nov 2026",
    time: "02:15 PM",
    status: "Pending",
  },
];

const monthlyData = [
  { month: "JAN", value: 45 },
  { month: "FEB", value: 70 },
  { month: "MAR", value: 55 },
  { month: "APR", value: 90 },
  { month: "MAY", value: 65 },
  { month: "JUN", value: 80 },
];

const statusStyles: Record<string, string> = {
  "In Transit": "bg-blue-50 text-blue-700",
  Delivered: "bg-[#F4F8E9] text-[#142B4A]",
  Pending: "bg-amber-50 text-amber-700",
};

function CustomerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/customer/login");
  };

  return (
    // <div className="min-h-screen bg-[#e9e9e9] p-3 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-[1500px] rounded-[28px] bg-[#f7f7f7] p-4 shadow-sm sm:p-6">

        {/* TOP NAVIGATION */}
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-full bg-white px-5 py-4 shadow-sm">

          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#142B4A] text-xl text-white">
              <span>↗</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#142B4A]">
              Smart<span className="text-[#142B4A]">Logistics</span>
            </h2>
          </div>

          <nav className="hidden items-center gap-7 rounded-full bg-gray-50 px-7 py-3 text-sm text-gray-600 lg:flex">
            <Link to="/customer/dashboard" className="rounded-full bg-white px-4 py-2 font-semibold text-[#142B4A] shadow-sm">
              Dashboard
            </Link>
            <Link to="/customer/book-shipment" className="cursor-pointer hover:text-[#142B4A]">Shipments</Link>
            <Link to="/customer/track-shipment" className="cursor-pointer hover:text-[#142B4A]">Tracking</Link>
            <Link to="/customer/history" className="cursor-pointer hover:text-[#142B4A]">History</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-lg">
              🔍
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-lg">
              ♧
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF5C8] font-bold text-[#142B4A]">
              C
            </div>
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row">

          {/* SIDEBAR */}
          <aside className="flex shrink-0 flex-row justify-center gap-3 rounded-3xl bg-white p-3 shadow-sm lg:w-16 lg:flex-col lg:justify-start lg:gap-5">

            {[
              { icon: "▦", path: "/customer/dashboard", active: true },
              { icon: "▤", path: "/customer/book-shipment", active: false },
              { icon: "♧", path: "/customer/track-shipment", active: false },
              { icon: "▣", path: "/customer/history", active: false },
            ].map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => navigate(item.path)}
                aria-label={["Dashboard", "Shipments", "Tracking", "History"][index]}
                className={`flex h-11 w-11 items-center justify-center rounded-full text-xl ${
                  item.active
                    ? "bg-[#142B4A] text-white"
                    : "text-gray-500 hover:bg-[#F4F8E9] hover:text-[#142B4A]"
                }`}
              >
                {item.icon}
              </button>
            ))}

            <div className="hidden flex-1 lg:block" />

            <button type="button" onClick={() => navigate("/customer/profile")} aria-label="Profile settings" className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100">
              ⚙
            </button>
            <button type="button" onClick={handleLogout} aria-label="Logout" className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100">
              ↪
            </button>
          </aside>

          {/* DASHBOARD CONTENT */}
          <main className="min-w-0 flex-1">

            {/* WELCOME HEADER */}
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  CUSTOMER DASHBOARD
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  Welcome Back, <span className="font-normal text-gray-400">Customer</span>
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Here's what's happening with your shipments.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
                  📅 &nbsp; 01 Nov - 30 Nov, 2026
                </button>
                <button type="button" onClick={() => navigate("/customer/book-shipment")} className="rounded-full bg-[#142B4A] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#0D1F36]">
                  + New Shipment
                </button>
              </div>
            </div>

            {/* DASHBOARD GRID */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">

              {/* LEFT COLUMN */}
              <div className="space-y-5 xl:col-span-3">

                {/* SHIPMENT SUMMARY */}
                <div className="rounded-[25px] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Shipment Overview
                      </h3>
                      <p className="text-xs text-gray-500">
                        Your shipment summary
                      </p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-600">
                      ↗
                    </span>
                  </div>

                  <div className="mt-5 rounded-[20px] bg-gradient-to-br from-emerald-700 to-emerald-600 p-5 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">TOTAL SHIPMENTS</span>
                      <span className="text-xl">📦</span>
                    </div>

                    <h2 className="mt-5 text-4xl font-semibold">24</h2>

                    <p className="mt-1 text-sm text-[#EAF5C8]">
                      Shipments registered
                    </p>

                    <div className="mt-6 flex justify-between border-t border-white/20 pt-3 text-xs text-[#EAF5C8]">
                      <span>Active: 08</span>
                      <span>Delivered: 12</span>
                    </div>
                  </div>
                </div>

                {/* PENDING CARD */}
                <div className="rounded-[25px] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Pending Shipments
                      </p>
                      <h2 className="mt-2 text-3xl font-semibold text-gray-900">
                        04
                      </h2>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-2xl">
                      ⏳
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-amber-600">
                    Awaiting pickup confirmation
                  </p>
                </div>

                {/* DELIVERY RATE */}
                <div className="rounded-[25px] bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">Delivery Success Rate</p>
                  <div className="mt-2 flex items-end justify-between">
                    <h2 className="text-3xl font-semibold text-gray-900">92%</h2>
                    <span className="rounded-full bg-[#F4F8E9] px-3 py-1 text-xs font-medium text-[#142B4A]">
                      +8.5%
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-[92%] rounded-full bg-[#C8FF00]" />
                  </div>
                </div>
              </div>

              {/* CENTER COLUMN */}
              <div className="space-y-5 xl:col-span-5">

                {/* MONTHLY ACTIVITY */}
                <div className="rounded-[25px] bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Shipment Activity
                      </h3>
                      <p className="text-xs text-gray-500">
                        Monthly shipment statistics
                      </p>
                    </div>

                    <button className="rounded-full bg-[#142B4A] px-4 py-2 text-xs font-medium text-white">
                      Monthly
                    </button>
                  </div>

                  <div className="mt-8 flex h-52 items-end justify-between gap-3 border-b border-gray-100 px-1">
                    {monthlyData.map((item, index) => (
                      <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end gap-3">
                        <span className="text-xs text-gray-500">
                          {item.value}
                        </span>
                        <div
                          className={`w-full max-w-12 rounded-t-full ${
                            index === 3
                              ? "bg-[#142B4A]"
                              : "bg-[#E5F5A8]"
                          }`}
                          style={{ height: `${item.value}%` }}
                        />
                        <span className="text-xs text-gray-500">
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total this month</p>
                      <h3 className="mt-1 text-2xl font-semibold text-gray-900">
                        24 Shipments
                      </h3>
                    </div>
                    <span className="rounded-full bg-[#F4F8E9] px-3 py-2 text-xs font-semibold text-[#142B4A]">
                      +17.8%
                    </span>
                  </div>
                </div>

                {/* RECENT SHIPMENTS */}
                <div className="rounded-[25px] bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Recent Shipments
                      </h3>
                      <p className="text-xs text-gray-500">
                        Your latest shipment activities
                      </p>
                    </div>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-600">
                      ↗
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {shipments.map((shipment) => (
                      <div
                        key={shipment.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl p-3 transition hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F8E9] text-lg">
                            🚚
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {shipment.id}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {shipment.pickup} → {shipment.delivery}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[shipment.status]}`}>
                            {shipment.status}
                          </span>
                          <p className="mt-2 text-xs text-gray-400">
                            {shipment.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button type="button" onClick={() => navigate("/customer/history")} className="mt-4 w-full rounded-xl bg-gray-50 py-3 text-sm font-semibold text-[#142B4A] transition hover:bg-[#F4F8E9]">
                    View All Shipments →
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-5 xl:col-span-4">

                {/* DELIVERY PROGRESS */}
                <div className="rounded-[25px] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Delivery Progress
                      </h3>
                      <p className="text-xs text-gray-500">
                        Overall shipment status
                      </p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
                      ↗
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-center">
                    <div className="relative flex h-44 w-44 items-center justify-center rounded-full"
                      style={{
                        background: "conic-gradient(#C8FF00 0% 50%, #A8C94A 50% 83%, #e5e7eb 83% 100%)"
                      }}
                    >
                      <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                        <span className="text-3xl font-semibold text-gray-900">
                          92%
                        </span>
                        <span className="text-xs text-gray-500">
                          Success rate
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 space-y-4">
                    {[
                      ["Delivered", "12", "bg-[#C8FF00]"],
                      ["In Transit", "08", "bg-green-300"],
                      ["Pending", "04", "bg-gray-300"],
                    ].map(([label, value, color]) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                          <span className="text-sm text-gray-600">{label}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ACTIVE SHIPMENTS */}
                <div className="rounded-[25px] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Active Shipments
                      </h3>
                      <p className="text-xs text-gray-500">
                        Currently on the move
                      </p>
                    </div>
                    <span className="rounded-full bg-[#F4F8E9] px-3 py-1 text-xs font-semibold text-[#142B4A]">
                      08 Active
                    </span>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#F4F8E9] p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-emerald-900">
                        🚚 Shipment #SHP001
                      </span>
                      <span className="h-2 w-2 rounded-full bg-[#C8FF00]" />
                    </div>

                    <div className="mt-5 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold text-gray-900">Kochi</p>
                        <p className="text-xs text-gray-500">Pickup</p>
                      </div>
                      <span className="text-[#142B4A]">━━━━➜</span>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">Kottayam</p>
                        <p className="text-xs text-gray-500">Destination</p>
                      </div>
                    </div>

                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white">
                      <div className="h-full w-[65%] rounded-full bg-[#C8FF00]" />
                    </div>

                    <p className="mt-3 text-xs text-[#142B4A]">
                      Shipment is on its way to the destination.
                    </p>
                  </div>

                  <button type="button" onClick={() => navigate("/customer/track-shipment")} className="mt-5 w-full rounded-full bg-[#142B4A] py-3 text-sm font-semibold text-white transition hover:bg-[#0D1F36]">
                    Track Shipment →
                  </button>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <footer className="mt-8 flex flex-wrap justify-between gap-2 border-t border-gray-200 pt-5 text-xs text-gray-400">
              <p>© 2026 Smart Logistics. All rights reserved.</p>
              <p>Smart & Reliable Shipment Management</p>
            </footer>

          </main>
        </div>
      </div>
    // </div>
  );
}

export default CustomerDashboard;
