import { useEffect, useState } from "react";
import api from "../../services/Api";

interface Assignment {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  assignedDriver?: {
    name: string;
  };
  assignedVehicle?: {
    registrationNumber: string;
    type: string;
  };
}

function AssignmentsRoutes() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/shipments");

      const shipments: Assignment[] = response.data.shipments || [];

      // Only show shipments that have both a driver and vehicle assigned
      setAssignments(
        shipments.filter(
          (shipment) =>
            shipment.assignedDriver && shipment.assignedVehicle
        )
      );
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
      setError("Unable to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-700";
      case "picked-up":
        return "bg-yellow-100 text-yellow-700";
      case "in-transit":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="text-[#20213a]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Assignments & Routes</h1>
          <p className="mt-1 text-sm text-gray-500">
            View assigned shipments, drivers and vehicles
          </p>
        </div>

        <button
          onClick={fetchAssignments}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Assignments</p>
          <h2 className="mt-2 text-2xl font-bold">
            {assignments.length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Shipments</p>
          <h2 className="mt-2 text-2xl font-bold">
            {
              assignments.filter(
                (item) =>
                  item.status === "assigned" ||
                  item.status === "picked-up" ||
                  item.status === "in-transit"
              ).length
            }
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Delivered Shipments</p>
          <h2 className="mt-2 text-2xl font-bold">
            {
              assignments.filter(
                (item) => item.status === "delivered"
              ).length
            }
          </h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">Shipment Assignments</h2>
        </div>

        {loading ? (
          <p className="p-8 text-center text-gray-500">
            Loading assignments...
          </p>
        ) : error ? (
          <p className="p-8 text-center text-red-500">{error}</p>
        ) : assignments.length === 0 ? (
          <p className="p-8 text-center text-gray-500">
            No assigned shipments found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4">Shipment ID</th>
                  <th className="px-5 py-4">Pickup</th>
                  <th className="px-5 py-4">Delivery</th>
                  <th className="px-5 py-4">Driver</th>
                  <th className="px-5 py-4">Vehicle</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {assignments.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium">
                      {item._id.slice(-6).toUpperCase()}
                    </td>

                    <td className="px-5 py-4">
                      {item.pickupAddress}
                    </td>

                    <td className="px-5 py-4">
                      {item.deliveryAddress}
                    </td>

                    <td className="px-5 py-4">
                      {item.assignedDriver?.name || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      {item.assignedVehicle?.registrationNumber || "N/A"}
                      <p className="text-xs text-gray-500">
                        {item.assignedVehicle?.type}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status.replace("-", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignmentsRoutes;