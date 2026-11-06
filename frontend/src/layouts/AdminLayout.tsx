import { NavLink, Outlet } from "react-router-dom";
import {
  Bell,
  LayoutDashboard,
  Truck,
  Users,
  Package,
  MapPinned,
  Menu,
} from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";

const topNavItems = [
  { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Vehicles", path: "/admin/vehicles", icon: Truck },
  { name: "Drivers", path: "/admin/drivers", icon: Users },
  { name: "Shipments", path: "/admin/shipments", icon: Package },
  { name: "Tracking", path: "/admin/tracking", icon: MapPinned },
];

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#f1effb] text-[#20213a]">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        {/* Main navbar */}
        <header className="sticky top-0 z-30 border-b border-violet-100/80 bg-white/95 px-4 py-3 shadow-[0_4px_20px_rgba(46,38,100,0.04)] backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
                <Menu className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold tracking-[0.12em] text-[#24223d]">
                  SMART<span className="text-violet-600">LOGISTICS.</span>
                </p>
                <p className="text-[10px] text-slate-500">Administration Portal</p>
              </div>
            </div>

            {/* Navigation labels moved from the sidebar into the navbar */}
            <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto pb-1 text-xs font-semibold sm:order-none sm:w-auto sm:pb-0">
              {topNavItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex shrink-0 items-center gap-2 rounded-full px-3 py-2 transition sm:px-3.5 ${
                        isActive
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200"
                          : "text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                      }`
                    }
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="ml-auto flex items-center gap-2 sm:ml-0">
              <button
                type="button"
                aria-label="Notifications"
                title="Notifications"
                className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-100 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
              </button>

              <div className="flex items-center gap-2 rounded-full bg-[#f3f0ff] py-1 pl-1 pr-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#e1d9ff] text-xs font-bold text-violet-700">
                  AD
                </div>
                <span className="hidden text-xs font-semibold text-slate-700 sm:inline">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Nested admin page */}
        <main className="min-w-0 p-3 sm:p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
