
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  CheckCircle2,
  Package,
  RefreshCw,
  Truck,
  Clock,
} from "lucide-react";
import api from "../../services/Api";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationResponse {
  success: boolean;
  count: number;
  notifications: Notification[];
}

function DriverNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<NotificationResponse>(
          "/notifications/my-notifications"
        );

        setNotifications(response.data.notifications);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
              "Unable to load notifications."
          );
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "shipment":
        return <Package className="h-5 w-5" />;
      case "delivery":
        return <Truck className="h-5 w-5" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="w-full min-w-0 space-y-4 sm:space-y-6">

      {/* Page Heading */}
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-violet-600 sm:text-xs">
          Driver Workspace
        </p>

        <h1 className="mt-2 text-xl font-extrabold text-slate-800 sm:text-2xl">
          Notifications
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Stay updated about your shipments and delivery activities.
        </p>
      </div>

      {/* Unread Notifications Summary */}
      <div className="min-w-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-100 sm:h-12 sm:w-12">
            <Bell className="h-6 w-6 text-violet-600" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 sm:text-sm">
              Unread Notifications
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-slate-800">
              {unreadCount}
            </h2>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="min-w-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-5 sm:p-6">

        <h2 className="mb-4 text-base font-bold text-slate-800 sm:mb-5 sm:text-lg">
          Recent Notifications
        </h2>

        {/* Loading */}
        {loading && (
          <div className="py-10 text-center">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-violet-600" />

            <p className="mt-3 text-sm text-slate-500">
              Loading notifications...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-6 text-center">
            <p className="break-words text-sm text-rose-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && notifications.length === 0 && (
          <div className="py-8 text-center sm:py-10">
            <Bell className="mx-auto h-10 w-10 text-slate-300 sm:h-12 sm:w-12" />

            <p className="mt-3 font-semibold text-slate-700">
              No notifications yet
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
              Important delivery updates will appear here.
            </p>
          </div>
        )}

        {/* Notification List */}
        {!loading && !error && notifications.length > 0 && (
          <div className="space-y-3">

            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex min-w-0 items-start gap-3 rounded-xl border p-3 sm:gap-4 sm:p-4 ${
                  notification.isRead
                    ? "border-slate-100 bg-white"
                    : "border-violet-200 bg-violet-50"
                }`}
              >

                {/* Notification Icon */}
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-600 sm:h-10 sm:w-10">
                  {getIcon(notification.type)}
                </div>

                {/* Notification Content */}
                <div className="min-w-0 flex-1">

                  {/* Title and Badge */}
                  <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">

                    <h3 className="min-w-0 break-words text-sm font-bold text-slate-800 sm:text-base">
                      {notification.title}
                    </h3>

                    {!notification.isRead && (
                      <span className="shrink-0 rounded-full bg-violet-600 px-2 py-1 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <p className="mt-1 break-words text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6 [overflow-wrap:anywhere]">
                    {notification.message}
                  </p>

                  {/* Date */}
                  <p className="mt-3 flex flex-wrap items-center gap-1 text-[10px] text-slate-400 sm:text-xs">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    {new Date(notification.createdAt).toLocaleString("en-IN")}
                  </p>

                  {/* Mark as Read */}
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="mt-3 inline-flex min-h-8 items-center text-xs font-semibold text-violet-600 transition hover:text-violet-800"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default DriverNotifications;
