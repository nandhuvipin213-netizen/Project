import { NavLink, Outlet } from "react-router-dom";
import {
  Bell,
  LayoutDashboard,
  Truck,
  Users,
  Package,
  MapPinned,
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
    <div className="flex min-h-dvh w-full flex-col overflow-x-clip bg-[#f1effb] md:flex-row text-[#20213a]">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        {/* Main navbar */}
        <header className="sticky top-16 z-30 border-b border-violet-100/80 md:top-0 bg-white/95 px-3 py-3 shadow-[0_4px_20px_rgba(46,38,100,0.04)] backdrop-blur sm:px-5 lg:px-8">
          {/* Below lg: brand + actions on row 1, nav on row 2. At lg+: one row, nav in the middle. */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 lg:flex-nowrap">
            {/* Brand */}
            <div className="order-1 hidden min-w-0 items-center gap-2 sm:gap-3 md:flex">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white sm:h-10 sm:w-10">
                <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-extrabold tracking-[0.1em] text-[#24223d] sm:text-sm sm:tracking-[0.12em]">
                  SMART<span className="text-violet-600">LOGISTICS.</span>
                </p>
                <p className="truncate text-[9px] text-slate-500 sm:text-[10px]">
                  Administration Portal
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="order-2 ml-auto flex shrink-0 items-center gap-2 lg:order-3">
              <button
                type="button"
                aria-label="Notifications"
                title="Notifications"
                className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-100 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
              </button>

              <div className="flex items-center gap-2 rounded-full bg-[#f3f0ff] py-1 pl-1 pr-1 sm:pr-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#e1d9ff] text-xs font-bold text-violet-700">
                  AD
                </div>
                <span className="hidden text-xs font-semibold text-slate-700 sm:inline">
                  Administrator
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="order-3 hidden w-full items-center gap-1 md:flex overflow-x-auto pb-1 text-xs font-semibold [scrollbar-width:none] lg:order-2 lg:w-auto lg:min-w-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
              {topNavItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 transition sm:gap-2 sm:px-3.5 ${
                        isActive
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200"
                          : "text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                      }`
                    }
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Nested admin page */}
        <main className="min-w-0 w-full p-3 sm:p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;