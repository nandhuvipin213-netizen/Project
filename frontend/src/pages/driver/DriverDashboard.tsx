import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../services/Api";
import {
  Package,
  Clock3,
  Truck,
  CheckCircle2,
  MapPin,
  Weight,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

// Types for backend response

interface DashboardStats {
  totalShipments: number;
  pendingPickups: number;
  activeDeliveries: number;
  completedDeliveries: number;
  completionRate: number;
}

interface DriverVehicle {
  _id: string;
  registrationNumber: string;
  vehicleType: string;
  capacity: number;
  volumeCapacity: number;
  status: string;
}

interface DriverShipment {
  _id: string;
  customer: {
    _id: string;
    name: string;
    email?: string;
  };
  pickupAddress: string;
  deliveryAddress: string;
  goodsType: string;
  weight: number;
  volume?: number;
  isFragile: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  assignedVehicle?: DriverVehicle | null;
}

interface DriverDashboardData {
  success: boolean;
  message: string;
  stats: DashboardStats;
  vehicle: DriverVehicle | null;
  recentShipments: DriverShipment[];
}

// Get driver name from login information
const getDriverName = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.name || "Driver";
  } catch {
    return "Driver";
  }
};

// Status styling
const getStatusStyle = (status: string) => {
  switch (status) {
    case "assigned":
      return "bg-violet-50 text-violet-700";

    case "picked-up":
      return "bg-blue-50 text-blue-700";

    case "in-transit":
      return "bg-amber-50 text-amber-700";

    case "delivered":
      return "bg-emerald-50 text-emerald-700";

    case "cancelled":
      return "bg-rose-50 text-rose-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
};

const formatStatus = (status: string) => {
  return status
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

function DriverDashboard() {
  const [dashboard, setDashboard] =
    useState<DriverDashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingMessage, setTrackingMessage] = useState(
    "Location tracking is currently stopped"
  );

  const driverName = getDriverName();

  // Fetch actual dashboard data
  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // Use the same endpoint path that worked in Thunder Client.
        const response = await api.get<DriverDashboardData>(
          "/drivers/dashboard"
        );

        if (isMounted) {
          setDashboard(response.data);
        }
      } catch (error: unknown) {
        if (isMounted) {
          if (axios.isAxiosError(error)) {
            setError(
              error.response?.data?.message ||
              "Unable to load dashboard data."
            );
          } else {
            setError("Something went wrong.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin text-violet-600" />
        <p className="text-sm font-medium text-slate-500">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <p className="font-semibold text-rose-600">{error}</p>

        <button
          onClick={() => setRefreshKey((prev) => prev + 1)}
          className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboard) return null;

  const { stats, vehicle, recentShipments } = dashboard;

  // Statistics cards
  const statCards = [
    {
      title: "Assigned Shipments",
      value: stats.totalShipments,
      description: "Total non-cancelled shipments",
      icon: Package,
      style: "bg-violet-100 text-violet-700",
    },
    {
      title: "Pending Pickups",
      value: stats.pendingPickups,
      description: "Waiting for pickup",
      icon: Clock3,
      style: "bg-amber-100 text-amber-700",
    },
    {
      title: "Active Deliveries",
      value: stats.activeDeliveries,
      description: "Currently on the road",
      icon: Truck,
      style: "bg-blue-100 text-blue-700",
    },
    {
      title: "Completed Deliveries",
      value: stats.completedDeliveries,
      description: "Successfully delivered",
      icon: CheckCircle2,
      style: "bg-emerald-100 text-emerald-700",
    },
  ];
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setTrackingMessage("Geolocation is not supported by this browser.");
      return;
    }

    if (!localStorage.getItem("token")) {
      setTrackingMessage("Please log in again.");
      return;
    }

    setTrackingMessage("Requesting location permission...");

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          await api.put("/drivers/update-location", {
            lat: latitude,
            lng: longitude,
          });

          setIsTracking(true);
          setTrackingMessage("Your live location is being shared.");
        } catch (error) {
          console.error("GPS update failed:", error);
          setTrackingMessage("Unable to update your location.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsTracking(false);
        setTrackingMessage(error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );

    // Store watch ID so we can stop tracking later.
    (window as Window & { driverWatchId?: number }).driverWatchId = watchId;
  };

  const stopLocationTracking = () => {
    const watchId = (
      window as Window & { driverWatchId?: number }
    ).driverWatchId;

    if (watchId !== undefined) {
      navigator.geolocation.clearWatch(watchId);
      delete (window as Window & { driverWatchId?: number }).driverWatchId;
    }

    setIsTracking(false);
    setTrackingMessage("Location tracking stopped.");
  };

  return (
    <div className="space-y-6">

      {/* Welcome Section */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-violet-700 via-violet-600 to-indigo-700 p-6 text-white shadow-lg shadow-violet-200 sm:flex-row sm:items-center sm:p-8">

        <div>
          <p className="text-sm font-medium text-violet-200">
            {formattedDate}
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Welcome back, {driverName}!
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100">
            Stay on track with your deliveries. Check your assigned
            shipments and manage your daily activities.
          </p>
        </div>

        <div className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10 sm:flex">
          <Truck className="h-16 w-16 text-white" strokeWidth={1.3} />
        </div>
      </section>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setRefreshKey((prev) => prev + 1)}
          className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Dashboard
        </button>
      </div>

      {/* Live GPS Tracking */}
      <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-bold text-slate-800">
                Live Vehicle Tracking
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Share your current GPS location with the logistics system.
            </p>

            <p className="mt-2 text-xs font-medium text-slate-600">
              {trackingMessage}
            </p>
          </div>

          <button
            onClick={isTracking ? stopLocationTracking : startLocationTracking}
            className={`rounded-xl px-5 py-3 text-sm font-semibold text-white ${isTracking
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-violet-600 hover:bg-violet-700"
              }`}
          >
            {isTracking ? "Stop Tracking" : "Start Tracking"}
          </button>
        </div>
      </section>


      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-extrabold text-slate-800">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`grid h-12 w-12 place-items-center rounded-xl ${stat.style}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Recent Shipments and Vehicle */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Recent Shipments */}
        <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm xl:col-span-2 sm:p-6">

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-violet-600" />

                <h2 className="text-lg font-bold text-slate-800">
                  Recent Shipments
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Your recently updated assigned shipments
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">

            {recentShipments.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <Package className="mx-auto h-10 w-10 text-slate-300" />

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  No shipments assigned yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Your assigned shipments will appear here.
                </p>
              </div>
            ) : (
              recentShipments.map((shipment) => (
                <div
                  key={shipment._id}
                  className="rounded-xl border border-slate-100 p-4 transition hover:border-violet-200 hover:bg-violet-50/30"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Shipment #{shipment._id.slice(-6).toUpperCase()}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Customer: {shipment.customer?.name || "Customer"}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-[11px] font-bold ${getStatusStyle(shipment.status)}`}
                    >
                      {formatStatus(shipment.status)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                      <div>
                        <p className="text-[10px] font-semibold uppercase text-slate-400">
                          Pickup
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-700">
                          {shipment.pickupAddress}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />

                      <div>
                        <p className="text-[10px] font-semibold uppercase text-slate-400">
                          Delivery
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-700">
                          {shipment.deliveryAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3">

                    <span className="text-xs text-slate-500">
                      Goods:{" "}
                      <strong className="text-slate-700">
                        {shipment.goodsType}
                      </strong>
                    </span>

                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Weight className="h-3.5 w-3.5" />
                      {shipment.weight} kg
                    </span>

                    {shipment.isFragile && (
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                        Fragile
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-[10px] text-slate-400">
                    Last updated:{" "}
                    {new Date(shipment.updatedAt).toLocaleString("en-IN")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vehicle Overview */}
        <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                My Vehicle
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your assigned vehicle details
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700">
              <Truck className="h-5 w-5" />
            </div>
          </div>

          {vehicle ? (
            <>
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#191a3c] to-[#38336c] p-5 text-white">

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-violet-200">
                    ASSIGNED VEHICLE
                  </span>

                  <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                    {formatStatus(vehicle.status)}
                  </span>
                </div>

                <div className="flex items-center justify-center py-5">
                  <Truck className="h-20 w-20 text-violet-200" strokeWidth={1.2} />
                </div>

                <h3 className="text-center text-xl font-extrabold tracking-wider">
                  {vehicle.registrationNumber}
                </h3>

                <p className="mt-1 text-center text-xs capitalize text-violet-200">
                  {vehicle.vehicleType}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Weight className="h-4 w-4" />
                    <span className="text-[11px]">Capacity</span>
                  </div>

                  <p className="mt-2 text-lg font-bold text-slate-800">
                    {vehicle.capacity.toLocaleString("en-IN")} kg
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Package className="h-4 w-4" />
                    <span className="text-[11px]">Volume</span>
                  </div>

                  <p className="mt-2 text-lg font-bold text-slate-800">
                    {vehicle.volumeCapacity} m³
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center">
              <Truck className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-slate-600">
                No active vehicle assignment
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Your vehicle details will appear when a shipment is assigned.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Delivery Performance */}
      <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6">

        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-violet-600" />

          <h2 className="text-lg font-bold text-slate-800">
            Delivery Performance
          </h2>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          Your completed shipments compared with total assigned shipments
        </p>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="text-3xl font-extrabold text-slate-800">
              {stats.completionRate}%
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Shipment completion rate
            </p>
          </div>

          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
            {stats.completedDeliveries} of {stats.totalShipments} completed
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(0, stats.completionRate))}%`,
            }}
          />
        </div>
      </section>
    </div>
  );
}

export default DriverDashboard;