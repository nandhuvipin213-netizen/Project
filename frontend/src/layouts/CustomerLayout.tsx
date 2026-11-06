
import { Outlet } from "react-router-dom";

function CustomerLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
     

      {/* Main content */}
      <main className="min-w-0 flex-1">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
          <h2 className="text-xl font-semibold text-slate-800">
            Customer Portal
          </h2>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
              C
            </div>
            <span className="font-medium text-slate-700">
              Customer
            </span>
          </div>
        </header>

        <section className="p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default CustomerLayout;
