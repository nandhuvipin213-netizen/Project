import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

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

type CustomerSidebarProps = {
  open: boolean;
  onClose: () => void;
};

function CustomerSidebar({ open, onClose }: CustomerSidebarProps) {
  return (
    <>
      {/* Backdrop (mobile / tablet only) */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-950/50 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
      />

      {/* Drawer below lg, fixed sidebar at lg+ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col bg-slate-900 px-4 py-6 text-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:max-w-none lg:shrink-0 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >

        {/* Logo */}
        <div className="mb-8 flex items-start justify-between px-3 lg:mb-10">
          <div>
            <img
              src="/logo-full.svg"
              alt="Smart Logistics"
              className="h-12 w-auto max-w-[190px] object-contain"
            />

            <p className="mt-2 text-xs text-slate-400">Customer Portal</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-slate-300 transition hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>


        {/* Navigation */}
        <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-lg px-4 py-3 transition ${isActive
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
    </>
  );
}

export default CustomerSidebar;