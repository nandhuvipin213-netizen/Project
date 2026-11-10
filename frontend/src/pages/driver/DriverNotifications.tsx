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
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
          Driver Workspace
        </p>

        <h1 className="mt-2 text-2xl font-extrabold text-slate-800">
          Notifications
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Stay updated about your shipments and delivery activities.
        </p>
      </div>

      <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Bell className="h-9 w-9 text-violet-600" />

          <div>
            <p className="text-sm text-slate-500">
              Unread Notifications
            </p>

            <h2 className="text-2xl font-extrabold text-slate-800">
              {unreadCount}
            </h2>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-800">
          Recent Notifications
        </h2>

        {loading && (
          <div className="py-10 text-center">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-violet-600" />
            <p className="mt-3 text-sm text-slate-500">
              Loading notifications...
            </p>
          </div>
        )}

        {!loading && error && (
          <p className="py-8 text-center text-sm text-rose-600">
            {error}
          </p>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="py-10 text-center">
            <Bell className="mx-auto h-12 w-12 text-slate-300" />

            <p className="mt-3 font-semibold text-slate-700">
              No notifications yet
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Important delivery updates will appear here.
            </p>
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex gap-4 rounded-xl border p-4 ${notification.isRead
                    ? "border-slate-100 bg-white"
                    : "border-violet-200 bg-violet-50"
                  }`}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-600">
                  {getIcon(notification.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-800">
                      {notification.title}
                    </h3>

                    {!notification.isRead && (
                      <span className="rounded-full bg-violet-600 px-2 py-1 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-600">
                    {notification.message}
                  </p>

                  <p className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="mt-3 text-xs font-semibold text-violet-600 hover:text-violet-800"
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