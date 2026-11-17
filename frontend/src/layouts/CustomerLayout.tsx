import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import CustomerSidebar from "../components/customer/CustomerSidebar";

function CustomerLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-slate-100">
      {/* Sidebar: drawer on mobile/tablet, fixed column on desktop */}
      <CustomerSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main content */}
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:h-20 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            <h2 className="min-w-0 truncate text-lg font-semibold text-slate-800 sm:text-xl">
              Customer Portal
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 sm:h-10 sm:w-10">
              C
            </div>
            <span className="hidden font-medium text-slate-700 sm:inline">
              Customer
            </span>
          </div>
        </header>

        <section className="min-w-0 p-3 sm:p-6 lg:p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default CustomerLayout;