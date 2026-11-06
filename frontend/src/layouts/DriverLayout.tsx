import { NavLink, Outlet } from "react-router-dom";
import { Bell, Truck } from "lucide-react";
import { driverNavItems } from "../components/driver/driverSidebar";
import DriverSidebar from "../components/driver/driverSidebar";


function DriverLayout() {
  return (
    <div className="min-h-screen bg-[#f5f4fb] text-[#20213a] lg:flex">
      <DriverSidebar />

      <div className="min-w-0 flex-1">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 border-b border-violet-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-h-11 items-center justify-between gap-3">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white lg:hidden">
                <Truck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-extrabold tracking-wide text-[#24223d]">
                  DRIVER WORKSPACE
                </p>
                <p className="text-[11px] text-slate-500">
                  Smart Logistics Management
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-emerald-700">
                  Online
                </span>
              </div>

              <NavLink
                to="/driver/notifications"
                aria-label="Notifications"
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-100 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
              </NavLink>

              {/* Driver Profile */}
              <div className="flex items-center gap-2 rounded-full bg-[#f1edff] py-1 pl-1 pr-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-violet-200 text-xs font-bold text-violet-800">
                  DR
                </div>

                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-800">
                    Driver
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Delivery Partner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        <nav className="flex gap-2 overflow-x-auto border-b border-violet-100 bg-white px-3 py-3 lg:hidden">
          {driverNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/driver/dashboard"}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-violet-50"
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Page Content */}
        <main className="min-w-0 p-3 sm:p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DriverLayout;