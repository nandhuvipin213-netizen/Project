import DriverLocationsMap from "../../components/DriverLocationsMap";
import React, { useEffect, useState } from "react";
import api from "../../services/Api";
import {
  Truck,
  Users,
  Package,
  Navigation,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Search,
  SlidersHorizontal,
  MoreVertical,
  MapPin,
  Clock3,
  CircleAlert,
  CheckCircle2,
  Activity,
  ChevronRight,
} from "lucide-react";

// Dashboard statistics
interface DashboardStats {
  totalVehicles: number;
  totalDrivers: number;
  activeDrivers?: number;
  totalShipments: number;
  pendingShipments?: number;
  activeDeliveries: number;
  deliveredShipments?: number;
  fleetAvailability?: {
    available: number;
    inUse: number;
    maintenance: number;
  };
}

// Shipment database structure
interface DatabaseShipment {
  _id: string;

  customer: {
    _id: string;
    name: string;
    email: string;
  };

  assignedDriver?: {
    _id: string;
    name: string;
    email: string;
  } | null;

  assignedVehicle?: {
    _id: string;
    registrationNumber: string;
    vehicleType: string;
  } | null;

  pickupAddress: string;
  deliveryAddress: string;
  goodsType: string;
  weight: number;
  volume?: number;
  isFragile: boolean;

  status:
    | "pending"
    | "assigned"
    | "picked-up"
    | "in-transit"
    | "delivered"
    | "cancelled";

  statusHistory?: {
    status: string;
    changedAt: string;
  }[];

  createdAt: string;
  updatedAt: string;
}

interface StatItem {
  title: string;
  value: string | number;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  tone: "violet" | "blue" | "green" | "orange";
  note: string;
}

// Colors for statistic cards
const toneClasses: Record<StatItem["tone"], string> = {
  violet: "bg-violet-100 text-violet-600",
  blue: "bg-sky-100 text-sky-600",
  green: "bg-lime-100 text-lime-700",
  orange: "bg-orange-100 text-orange-600",
};

