import { NavLink, useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import {
    LayoutDashboard,
    Package,
    MapPinned,
    Truck,
    History,
    Bell,
    UserRound,
    Settings,
    LogOut,
} from "lucide-react";

export const driverNavItems = [
    {
        name: "Dashboard",
        path: "/driver/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "My Shipments",
        path: "/driver/shipments",
        icon: Package,
    },
    {
        name: "My Route",
        path: "/driver/route",
        icon: MapPinned,
    },
    {
        name: "Active Delivery",
        path: "/driver/active-delivery",
        icon: Truck,
    },
    {
        name: "Delivery History",
        path: "/driver/history",
        icon: History,
    },
    {
        name: "Notifications",
        path: "/driver/notifications",
        icon: Bell,
    },
    {
        name: "My Profile",
        path: "/driver/profile",
        icon: UserRound,
    },
    {
        name: "Settings",
        path: "/driver/settings",
        icon: Settings,
    },
];

function DriverSidebar() {
    const navigate = useNavigate();
    const { unreadCount } = useNotifications();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Notify the protected route that the driver logged out
        window.dispatchEvent(new Event("driver-auth-changed"));

        navigate("/driver/dashboard", { replace: true });
    };
    return (
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[#11132f] text-white lg:flex">
            {/* Logo */}
            <div className="flex h-24 items-center gap-3 border-b border-white/10 px-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
                    <Truck className="h-6 w-6 text-white" />
                </div>

                <div>
                    <h1 className="text-lg font-extrabold tracking-wide">
                        Smart<span className="text-violet-400">Logistics.</span>
                    </h1>
                    <p className="text-xs text-slate-400">Driver Portal</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-7">
                <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Workspace
                </p>

                {driverNavItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/driver/dashboard"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive
                                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-950/30"
                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                                }`
                            }
                        >
                            <Icon className="h-[18px] w-[18px]" />
                            <span>{item.name}</span>

                            {item.name === "Notifications" && unreadCount > 0 && (
                                <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout - will connect to driver authentication later */}
            <div className="border-t border-white/10 p-4">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/10"
                >
                    <LogOut className="h-[18px] w-[18px]" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default DriverSidebar;