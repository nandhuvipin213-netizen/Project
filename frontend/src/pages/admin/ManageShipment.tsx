
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Package,
  MapPin,
  CalendarDays,
  Eye,
  RefreshCw,
  Filter,
  Trash2,
  AlertTriangle,
  UserPlus,
  Truck,
  X,
} from "lucide-react";
import api from "../../services/Api";

interface Shipment {
  _id: string;
  customer?: {
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
  createdAt: string;
  updatedAt: string;
}

interface Driver {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    isActive: boolean;
  };
  availabilityStatus: "available" | "on-duty" | "off-duty";
  licenseNumber: string;
}

interface Vehicle {
  _id: string;
  registrationNumber: string;
  vehicleType: string;
  capacity: number;
  volumeCapacity: number;
  status: string;
  isActive: boolean;
}

const statusStyles: Record<Shipment["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  assigned: "bg-blue-100 text-blue-700",
  "picked-up": "bg-cyan-100 text-cyan-700",
  "in-transit": "bg-violet-100 text-violet-700",
  delivered: "bg-lime-100 text-lime-800",
  cancelled: "bg-rose-100 text-rose-700",
};

const statusLabels: Record<Shipment["status"], string> = {
  pending: "Pending",
  assigned: "Assigned",
  "picked-up": "Picked Up",
  "in-transit": "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function ManageShipment() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedShipment, setSelectedShipment] =
    useState<Shipment | null>(null);

  const [shipmentToDelete, setShipmentToDelete] =
    useState<Shipment | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Shipment assignment
  const [shipmentToAssign, setShipmentToAssign] =
    useState<Shipment | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [loadingAssignmentOptions, setLoadingAssignmentOptions] =
    useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");
  const [assignmentMessage, setAssignmentMessage] = useState("");

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/shipments");

      if (response.data.success) {
        setShipments(response.data.shipments);
      } else {
        setError("Unable to load shipments.");
      }
    } catch (err) {
      console.error("Shipment fetching error:", err);
      setError("Failed to load shipments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleDeleteShipment = async () => {
    if (!shipmentToDelete || deleting) return;

    try {
      setDeleting(true);
      setDeleteError("");
      setDeleteMessage("");

      await api.delete(`/shipments/${shipmentToDelete._id}`);

      setShipments((prev) =>
        prev.filter(
          (shipment) => shipment._id !== shipmentToDelete._id
        )
      );

      if (selectedShipment?._id === shipmentToDelete._id) {
        setSelectedShipment(null);
      }

      setShipmentToDelete(null);
      setDeleteMessage("Shipment deleted successfully.");
    } catch (err: any) {
      console.error("Shipment deletion error:", err);

      setDeleteError(
        err.response?.data?.message ||
          "Failed to delete shipment. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const openAssignmentModal = async (shipment: Shipment) => {
    setShipmentToAssign(shipment);
    setSelectedDriverId("");
    setSelectedVehicleId("");
    setAssignmentError("");
    setAssignmentMessage("");
    setLoadingAssignmentOptions(true);

    try {
      const [driverResponse, vehicleResponse] = await Promise.all([
        api.get("/drivers"),
        api.get("/vehicles"),
      ]);

      const availableDrivers: Driver[] = (
        driverResponse.data.drivers || []
      ).filter(
        (driver: Driver) =>
          driver.user?.isActive === true &&
          driver.availabilityStatus === "available"
      );

      const availableVehicles: Vehicle[] = (
        vehicleResponse.data.vehicles || []
      ).filter(
        (vehicle: Vehicle) =>
          vehicle.isActive === true && vehicle.status === "available"
      );

      setDrivers(availableDrivers);
      setVehicles(availableVehicles);

      if (availableDrivers.length === 0) {
        setAssignmentError("No active and available drivers found.");
      } else if (availableVehicles.length === 0) {
        setAssignmentError("No active and available vehicles found.");
      }
    } catch (err: any) {
      console.error("Assignment options error:", err);
      setAssignmentError(
        err.response?.data?.message ||
          "Failed to load available drivers and vehicles."
      );
    } finally {
      setLoadingAssignmentOptions(false);
    }
  };

  const handleAssignShipment = async () => {
    if (!shipmentToAssign || !selectedDriverId || !selectedVehicleId) {
      setAssignmentError("Please select both a driver and a vehicle.");
      return;
    }

    try {
      setAssigning(true);
      setAssignmentError("");

      const response = await api.put(
        `/shipments/${shipmentToAssign._id}/assign`,
        {
          driverId: selectedDriverId,
          vehicleId: selectedVehicleId,
        }
      );

      if (!response.data.success) {
        setAssignmentError(
          response.data.message || "Failed to assign shipment."
        );
        return;
      }

      setAssignmentMessage("Shipment assigned successfully.");
      setShipmentToAssign(null);
      setSelectedDriverId("");
      setSelectedVehicleId("");

      // Refresh shipment data to show the new assignment and status.
      await fetchShipments();
    } catch (err: any) {
      console.error("Shipment assignment error:", err);
      setAssignmentError(
        err.response?.data?.message ||
          "Failed to assign shipment. Please try again."
      );
    } finally {
      setAssigning(false);
    }
  };

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        shipment._id.toLowerCase().includes(search) ||
        shipment.goodsType.toLowerCase().includes(search) ||
        shipment.pickupAddress.toLowerCase().includes(search) ||
        shipment.deliveryAddress.toLowerCase().includes(search) ||
        shipment.customer?.name.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" || shipment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [shipments, searchTerm, statusFilter]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#f1effb] p-4 text-[#20213a] sm:p-6">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* Heading */}
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Workspace</span>
              <span>/</span>
              <span className="font-semibold text-violet-700">
                Shipments
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Shipment Management
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Manage and monitor all your delivery shipments.
            </p>
          </div>

          <button
            onClick={fetchShipments}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Shipments
          </button>
        </section>

        {/* Assignment success message */}
        {assignmentMessage && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-medium text-green-700">
            {assignmentMessage}
          </div>
        )}

        {/* Delete success and error messages */}
        {deleteMessage && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-medium text-green-700">
            {deleteMessage}
          </div>
        )}

        {deleteError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-600">
            {deleteError}
          </div>
        )}

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Shipments",
              value: shipments.length,
              icon: Package,
              color: "bg-violet-100 text-violet-600",
            },
            {
              label: "Pending",
              value: shipments.filter((s) => s.status === "pending").length,
              icon: CalendarDays,
              color: "bg-amber-100 text-amber-600",
            },
            {
              label: "In Progress",
              value: shipments.filter((s) =>
                ["assigned", "picked-up", "in-transit"].includes(s.status)
              ).length,
              icon: MapPin,
              color: "bg-blue-100 text-blue-600",
            },
            {
              label: "Delivered",
              value: shipments.filter((s) => s.status === "delivered").length,
              icon: Package,
              color: "bg-lime-100 text-lime-700",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-[20px] border border-white bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <h2 className="mt-2 text-3xl font-bold">
                      {item.value}
                    </h2>
                  </div>

                  <div className={`rounded-xl p-3 ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Shipment table */}
        <section className="rounded-[20px] border border-white bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold">All Shipments</h2>
              <p className="mt-1 text-[10px] text-slate-400">
                View and manage shipment records.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search shipments..."
                  className="w-36 bg-transparent text-xs outline-none sm:w-48"
                />
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="picked-up">Picked Up</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400">
                  <th className="pb-4">SHIPMENT ID</th>
                  <th className="pb-4">CUSTOMER</th>
                  <th className="pb-4">GOODS TYPE</th>
                  <th className="pb-4">DESTINATION</th>
                  <th className="pb-4">DRIVER</th>
                  <th className="pb-4">STATUS</th>
                  <th className="pb-4">DATE</th>
                  <th className="pb-4 text-right">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-xs text-slate-400">
                      Loading shipments...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm text-rose-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-xs text-slate-400">
                      No shipments found.
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((shipment) => (
                    <tr
                      key={shipment._id}
                      className="border-b border-slate-50 text-[11px] last:border-0 hover:bg-violet-50/40"
                    >
                      <td className="py-4 font-semibold text-violet-700">
                        #{shipment._id.slice(-8).toUpperCase()}
                      </td>

                      <td className="py-4">
                        <p className="font-semibold text-slate-700">
                          {shipment.customer?.name ?? "Unknown"}
                        </p>
                        <p className="mt-1 text-[9px] text-slate-400">
                          {shipment.customer?.email ?? ""}
                        </p>
                      </td>

                      <td className="py-4 text-slate-600">
                        {shipment.goodsType}
                      </td>

                      <td className="py-4 text-slate-600">
                        {shipment.deliveryAddress}
                      </td>

                      <td className="py-4 text-slate-600">
                        {shipment.assignedDriver?.name ?? "Not assigned"}
                      </td>

                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold ${statusStyles[shipment.status]}`}
                        >
                          {statusLabels[shipment.status]}
                        </span>
                      </td>

                      <td className="py-4 text-slate-500">
                        {formatDate(shipment.createdAt)}
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {shipment.status === "pending" && (
                            <button
                              onClick={() => openAssignmentModal(shipment)}
                              className="flex items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-2 text-[10px] font-semibold text-white transition hover:bg-violet-700"
                              title="Assign driver and vehicle"
                            >
                              <UserPlus className="h-3.5 w-3.5" />
                              Assign
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedShipment(shipment)}
                            className="rounded-lg bg-violet-50 p-2 text-violet-600 hover:bg-violet-100"
                            title="View shipment"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => {
                              setDeleteError("");
                              setDeleteMessage("");
                              setShipmentToDelete(shipment);
                            }}
                            className="rounded-lg bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                            title="Delete shipment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-[10px] text-slate-400">
            Showing {filteredShipments.length} of {shipments.length} shipments
          </div>
        </section>

        {/* Shipment Assignment Modal */}
        {shipmentToAssign && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Assign Shipment</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Shipment #{shipmentToAssign._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!assigning) {
                      setShipmentToAssign(null);
                      setAssignmentError("");
                    }
                  }}
                  disabled={assigning}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
                  aria-label="Close assignment modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 rounded-xl bg-violet-50 p-4 text-xs">
                <p className="font-semibold text-violet-800">
                  {shipmentToAssign.goodsType}
                </p>
                <p className="mt-2 text-slate-600">
                  {shipmentToAssign.pickupAddress} → {shipmentToAssign.deliveryAddress}
                </p>
                <div className="mt-2 flex flex-wrap gap-4 text-slate-500">
                  <span>Weight: {shipmentToAssign.weight} kg</span>
                  <span>Volume: {shipmentToAssign.volume ?? 0} m³</span>
                </div>
              </div>

              {assignmentError && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
                  {assignmentError}
                </div>
              )}

              {loadingAssignmentOptions ? (
                <div className="py-10 text-center text-xs text-slate-500">
                  Loading available drivers and vehicles...
                </div>
              ) : (
                <div className="mt-5 space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Select Driver
                    </label>
                    <select
                      value={selectedDriverId}
                      onChange={(e) => setSelectedDriverId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-violet-400"
                      disabled={drivers.length === 0 || assigning}
                    >
                      <option value="">Choose an available driver</option>
                      {drivers.map((driver) => (
                        <option key={driver._id} value={driver._id}>
                          {driver.user.name} — {driver.user.email}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Only active drivers with available status are shown.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Select Vehicle
                    </label>
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-violet-400"
                      disabled={vehicles.length === 0 || assigning}
                    >
                      <option value="">Choose an available vehicle</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle._id} value={vehicle._id}>
                          {vehicle.registrationNumber} — {vehicle.vehicleType} — {vehicle.capacity} kg — {vehicle.volumeCapacity} m³
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Only active vehicles with available status are shown.
                    </p>
                  </div>

                  {selectedVehicleId && (
                    <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-violet-800">
                        <Truck className="h-4 w-4" />
                        Selected Vehicle Capacity
                      </div>
                      {(() => {
                        const vehicle = vehicles.find(
                          (item) => item._id === selectedVehicleId
                        );
                        if (!vehicle) return null;
                        return (
                          <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-slate-600">
                            <p>Weight: {vehicle.capacity} kg</p>
                            <p>Volume: {vehicle.volumeCapacity} m³</p>
                            <p>
                              Shipment weight: {shipmentToAssign.weight} kg
                            </p>
                            <p>
                              Shipment volume: {shipmentToAssign.volume ?? 0} m³
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-7 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShipmentToAssign(null);
                    setAssignmentError("");
                  }}
                  disabled={assigning}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignShipment}
                  disabled={
                    assigning ||
                    loadingAssignmentOptions ||
                    !selectedDriverId ||
                    !selectedVehicleId
                  }
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" />
                  {assigning ? "Assigning..." : "Confirm Assignment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shipment details modal */}
        {selectedShipment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Shipment Details</h2>

                <button
                  onClick={() => setSelectedShipment(null)}
                  className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-100"
                >
                  ×
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs">
                <div>
                  <p className="text-slate-400">Shipment ID</p>
                  <p className="mt-1 font-semibold">
                    #{selectedShipment._id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400">Customer</p>
                    <p className="mt-1 font-semibold">
                      {selectedShipment.customer?.name ?? "Unknown"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Goods Type</p>
                    <p className="mt-1 font-semibold">
                      {selectedShipment.goodsType}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Weight</p>
                    <p className="mt-1 font-semibold">
                      {selectedShipment.weight} kg
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Volume</p>
                    <p className="mt-1 font-semibold">
                      {selectedShipment.volume ?? "Not provided"}
                      {selectedShipment.volume != null ? " m³" : ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Fragile</p>
                    <p className="mt-1 font-semibold">
                      {selectedShipment.isFragile ? "Yes" : "No"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Driver</p>
                    <p className="mt-1 font-semibold">
                      {selectedShipment.assignedDriver?.name ?? "Not assigned"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Vehicle</p>
                    <p className="mt-1 font-semibold">
                      {selectedShipment.assignedVehicle?.registrationNumber ?? "Not assigned"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Status</p>
                    <p className="mt-1 font-semibold">
                      {statusLabels[selectedShipment.status]}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400">Pickup Address</p>
                  <p className="mt-1 font-semibold">
                    {selectedShipment.pickupAddress}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Delivery Address</p>
                  <p className="mt-1 font-semibold">
                    {selectedShipment.deliveryAddress}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedShipment(null)}
                className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-xs font-semibold text-white hover:bg-violet-700"
              >
                Close Details
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {shipmentToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-rose-100 p-3 text-rose-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#20213a]">
                    Delete Shipment?
                  </h2>
                  <p className="text-xs text-slate-400">
                    Confirm shipment deletion
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-600">
                Are you sure you want to delete shipment{" "}
                <span className="font-bold text-violet-700">
                  #{shipmentToDelete._id.slice(-8).toUpperCase()}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShipmentToDelete(null)}
                  disabled={deleting}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteShipment}
                  disabled={deleting}
                  className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting ? "Deleting..." : "Delete Shipment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
