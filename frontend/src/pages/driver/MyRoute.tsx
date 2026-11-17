
import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Package,
  RefreshCw,
  Route,
} from "lucide-react";
import api from "../../services/Api";
import ShipmentMap from "../../components/driver/ShipmentMap";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Shipment {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupCoordinates?: Coordinates;
  deliveryCoordinates?: Coordinates;
  goodsType: string;
  weight: number;
  status: string;
}

interface ShipmentsResponse {
  success: boolean;
  count: number;
  shipments: Shipment[];
}

function MyRoute() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<ShipmentsResponse>(
          "/drivers/my-shipments"
        );

        const activeShipments = response.data.shipments.filter(
          (shipment) =>
            ["assigned", "picked-up", "in-transit"].includes(
              shipment.status
            )
        );

        setShipments(activeShipments);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
            "Unable to load your route."
          );
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, []);

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      {/* Page Heading */}
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
          Driver Workspace
        </p>

        <h1 className="mt-2 text-xl font-extrabold text-slate-800 sm:text-2xl">
          My Route
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View your active delivery routes and locations.
        </p>
      </div>

      {/* Route Statistics */}
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="min-w-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-3">
            <Route className="h-7 w-7 shrink-0 text-violet-600 sm:h-8 sm:w-8" />
            <div className="min-w-0">
              <p className="text-sm text-slate-500">
                Active Routes
              </p>
              <h2 className="text-xl font-extrabold text-slate-800 sm:text-2xl">
                {shipments.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-3">
            <Package className="h-7 w-7 shrink-0 text-violet-600 sm:h-8 sm:w-8" />
            <div className="min-w-0">
              <p className="text-sm text-slate-500">
                Active Shipments
              </p>
              <h2 className="text-xl font-extrabold text-slate-800 sm:text-2xl">
                {shipments.length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Delivery Routes */}
      <div className="min-w-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-5 text-base font-bold text-slate-800 sm:text-lg">
          Assigned Delivery Routes
        </h2>

        {loading && (
          <div className="py-10 text-center">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-violet-600" />
            <p className="mt-3 text-sm text-slate-500">
              Loading your routes...
            </p>
          </div>
        )}

        {!loading && error && (
          <p className="break-words py-8 text-center text-sm text-rose-600">
            {error}
          </p>
        )}

        {!loading && !error && shipments.length === 0 && (
          <div className="py-10 text-center">
            <Route className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-700">
              No active routes
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Your assigned shipments will appear here.
            </p>
          </div>
        )}

        {!loading && !error && shipments.length > 0 && (
          <div className="min-w-0 space-y-5 sm:space-y-6">
            {shipments.map((shipment, index) => {
              return (
                <div
                  key={shipment._id}
                  className="min-w-0 overflow-hidden rounded-xl border border-slate-100 p-3 sm:p-4"
                >
                  {/* Shipment Header */}
                  <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-sm font-bold text-slate-800 sm:text-base">
                        Route {index + 1} · Shipment #
                        {shipment._id.slice(-6).toUpperCase()}
                      </h3>

                      <p className="mt-1 break-words text-xs text-slate-500">
                        {shipment.goodsType} · {shipment.weight} kg
                      </p>
                    </div>

                    <span className="w-fit shrink-0 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold capitalize text-violet-700">
                      {shipment.status.replace("-", " ")}
                    </span>
                  </div>

                  {/* Pickup and Delivery Addresses */}
                  <div className="mb-5 min-w-0 space-y-3">
                    <p className="flex min-w-0 items-start gap-2 text-sm text-slate-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                        <span className="font-semibold">Pickup:</span>{" "}
                        {shipment.pickupAddress}
                      </span>
                    </p>

                    <p className="flex min-w-0 items-start gap-2 text-sm text-slate-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                        <span className="font-semibold">Delivery:</span>{" "}
                        {shipment.deliveryAddress}
                      </span>
                    </p>
                  </div>

                  {/* Route Map */}
                  {shipment.pickupCoordinates &&
                    shipment.deliveryCoordinates &&
                    Number.isFinite(shipment.pickupCoordinates.lat) &&
                    Number.isFinite(shipment.pickupCoordinates.lng) &&
                    Number.isFinite(shipment.deliveryCoordinates.lat) &&
                    Number.isFinite(shipment.deliveryCoordinates.lng) ? (
                    <div className="w-full min-w-0 overflow-hidden rounded-xl">
                      <ShipmentMap
                        pickupCoordinates={shipment.pickupCoordinates}
                        deliveryCoordinates={shipment.deliveryCoordinates}
                        shipmentStatus={shipment.status}
                      />
                    </div>
                  ) : (
                    <p className="break-words rounded-xl bg-amber-50 p-3 text-sm text-amber-700 sm:p-4">
                      Route map is unavailable because location coordinates are missing.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRoute;
