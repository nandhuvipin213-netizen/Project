import ShipmentMap from "../../components/driver/ShipmentMap";
import DeliveryProgress from "../../components/driver/DeliveryProgress";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Package,
    MapPin,
    Truck,
    RefreshCw,
} from "lucide-react";
import api from "../../services/Api";

interface Coordinates {
    lat: number | null;
    lng: number | null;
}

interface Shipment {
    _id: string;
    pickupAddress: string;
    deliveryAddress: string;
    pickupCoordinates?: Coordinates | null;
    deliveryCoordinates?: Coordinates | null;
    goodsType: string;
    weight: number;
    volume?: number;
    isFragile: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface ShipmentsResponse {
    success: boolean;
    count: number;
    shipments: Shipment[];
}
interface DriverLocation {
    lat: number;
    lng: number;
}
function ActiveDelivery() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [updatingShipmentId, setUpdatingShipmentId] = useState<string | null>(null);
    const [driverLocation, setDriverLocation] =
        useState<DriverLocation | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchShipments = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get<ShipmentsResponse>(
                    "/drivers/my-shipments"
                );

                if (isMounted) {
                    const activeShipments = response.data.shipments.filter(
                        (shipment) =>
                            ["assigned", "picked-up", "in-transit"].includes(
                                shipment.status
                            )
                    );

                    setShipments(activeShipments);
                }
            } catch (error: unknown) {
                if (isMounted) {
                    if (axios.isAxiosError(error)) {
                        setError(
                            error.response?.data?.message ||
                            "Unable to load active deliveries."
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

        fetchShipments();

        return () => {
            isMounted = false;
        };
    }, [refreshKey]);

    const handleStatusUpdate = async (
        shipmentId: string,
        newStatus: string
    ) => {
        try {
            setUpdatingShipmentId(shipmentId);

            const response = await api.put(
                `/shipments/driver/${shipmentId}/status`,
                { status: newStatus }
            );

            if (response.data.success) {
                if (newStatus === "delivered") {
                    // Remove completed shipment from active deliveries
                    setShipments((prev) =>
                        prev.filter((shipment) => shipment._id !== shipmentId)
                    );
                } else {
                    setShipments((prev) =>
                        prev.map((shipment) =>
                            shipment._id === shipmentId
                                ? { ...shipment, status: newStatus }
                                : shipment
                        )
                    );
                }
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(
                    error.response?.data?.message ||
                    "Failed to update delivery status."
                );
            } else {
                alert("Something went wrong.");
            }
        } finally {
            setUpdatingShipmentId(null);
        }
    };

    const fetchDriverLocation = async () => {
        try {
            const response = await api.get("/drivers/my-location");

            if (response.data.success && response.data.currentLocation) {
                const { lat, lng } = response.data.currentLocation;

                if (typeof lat === "number" && typeof lng === "number") {
                    setDriverLocation({ lat, lng });
                }
            }
        } catch (error) {
            console.error("Failed to fetch driver location:", error);
        }
    };
    useEffect(() => {
        fetchDriverLocation();

        const interval = setInterval(() => {
            fetchDriverLocation();
        }, 10000);

        return () => clearInterval(interval);
    }, []);


    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                        Driver Workspace
                    </p>

                    <h1 className="mt-2 text-2xl font-extrabold text-slate-800">
                        Active Deliveries
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage your ongoing pickup and delivery tasks.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setRefreshKey((prev) => prev + 1)}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-50 disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            {loading && (
                <div className="rounded-2xl bg-white p-10 text-center">
                    <RefreshCw className="mx-auto h-7 w-7 animate-spin text-violet-600" />
                    <p className="mt-3 text-sm text-slate-500">
                        Loading active deliveries...
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="rounded-2xl border border-rose-200 bg-white p-6 text-center">
                    <p className="text-sm text-rose-600">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-slate-800">
                                Your Active Shipments
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Shipments currently assigned to you.
                            </p>
                        </div>

                        <span className="rounded-full bg-violet-100 px-3 py-1.5 text-sm font-bold text-violet-700">
                            {shipments.length}
                        </span>
                    </div>

                    {shipments.length === 0 ? (
                        <div className="py-12 text-center">
                            <Package className="mx-auto h-12 w-12 text-slate-300" />
                            <h3 className="mt-3 font-bold text-slate-700">
                                No active deliveries
                            </h3>
                            <p className="mt-1 text-sm text-slate-400">
                                Your active shipments will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-5 space-y-4">
                            {shipments.map((shipment) => (
                                <div
                                    key={shipment._id}
                                    className="rounded-xl border border-slate-100 p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700">
                                            <Truck className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-800">
                                                Shipment #{shipment._id.slice(-6).toUpperCase()}
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                {shipment.goodsType}
                                            </p>
                                        </div>
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
                                    </div>

                                    {/* Live Delivery Map */}
                                      {shipment.pickupCoordinates?.lat != null &&
                                        shipment.pickupCoordinates?.lng != null &&
                                        shipment.deliveryCoordinates?.lat != null &&
                                        shipment.deliveryCoordinates?.lng != null && (
                                            <div className="mt-5">
                                                <h3 className="mb-3 font-semibold text-slate-800">
                                                    Live Delivery Map
                                                </h3>

                                                <ShipmentMap
                                                    pickupCoordinates={{
                                                        lat: shipment.pickupCoordinates.lat,
                                                        lng: shipment.pickupCoordinates.lng,
                                                    }}
                                                    deliveryCoordinates={{
                                                        lat: shipment.deliveryCoordinates.lat,
                                                        lng: shipment.deliveryCoordinates.lng,
                                                    }}
                                                    driverCoordinates={driverLocation}
                                                />
                                            </div>
                                        )}

                                        <DeliveryProgress status={shipment.status} />

                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                        <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700">
                                            {shipment.status.replace("-", " ").toUpperCase()}
                                        </span>

                                        {shipment.status === "assigned" && (
                                            <button
                                                disabled={updatingShipmentId === shipment._id}
                                                onClick={() =>
                                                    handleStatusUpdate(shipment._id, "picked-up")
                                                }
                                                className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {updatingShipmentId === shipment._id
                                                    ? "Updating..."
                                                    : "Mark as Picked Up"}
                                            </button>
                                        )}

                                        {shipment.status === "picked-up" && (
                                            <button
                                                disabled={updatingShipmentId === shipment._id}
                                                onClick={() =>
                                                    handleStatusUpdate(shipment._id, "in-transit")
                                                }
                                                className="rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50"
                                            >
                                                {updatingShipmentId === shipment._id
                                                    ? "Updating..."
                                                    : "Start Delivery"}
                                            </button>
                                        )}

                                        {shipment.status === "in-transit" && (
                                            <button
                                                disabled={updatingShipmentId === shipment._id}
                                                onClick={() =>
                                                    handleStatusUpdate(shipment._id, "delivered")
                                                }
                                                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                                            >
                                                {updatingShipmentId === shipment._id
                                                    ? "Updating..."
                                                    : "Mark as Delivered"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}

export default ActiveDelivery;
