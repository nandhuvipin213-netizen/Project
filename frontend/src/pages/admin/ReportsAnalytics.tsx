import { useEffect, useState } from "react";
import api from "../../services/Api";

interface ReportData {
  totalShipments: number;
  deliveredShipments: number;
  activeDeliveries: number;
  pendingShipments: number;
  totalVehicles: number;
  totalDrivers: number;
}

function ReportsAnalytics() {
  const [data, setData] = useState<ReportData>({
    totalShipments: 0,
    deliveredShipments: 0,
    activeDeliveries: 0,
    pendingShipments: 0,
    totalVehicles: 0,
    totalDrivers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/stats");
      const stats = response.data.stats || response.data;

      setData({
        totalShipments: stats.totalShipments || 0,
        deliveredShipments: stats.deliveredShipments || 0,
        activeDeliveries: stats.activeDeliveries || 0,
        pendingShipments: stats.pendingShipments || 0,
        totalVehicles: stats.totalVehicles || 0,
        totalDrivers: stats.totalDrivers || 0,
      });
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Unable to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const deliveryRate =
    data.totalShipments > 0
      ? Math.round(
          (data.deliveredShipments / data.totalShipments) * 100
        )
      : 0;

  const statusItems = [
    {
      label: "Delivered",
      value: data.deliveredShipments,
      color: "bg-green-500",
    },
    {
      label: "Active Deliveries",
      value: data.activeDeliveries,
      color: "bg-indigo-500",
    },
    {
      label: "Pending",
      value: data.pendingShipments,
      color: "bg-yellow-500",
    },
  ];

  const statCards = [
    { label: "Total Shipments", value: data.totalShipments },
    { label: "Delivered Shipments", value: data.deliveredShipments },
    { label: "Active Deliveries", value: data.activeDeliveries },
    { label: "Pending Shipments", value: data.pendingShipments },
    { label: "Total Vehicles", value: data.totalVehicles },
    { label: "Total Drivers", value: data.totalDrivers },
  ];

  return (
    <div className="text-[#20213a]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of logistics performance and operations
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Refresh Reports
        </button>
      </div>

      {loading ? (
        <p className="rounded-xl bg-white p-8 text-center text-gray-500">
          Loading reports...
        </p>
      ) : error ? (
        <p className="rounded-xl bg-white p-8 text-center text-red-500">
          {error}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-gray-500">{card.label}</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {card.value}
                </h2>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-5 text-lg font-semibold">
                Delivery Performance
              </h2>

              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Delivery Completion Rate
                </span>
                <span className="font-bold text-indigo-600">
                  {deliveryRate}%
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${deliveryRate}%` }}
                />
              </div>

              <p className="mt-3 text-sm text-gray-500">
                {data.deliveredShipments} of {data.totalShipments} shipments
                delivered
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-5 text-lg font-semibold">
                Shipment Status Distribution
              </h2>

              <div className="space-y-5">
                {statusItems.map((item) => {
                  const percentage =
                    data.totalShipments > 0
                      ? (item.value / data.totalShipments) * 100
                      : 0;

                  return (
                    <div key={item.label}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.label}
                        </span>
                        <span className="font-semibold">
                          {item.value}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReportsAnalytics;