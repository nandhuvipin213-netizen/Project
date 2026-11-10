
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  MapPin,
  CalendarDays,
  RefreshCw,
  Search,
  CheckCircle2,
} from "lucide-react";
import api from "../../services/Api";

interface Shipment {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  goodsType: string;
  weight: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ShipmentsResponse {
  success: boolean;
  count: number;
  shipments: Shipment[];
}

function DeliveryHistory() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<ShipmentsResponse>(
          "/drivers/my-shipments"
        );

        const completedShipments = response.data.shipments.filter(
          (shipment) => shipment.status === "delivered"
        );

        setShipments(completedShipments);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
              "Unable to load delivery history."
          );
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredShipments = shipments.filter((shipment) => {
    const query = search.toLowerCase();

    return (
      shipment._id.toLowerCase().includes(query) ||
      shipment.goodsType.toLowerCase().includes(query) ||
      shipment.pickupAddress.toLowerCase().includes(query) ||
      shipment.deliveryAddress.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
          Driver Workspace
        </p>

        <h1 className="mt-2 text-2xl font-extrabold text-slate-800">
          Delivery History
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View your previously completed deliveries.
        </p>
      </div>

      <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />

          <div>
            <p className="text-sm text-slate-500">
              Total Completed Deliveries
            </p>
            <h2 className="text-2xl font-extrabold text-slate-800">
              {shipments.length}
            </h2>
          </div>
        </div>

        <div className="mt-5">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shipments..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-400"
            />
          </div>
        </div>

        {loading && (
          <div className="py-10 text-center">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-violet-600" />
            <p className="mt-3 text-sm text-slate-500">
              Loading delivery history...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="py-8 text-center text-sm text-rose-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-5 space-y-4">
            {filteredShipments.length === 0 ? (
              <div className="py-10 text-center">
                <Package className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-3 font-semibold text-slate-700">
                  No completed deliveries found
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Your completed shipments will appear here.
                </p>
              </div>
            ) : (
              filteredShipments.map((shipment) => (
                <div
                  key={shipment._id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-800">
                        Shipment #{shipment._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {shipment.goodsType} · {shipment.weight} kg
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      DELIVERED
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
                      Pickup: {shipment.pickupAddress}
                    </p>

                    <p className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0 text-rose-500" />
                      Delivery: {shipment.deliveryAddress}
                    </p>

                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays className="h-4 w-4" />
                      Completed:{" "}
                      {new Date(shipment.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryHistory;