// Status labels
const statusLabels: Record<DatabaseShipment["status"], string> = {
  pending: "Pending",
  assigned: "Assigned",
  "picked-up": "Picked Up",
  "in-transit": "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// Status colors
const statusStyles: Record<DatabaseShipment["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  assigned: "bg-blue-100 text-blue-700",
  "picked-up": "bg-cyan-100 text-cyan-700",
  "in-transit": "bg-violet-100 text-violet-700",
  delivered: "bg-lime-100 text-lime-800",
  cancelled: "bg-rose-100 text-rose-700",
};

// Status badge component
function StatusPill({
  status,
}: {
  status: DatabaseShipment["status"];
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

// Format dates
function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalVehicles: 0,
    totalDrivers: 0,
    totalShipments: 0,
    activeDeliveries: 0,
    fleetAvailability: {
      available: 0,
      inUse: 0,
      maintenance: 0,
    },
  });

  const [databaseShipments, setDatabaseShipments] = useState<
    DatabaseShipment[]
  >([]);

  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch dashboard and shipment data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResult, shipmentsResult] = await Promise.allSettled([
          api.get("/dashboard/stats"),
          api.get("/shipments"),
        ]);

        if (statsResult.status === "fulfilled") {
          if (statsResult.value.data.success) {
            setDashboardStats(statsResult.value.data.stats);
          }
        } else {
          console.error(
            "Failed to fetch dashboard statistics:",
            statsResult.reason
          );
        }

        if (shipmentsResult.status === "fulfilled") {
          if (shipmentsResult.value.data.success) {
            const shipments: DatabaseShipment[] =
              shipmentsResult.value.data.shipments;

            setDatabaseShipments(shipments);

            if (shipments.length > 0) {
              setSelectedShipmentId(shipments[0]._id);
            }
          }
        } else {
          console.error(
            "Failed to fetch shipments:",
            shipmentsResult.reason
          );
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Dashboard statistics cards
  const stats: StatItem[] = [
    {
      title: "Total Vehicles",
      value: dashboardStats.totalVehicles,
      change: "Live",
      positive: true,
      icon: Truck,
      tone: "violet",
      note: "from database",
    },
    {
      title: "Total Drivers",
      value: dashboardStats.totalDrivers,
      change: "Live",
      positive: true,
      icon: Users,
      tone: "blue",
      note: "from database",
    },
    {
      title: "Total Shipments",
      value: dashboardStats.totalShipments,
      change: "Live",
      positive: true,
      icon: Package,
      tone: "green",
      note: "from database",
    },
    {
      title: "Active Deliveries",
      value: dashboardStats.activeDeliveries,
      change: "Live",
      positive: true,
      icon: Navigation,
      tone: "orange",
      note: "from database",
    },
  ];

  // Fleet availability
  const fleet = dashboardStats.fleetAvailability ?? {
    available: 0,
    inUse: 0,
    maintenance: 0,
  };

  const fleetTotal =
    fleet.available + fleet.inUse + fleet.maintenance;

  const availableDegrees =
    fleetTotal > 0 ? (fleet.available / fleetTotal) * 360 : 0;

  const inUseDegrees =
    fleetTotal > 0 ? (fleet.inUse / fleetTotal) * 360 : 0;

  const fleetChartStyle = {
    background:
      fleetTotal > 0
        ? `conic-gradient(
            #7656e8 0deg ${availableDegrees}deg,
            #b9a9ff ${availableDegrees}deg ${availableDegrees + inUseDegrees}deg,
            #e8e4f8 ${availableDegrees + inUseDegrees}deg 360deg
          )`
        : "#e8e4f8",
  };

  // Filter shipments
  const filteredShipments = databaseShipments.filter((shipment) => {
    const search = searchTerm.toLowerCase();

    return (
      shipment._id.toLowerCase().includes(search) ||
      shipment.goodsType.toLowerCase().includes(search) ||
      shipment.deliveryAddress.toLowerCase().includes(search) ||
      shipment.pickupAddress.toLowerCase().includes(search) ||
      shipment.customer?.name.toLowerCase().includes(search)
    );
  });

  // Selected shipment
  const selectedShipment =
    databaseShipments.find(
      (shipment) => shipment._id === selectedShipmentId
    ) ?? databaseShipments[0];

  return (
    <main className="min-w-0 w-full bg-[#f1effb] text-[#20213a]">
      <div className="mx-auto w-full min-w-0 max-w-[1500px] space-y-4 sm:space-y-5">

        {/* Page heading */}
        <section className="flex flex-wrap items-center justify-between gap-4 px-1">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Workspace</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-violet-700">Overview</span>
            </div>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#22213d] sm:text-3xl">
              Logistics Overview
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Monitor your fleet, shipments and daily operations in one place.
            </p>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm">
              <CalendarDays className="h-4 w-4" />
              Live Overview
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="min-w-0 rounded-[20px] border border-white bg-white p-4 shadow-[0_5px_22px_rgba(46,38,100,0.045)] sm:p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {item.title}
                    </p>

                    <h2 className="mt-2 text-[28px] font-bold tracking-tight text-[#22213d]">
                      {item.value}
                    </h2>
                  </div>

                  <span
                    className={`grid h-10 w-10 place-items-center rounded-xl ${toneClasses[item.tone]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-[10px]">
                  <span
                    className={`inline-flex items-center gap-0.5 font-bold ${
                      item.positive ? "text-violet-700" : "text-rose-600"
                    }`}
                  >
                    {item.positive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {item.change}
                  </span>

                  <span className="text-slate-400">{item.note}</span>
                </div>
              </article>
            );
          })}
        </section>

        {/* Analytics row */}
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.45fr_1fr_1fr]">

          {/* Delivery Performance */}
          <article className="min-w-0 rounded-[20px] border border-white bg-white p-4 shadow-[0_5px_22px_rgba(46,38,100,0.045)] sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#24233d]">
                  Delivery Performance
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  Shipment activity overview
                </p>
              </div>

              <span className="rounded-lg bg-violet-50 px-2.5 py-1.5 text-[10px] font-semibold text-violet-700">
                All Time
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Pending",
                  value: databaseShipments.filter(
                    (s) => s.status === "pending"
                  ).length,
                  color: "bg-amber-400",
                },
                {
                  label: "In Progress",
                  value: databaseShipments.filter((s) =>
                    ["assigned", "picked-up", "in-transit"].includes(s.status)
                  ).length,
                  color: "bg-violet-500",
                },
                {
                  label: "Delivered",
                  value: databaseShipments.filter(
                    (s) => s.status === "delivered"
                  ).length,
                  color: "bg-lime-500",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-[#f8f7fc] p-4"
                >
                  <span className={`mb-3 block h-2 w-2 rounded-full ${item.color}`} />
                  <p className="text-2xl font-bold text-[#24233d]">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </article>

          {/* Fleet Availability */}
          <article className="min-w-0 rounded-[20px] border border-white bg-white p-4 shadow-[0_5px_22px_rgba(46,38,100,0.045)] sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#24233d]">
                  Fleet Availability
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  Current vehicle status
                </p>
              </div>

              <MoreVertical className="h-4 w-4 text-slate-400" />
            </div>

            <div className="mt-5 flex min-w-0 items-center gap-3 sm:gap-4">
              <div
                className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full sm:h-[112px] sm:w-[112px]"
                style={fleetChartStyle}
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white sm:h-[78px] sm:w-[78px]">
                  <div className="text-center">
                    <p className="text-xl font-bold text-[#24233d]">
                      {fleetTotal}
                    </p>
                    <p className="text-[9px] text-slate-400">Vehicles</p>
                  </div>
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-3 text-[10px]">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-violet-600" />
                  <span className="text-slate-500">Available</span>
                  <b className="ml-auto text-slate-700">
                    {fleet.available}
                  </b>
                </div>

                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#b9a9ff]" />
                  <span className="text-slate-500">On trip</span>
                  <b className="ml-auto text-slate-700">
                    {fleet.inUse}
                  </b>
                </div>

                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#e8e4f8]" />
                  <span className="text-slate-500">Maintenance</span>
                  <b className="ml-auto text-slate-700">
                    {fleet.maintenance}
                  </b>
                </div>
              </div>
            </div>
          </article>

          {/* Operational Health */}
          <article className="min-w-0 rounded-[20px] border border-white bg-white p-4 shadow-[0_5px_22px_rgba(46,38,100,0.045)] sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#24233d]">
                  Operational Health
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  Current shipment indicators
                </p>
              </div>

              <Activity className="h-4 w-4 text-violet-500" />
            </div>

            <div className="mt-5 space-y-4">
              {[
                {
                  label: "Delivered Shipments",
                  value:
                    dashboardStats.totalShipments > 0
                      ? Math.round(
                          (databaseShipments.filter(
                            (s) => s.status === "delivered"
                          ).length /
                            databaseShipments.length) *
                            100
                        )
                      : 0,
                  color: "bg-lime-500",
                },
                {
                  label: "Active Deliveries",
                  value:
                    dashboardStats.totalShipments > 0
                      ? Math.round(
                          (dashboardStats.activeDeliveries /
                            dashboardStats.totalShipments) *
                            100
                        )
                      : 0,
                  color: "bg-violet-600",
                },
                {
                  label: "Vehicle Utilization",
                  value:
                    fleetTotal > 0
                      ? Math.round((fleet.inUse / fleetTotal) * 100)
                      : 0,
                  color: "bg-indigo-400",
                },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="mb-1.5 flex justify-between text-[10px]">
                    <span className="text-slate-500">{metric.label}</span>
                    <b className="text-slate-700">{metric.value}%</b>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${metric.color}`}
                      style={{
                        width: `${Math.min(metric.value, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-[#f5f2ff] p-3 text-[10px] leading-relaxed text-violet-800">
              <CircleAlert className="mr-1 inline h-3 w-3" />
              {databaseShipments.filter(
                (s) => s.status === "pending"
              ).length}{" "}
              shipments are waiting for assignment.
            </div>
          </article>
        </section>

        <DriverLocationsMap />

        {/* Shipment workspace */}
        <section className="min-w-0 overflow-hidden rounded-[24px] bg-[#24233d] p-3 shadow-[0_12px_35px_rgba(39,34,83,0.16)] sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[0.8fr_1.5fr]">

            {/* Active Shipments */}
            <div className="rounded-[18px] bg-[#2d2c49] p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold">
                    Active Shipments
                  </h2>

                  <p className="mt-1 text-[10px] text-white/45">
                    Your latest delivery activity
                  </p>
                </div>

                <MoreVertical className="h-4 w-4 text-white/60" />
              </div>

              <div className="mt-4 space-y-2">
                {loading ? (
                  <p className="py-5 text-center text-xs text-white/60">
                    Loading shipments...
                  </p>
                ) : databaseShipments.length === 0 ? (
                  <p className="py-5 text-center text-xs text-white/60">
                    No shipments found.
                  </p>
                ) : (
                  databaseShipments.slice(0, 5).map((shipment) => (
                    <button
                      key={shipment._id}
                      type="button"
                      onClick={() =>
                        setSelectedShipmentId(shipment._id)
                      }
                      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                        selectedShipment?._id === shipment._id
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-black/10"
                          : "bg-white/[0.045] hover:bg-white/[0.09]"
                      }`}
                    >
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-[10px] font-bold">
                        {shipment.goodsType.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-semibold">
                          {shipment.goodsType}
                        </p>

                        <p className="mt-0.5 truncate text-[9px] text-white/60">
                          {shipment.deliveryAddress}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] font-semibold">
                          {statusLabels[shipment.status]}
                        </p>

                        <p className="mt-1 text-[9px] text-white/55">
                          {shipment._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Selected Shipment Details */}
            <div className="min-w-0 rounded-[18px] bg-gradient-to-br from-[#7770d9] via-[#7167ce] to-[#5e54b7] p-4 text-white sm:p-6">
              {selectedShipment ? (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] text-white/65">
                        Shipment details
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        #{selectedShipment._id.slice(-8).toUpperCase()}
                      </h2>

                      <div className="mt-2">
                        <StatusPill status={selectedShipment.status} />
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-white/65">
                        Assigned vehicle
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {selectedShipment.assignedVehicle
                          ?.registrationNumber ?? "Not assigned"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      {
                        label: "Pickup location",
                        value: selectedShipment.pickupAddress,
                        icon: MapPin,
                      },
                      {
                        label: "Destination",
                        value: selectedShipment.deliveryAddress,
                        icon: Navigation,
                      },
                      {
                        label: "Assigned driver",
                        value:
                          selectedShipment.assignedDriver?.name ??
                          "Not assigned",
                        icon: Users,
                      },
                      {
                        label: "Goods type",
                        value: selectedShipment.goodsType,
                        icon: Package,
                      },
                    ].map((detail) => {
                      const Icon = detail.icon;

                      return (
                        <div
                          key={detail.label}
                          className="rounded-xl border border-white/15 bg-white/10 p-3"
                        >
                          <Icon className="h-4 w-4 text-white/75" />

                          <p className="mt-3 text-[9px] text-white/60">
                            {detail.label}
                          </p>

                          <p className="mt-1 break-words text-[11px] font-semibold">
                            {detail.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-xl border border-white/15 bg-white/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] text-white/65">
                          Shipment information
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {selectedShipment.goodsType}
                        </p>
                      </div>

                      <Package className="h-6 w-6 text-white/70" />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-4">
                      <div>
                        <p className="text-[9px] text-white/60">
                          Weight
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {selectedShipment.weight} kg
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-white/60">
                          Volume
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {selectedShipment.volume != null
                            ? `${selectedShipment.volume} m³`
                            : "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-white/60">
                          Fragile goods
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {selectedShipment.isFragile ? "Yes" : "No"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-white/60">
                          Customer
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {selectedShipment.customer?.name ?? "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[10px] text-white/70">
                      <CheckCircle2 className="h-4 w-4 text-[#d9ff78]" />
                      Last updated: {formatDate(selectedShipment.updatedAt)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center text-center">
                  <div>
                    <Package className="mx-auto h-10 w-10 text-white/50" />

                    <h2 className="mt-3 text-lg font-bold">
                      No Shipment Selected
                    </h2>

                    <p className="mt-1 text-xs text-white/60">
                      Shipment details will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recent Delivery Activity */}
        <section className="min-w-0 rounded-[20px] border border-white bg-white p-4 shadow-[0_5px_22px_rgba(46,38,100,0.045)] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#24233d]">
                Recent Delivery Activity
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                A quick view of your latest shipments
              </p>
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-[10px] text-slate-400 sm:flex-none">
                <Search className="h-3.5 w-3.5" />

                <input
                  aria-label="Search shipments"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search shipment..."
                  className="w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400 sm:w-36"
                />
              </label>

              <button
                type="button"
                aria-label="Shipment filters"
                className="rounded-lg border border-slate-100 p-2 text-slate-500"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400">
                  <th className="pb-3">SHIPMENT</th>
                  <th className="pb-3">DESTINATION</th>
                  <th className="pb-3">CUSTOMER</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3 text-right">LAST UPDATED</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-xs text-slate-400"
                    >
                      Loading shipment records...
                    </td>
                  </tr>
                ) : filteredShipments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-xs text-slate-400"
                    >
                      No matching shipments found.
                    </td>
                  </tr>
                ) : (
                  filteredShipments.slice(0, 10).map((shipment) => (
                    <tr
                      key={shipment._id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-3 text-[11px] font-semibold text-slate-700">
                        #{shipment._id.slice(-8).toUpperCase()}

                        <p className="mt-0.5 text-[9px] font-normal text-slate-400">
                          {shipment.goodsType}
                        </p>
                      </td>

                      <td className="py-3 text-[10px] text-slate-500">
                        {shipment.deliveryAddress}
                      </td>

                      <td className="py-3 text-[10px] text-slate-500">
                        {shipment.customer?.name ?? "Unknown"}
                      </td>

                      <td className="py-3">
                        <StatusPill status={shipment.status} />
                      </td>

                      <td className="py-3 text-right text-[10px] text-slate-500">
                        {formatDate(shipment.updatedAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}




