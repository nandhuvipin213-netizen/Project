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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[68px] shrink-0 flex-col items-center bg-[#24233d] px-2 py-5 text-white sm:w-[76px]">
      {/* Brand mark */}
      <NavLink
        to="/admin/dashboard"
        title="Smart Logistics Dashboard"
        aria-label="Smart Logistics Dashboard"
        className="mb-8 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-950/30"
      >
        <Route className="h-5 w-5" />
      </NavLink>

      {/* Icon-only navigation */}
      <nav className="flex flex-1 flex-col items-center gap-2">
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
  );
}

export default AdminSidebar;
