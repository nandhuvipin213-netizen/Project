
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Truck,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import api from "../../services/Api";

interface Vehicle {
  _id: string;
  registrationNumber: string;
  vehicleType: string;
  capacity: number;
  volumeCapacity: number;
  startingPrice: number;
  status: "available" | "in-use" | "maintenance";
  isActive: boolean;
}

interface VehicleForm {
  registrationNumber: string;
  vehicleType: string;
  capacity: string;
  startingPrice: string;
  volumeCapacity: string;
}

const initialForm: VehicleForm = {
  registrationNumber: "",
  vehicleType: "truck",
  capacity: "",
  startingPrice: "",
  volumeCapacity: "",
};

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VehicleForm>(initialForm);
  const [error, setError] = useState("");

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.get("/vehicles");
      setVehicles(response.data.vehicles || []);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
      setError("Unable to load vehicles. Please check your login and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");


   const payload = {
  registrationNumber: form.registrationNumber.trim().toUpperCase(),
  vehicleType: form.vehicleType,
  capacity: Number(form.capacity),
  volumeCapacity: Number(form.volumeCapacity),
  startingPrice: Number(form.startingPrice),
};
    try {
      if (editingId) {
        await api.put(`/vehicles/${editingId}`, payload);
      } else {
        await api.post("/vehicles", payload);
      }
      startingPrice: Number(form.startingPrice),
        setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      await fetchVehicles();
    } catch (err: any) {
      console.error("Failed to save vehicle:", err);
      setError(err.response?.data?.message || "Failed to save vehicle.");
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle._id);
    setForm({
      registrationNumber: vehicle.registrationNumber,
      vehicleType: vehicle.vehicleType,
      capacity: String(vehicle.capacity),
      startingPrice: String(vehicle.startingPrice ?? 0),
      volumeCapacity: String(vehicle.volumeCapacity),
    });
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/vehicles/${id}`);
      await fetchVehicles();
    } catch (err: any) {
      console.error("Failed to delete vehicle:", err);
      setError(err.response?.data?.message || "Failed to delete vehicle.");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setError("");
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    `${vehicle.registrationNumber} ${vehicle.vehicleType} ${vehicle.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const statusStyle: Record<Vehicle["status"], string> = {
    available: "bg-lime-100 text-lime-700",
    "in-use": "bg-violet-100 text-violet-700",
    maintenance: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="space-y-5 text-[#20213a]">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">Workspace / Vehicles</p>
          <h1 className="mt-1 text-2xl font-bold">Vehicle Management</h1>
          <p className="mt-1 text-xs text-slate-500">
            Register and manage your delivery fleet.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setForm(initialForm);
            setError("");
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-violet-200"
        >
          <Plus size={16} />
          Add Vehicle
        </button>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Total Vehicles", value: vehicles.length },
          {
            label: "Available",
            value: vehicles.filter((v) => v.status === "available").length,
          },
          {
            label: "In Use",
            value: vehicles.filter((v) => v.status === "in-use").length,
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-white bg-white p-5 shadow-sm"
          >
            <p className="text-xs text-slate-500">{item.label}</p>
            <h2 className="mt-2 text-2xl font-bold">{item.value}</h2>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-white bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold">Registered Vehicles</h2>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
            <Search size={15} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vehicles..."
              className="w-36 text-xs outline-none sm:w-52"
            />
          </label>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-600">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Loading vehicles...
          </p>
        ) : filteredVehicles.length === 0 ? (
          <div className="py-12 text-center">
            <Truck className="mx-auto mb-3 text-slate-300" size={36} />
            <p className="font-semibold">No vehicles found</p>
            <p className="mt-1 text-xs text-slate-400">
              Add your first vehicle to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead>
                <tr className="border-b text-[10px] text-slate-400">
                  <th className="pb-3">VEHICLE</th>
                  <th className="pb-3">TYPE</th>
                  <th className="pb-3">CAPACITY</th>
                  <th className="pb-3">VOLUME</th>
                  <th className="pb-3">STARTING PRICE</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="border-b last:border-0">
                    <td className="py-4 text-xs font-semibold">
                      {vehicle.registrationNumber}
                    </td>
                    <td className="py-4 text-xs capitalize">
                      {vehicle.vehicleType.replace("-", " ")}
                    </td>
                    <td className="py-4 text-xs">{vehicle.capacity}</td>
                    <td className="py-4 text-xs">{vehicle.volumeCapacity}</td>
                    <td className="py-4 text-xs">{vehicle.startingPrice ?? 0} ₹</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-semibold capitalize ${statusStyle[vehicle.status]}`}
                      >
                        {vehicle.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(vehicle)}
                          title="Edit vehicle"
                          className="rounded-lg bg-violet-50 p-2 text-violet-600"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle._id)}
                          title="Delete vehicle"
                          className="rounded-lg bg-rose-50 p-2 text-rose-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editingId ? "Edit Vehicle" : "Add New Vehicle"}
              </h2>
              <button onClick={closeForm} aria-label="Close form">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold">
                  Registration Number
                </label>
                <input
                  name="registrationNumber"
                  value={form.registrationNumber}
                  onChange={handleChange}
                  placeholder="KL 01 AB 1234"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-500"
                >
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="mini-truck">Mini Truck</option>
                  <option value="container">Container</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold">
                    Capacity (kg)
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold">
                    Volume Capacity
                  </label>
                  <input
                    type="number"
                    name="volumeCapacity"
                    value={form.volumeCapacity}
                    onChange={handleChange}
                    min="0.1"
                    step="any"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">
                  Starting Price (₹)
                </label>
                <input
                  type="number"
                  name="startingPrice"
                  value={form.startingPrice}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="Enter starting price"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-500"
                />
              </div>
              {error && (
                <p className="text-xs text-rose-600">{error}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border px-4 py-2.5 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white"
                >
                  {editingId ? "Save Changes" : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
