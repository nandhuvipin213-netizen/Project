
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/customer/dashboard",
    icon: "⌂",
  },
  {
    name: "Book Shipment",
    path: "/customer/book-shipment",
    icon: "▣",
  },
  {
    name: "Track Shipment",
    path: "/customer/track-shipment",
    icon: "⌖",
  },
  {
    name: "Shipment History",
    path: "/customer/history",
    icon: "◷",
  },
  {
    name: "My Profile",
    path: "/customer/profile",
    icon: "♙",
  },
];

function CustomerSidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-900 px-4 py-6 text-white">
      {/* Logo */}

      <div className="mb-10 px-3">
        <h1 className="text-2xl font-bold">
          Smart<span className="text-blue-400">Logistics.</span>
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Customer Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout placeholder */}
      <div className="border-t border-slate-700 pt-5">
        <button
          type="button"
          className="w-full rounded-lg px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          ⇥ Logout
        </button>
      </div>
    </aside>
  );
}

export default CustomerSidebar;
