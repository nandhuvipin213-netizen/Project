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
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
          Driver Workspace
        </p>

        <h1 className="mt-2 text-2xl font-extrabold text-slate-800">
          My Route
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View your active delivery routes and locations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Route className="h-8 w-8 text-violet-600" />
            <div>
              <p className="text-sm text-slate-500">
                Active Routes
              </p>
              <h2 className="text-2xl font-extrabold text-slate-800">
                {shipments.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-violet-600" />
            <div>
              <p className="text-sm text-slate-500">
                Active Shipments
              </p>
              <h2 className="text-2xl font-extrabold text-slate-800">
                {shipments.length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-800">
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
          <p className="py-8 text-center text-sm text-rose-600">
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

        {!loading && !error && (
          <div className="space-y-6">
            {shipments.map((shipment, index) => {
              const hasCoordinates =
                shipment.pickupCoordinates &&
                shipment.deliveryCoordinates &&
                Number.isFinite(shipment.pickupCoordinates.lat) &&
                Number.isFinite(shipment.pickupCoordinates.lng) &&
                Number.isFinite(shipment.deliveryCoordinates.lat) &&
                Number.isFinite(shipment.deliveryCoordinates.lng);

              return (
                <div
                  key={shipment._id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-800">
                        Route {index + 1} · Shipment #
                        {shipment._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {shipment.goodsType} · {shipment.weight} kg
                      </p>
                    </div>

                    <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold capitalize text-violet-700">
                      {shipment.status.replace("-", " ")}
                    </span>
                  </div>

                  <div className="mb-5 space-y-3">
                    <p className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
                      Pickup: {shipment.pickupAddress}
                    </p>

                    <p className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0 text-rose-500" />
                      Delivery: {shipment.deliveryAddress}
                    </p>
                  </div>

                  {hasCoordinates ? (
                    <ShipmentMap
                      pickupCoordinates={shipment.pickupCoordinates!}
                      deliveryCoordinates={shipment.deliveryCoordinates!}
                    />
                  ) : (
                    <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
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