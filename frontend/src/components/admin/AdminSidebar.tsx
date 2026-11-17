
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  Package,
  MapPinned,
  Route,
  ChartNoAxesCombined,
  UserRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Vehicles", path: "/admin/vehicles", icon: Truck },
  { name: "Drivers", path: "/admin/drivers", icon: Users },
  { name: "Shipments", path: "/admin/shipments", icon: Package },
  { name: "Vehicle Tracking", path: "/admin/tracking", icon: MapPinned },
  { name: "Assignments & Routes", path: "/admin/assignments", icon: Route },
  { name: "Reports & Analytics", path: "/admin/reports", icon: ChartNoAxesCombined },
  { name: "Profile", path: "/admin/profile", icon: UserRound },
];

function AdminSidebar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Mobile Navigation */}
      <div className="sticky top-0 z-50 flex w-full items-center justify-between bg-[#24233d] px-4 py-3 text-white md:hidden">
        <NavLink
          to="/admin/dashboard"
          onClick={closeMenu}
          className="flex items-center"
        >
          <img
            src="/logo-full.svg"
            alt="Smart Logistics"
            className="h-10 w-auto max-w-[190px] object-contain"
          />
        </NavLink>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 transition hover:bg-white/10"
        >
          {menuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="fixed inset-x-0 top-[64px] z-50 max-h-[calc(100dvh-64px)] overflow-y-auto bg-[#24233d] px-4 pb-5 text-white shadow-xl md:hidden">
          <nav className="flex flex-col gap-2 pt-3">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                      isActive
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{item.name}</span>
                </NavLink>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex items-center gap-3 rounded-xl border-t border-white/10 px-4 py-4 text-rose-300 transition hover:bg-rose-500/15"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-[76px] shrink-0 flex-col items-center bg-[#24233d] px-2 py-5 text-white md:flex">
        <NavLink
          to="/admin/dashboard"
          title="Smart Logistics Dashboard"
          aria-label="Smart Logistics Dashboard"
          className="mb-8 flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl"
        >
          <img
            src="/logo-full.svg"
            alt="Smart Logistics"
            className="h-auto w-full object-contain"
          />
        </NavLink>

        <nav className="flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={item.name}
                aria-label={item.name}
                className={({ isActive }) =>
                  `group grid h-11 w-11 place-items-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-950/30"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="h-[19px] w-[19px]" />
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-5 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className="grid h-11 w-11 place-items-center rounded-xl text-white/60 transition hover:bg-rose-500/15 hover:text-rose-300"
          >
            <LogOut className="h-[19px] w-[19px]" />
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
