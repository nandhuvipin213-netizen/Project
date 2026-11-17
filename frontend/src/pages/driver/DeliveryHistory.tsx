
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
    <div className="w-full min-w-0 space-y-4 sm:space-y-6">

      {/* Page Header */}
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
          Driver Workspace
        </p>

        <h1 className="mt-2 text-xl font-extrabold text-slate-800 sm:text-2xl lg:text-3xl">
          Delivery History
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View your previously completed deliveries.
        </p>
      </div>

      {/* History Container */}
      <div className="min-w-0 rounded-2xl border border-violet-100 bg-white p-3 shadow-sm sm:p-5">

        {/* Summary */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 sm:h-12 sm:w-12">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-500 sm:text-sm">
              Total Completed Deliveries
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-slate-800 sm:text-2xl">
              {shipments.length}
            </h2>
          </div>
        </div>

        {/* Search */}
        <div className="mt-5">
          <div className="relative min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shipments..."
              className="w-full min-w-0 rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-10 text-center">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-violet-600" />

            <p className="mt-3 text-sm text-slate-500">
              Loading delivery history...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="break-words py-8 text-center text-sm text-rose-600">
            {error}
          </div>
        )}

        {/* Shipment List */}
        {!loading && !error && (
          <div className="mt-4 min-w-0 space-y-4 sm:mt-5">

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
                  className="min-w-0 rounded-xl border border-slate-100 p-3 transition hover:border-violet-200 sm:p-4"
                >

                  {/* Shipment Header */}
                  <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">

                    <div className="flex min-w-0 items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700">
                        <Package className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words text-sm font-bold text-slate-800 sm:text-base">
                          Shipment #
                          {shipment._id.slice(-6).toUpperCase()}
                        </h3>

                        <p className="mt-1 break-words text-xs text-slate-500 sm:text-sm">
                          {shipment.goodsType} · {shipment.weight} kg
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      DELIVERED
                    </span>
                  </div>

                  {/* Addresses */}
                  <div className="mt-4 min-w-0 space-y-3">

                    <div className="flex min-w-0 items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                      <p className="min-w-0 break-words text-sm leading-6 text-slate-600 [overflow-wrap:anywhere]">
                        <span className="font-semibold text-slate-700">
                          Pickup:
                        </span>{" "}
                        {shipment.pickupAddress}
                      </p>
                    </div>

                    <div className="flex min-w-0 items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />

                      <p className="min-w-0 break-words text-sm leading-6 text-slate-600 [overflow-wrap:anywhere]">
                        <span className="font-semibold text-slate-700">
                          Delivery:
                        </span>{" "}
                        {shipment.deliveryAddress}
                      </p>
                    </div>

                  </div>

                  {/* Completion Date */}
                  <div className="mt-4 flex min-w-0 items-start gap-2 border-t border-slate-100 pt-3">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                    <p className="min-w-0 break-words text-xs leading-5 text-slate-500 sm:text-sm">
                      <span className="font-semibold text-slate-600">
                        Completed:
                      </span>{" "}
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
