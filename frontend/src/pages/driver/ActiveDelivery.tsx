
import ShipmentMap from "../../components/driver/ShipmentMap";
import DeliveryProgress from "../../components/driver/DeliveryProgress";
import { useEffect, useRef, useState } from "react";
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

const LOCATION_SEND_INTERVAL_MS = 10000;

function ActiveDelivery() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    const [updatingShipmentId, setUpdatingShipmentId] =
        useState<string | null>(null);

    const [driverLocation, setDriverLocation] =
        useState<DriverLocation | null>(null);

    const [locationAccuracy, setLocationAccuracy] =
        useState<number | null>(null);

    const [locationError, setLocationError] = useState("");

    const lastSentRef = useRef(0);

    // Fetch active shipments
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

    // Update shipment status
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

    // Watch driver's live GPS position
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError(
                "Geolocation is not supported by this browser."
            );
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                console.log("Current GPS:", {
                    latitude,
                    longitude,
                    accuracy,
                });

                setDriverLocation({
                    lat: latitude,
                    lng: longitude,
                });

                setLocationAccuracy(Math.round(accuracy));
                setLocationError("");

                const now = Date.now();

                if (
                    now - lastSentRef.current <
                    LOCATION_SEND_INTERVAL_MS
                ) {
                    return;
                }

                lastSentRef.current = now;

                try {
                    await api.put("/drivers/update-location", {
                        lat: latitude,
                        lng: longitude,
                    });
                } catch (err) {
                    console.error("Location update failed:", err);
                }
            },
            (err) => {
                console.error("GPS error:", err.code, err.message);

                if (err.code === 1) {
                    setLocationError(
                        "Location permission denied. Allow location access in your browser settings."
                    );
                } else if (err.code === 2) {
                    setLocationError(
                        "Location unavailable. Turn on location services and check your signal."
                    );
                } else {
                    setLocationError(
                        "Getting your location timed out. Retrying..."
                    );
                }
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 30000,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <div className="w-full min-w-0 space-y-4 sm:space-y-6">

            {/* Page Header */}
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                        Driver Workspace
                    </p>

                    <h1 className="mt-2 text-xl font-extrabold text-slate-800 sm:text-2xl lg:text-3xl">
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
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-50 sm:w-auto sm:py-2.5"
                >
                    <RefreshCw
                        className={`h-4 w-4 shrink-0 ${
                            loading ? "animate-spin" : ""
                        }`}
                    />
                    Refresh
                </button>
            </div>

            {/* Location Status */}
            {locationError && (
                <p className="break-words rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
                    {locationError}
                </p>
            )}

            {!locationError &&
                locationAccuracy !== null &&
                locationAccuracy > 1000 && (
                    <p className="break-words rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                        Weak GPS signal (accuracy about {locationAccuracy} m).
                        Your location may be approximate. For best results use
                        a phone with GPS.
                    </p>
                )}

            {/* Loading */}
            {loading && (
                <div className="rounded-2xl bg-white p-6 text-center sm:p-10">
                    <RefreshCw className="mx-auto h-7 w-7 animate-spin text-violet-600" />

                    <p className="mt-3 text-sm text-slate-500">
                        Loading active deliveries...
                    </p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="rounded-2xl border border-rose-200 bg-white p-5 text-center sm:p-6">
                    <p className="break-words text-sm text-rose-600">
                        {error}
                    </p>
                </div>
            )}

            {/* Active Shipments */}
            {!loading && !error && (
                <section className="min-w-0 rounded-2xl border border-violet-100 bg-white p-3 shadow-sm sm:p-5">

                    {/* Section Header */}
                    <div className="flex min-w-0 items-center justify-between gap-3">

                        <div className="min-w-0">
                            <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                                Your Active Shipments
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Shipments currently assigned to you.
                            </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1.5 text-sm font-bold text-violet-700">
                            {shipments.length}
                        </span>
                    </div>

                    {/* Empty State */}
                    {shipments.length === 0 ? (
                        <div className="py-10 text-center sm:py-12">
                            <Package className="mx-auto h-12 w-12 text-slate-300" />

                            <h3 className="mt-3 font-bold text-slate-700">
                                No active deliveries
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                                Your active shipments will appear here.
                            </p>
                        </div>
                    ) : (

                        <div className="mt-4 min-w-0 space-y-4 sm:mt-5">

                            {shipments.map((shipment) => (
                                <div
                                    key={shipment._id}
                                    className="min-w-0 rounded-xl border border-slate-100 p-3 sm:p-5"
                                >

                                    {/* Shipment Header */}
                                    <div className="flex min-w-0 items-center gap-3">

                                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700 sm:h-12 sm:w-12">
                                            <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="break-words text-sm font-bold text-slate-800 sm:text-base">
                                                Shipment #
                                                {shipment._id
                                                    .slice(-6)
                                                    .toUpperCase()}
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {shipment.goodsType}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pickup and Delivery Addresses */}
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

                                    {/* Live Delivery Map */}
                                    {shipment.pickupCoordinates?.lat != null &&
                                        shipment.pickupCoordinates?.lng != null &&
                                        shipment.deliveryCoordinates?.lat != null &&
                                        shipment.deliveryCoordinates?.lng != null && (

                                            <div className="mt-5 min-w-0">
                                                <h3 className="mb-3 text-sm font-semibold text-slate-800 sm:text-base">
                                                    Live Delivery Map
                                                </h3>

                                                <div className="w-full min-w-0 overflow-hidden rounded-xl">
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
                                                        shipmentStatus={shipment.status}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                    {/* Delivery Progress */}
                                    <div className="mt-5 min-w-0 overflow-hidden">
                                        <DeliveryProgress
                                            status={shipment.status}
                                        />
                                    </div>

                                    {/* Status and Action Buttons */}
                                    <div className="mt-4 flex min-w-0 flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                                        <span className="w-fit max-w-full break-words rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700">
                                            {shipment.status
                                                .replace("-", " ")
                                                .toUpperCase()}
                                        </span>

                                        {shipment.status === "assigned" && (
                                            <button
                                                disabled={
                                                    updatingShipmentId ===
                                                    shipment._id
                                                }
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        shipment._id,
                                                        "picked-up"
                                                    )
                                                }
                                                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 sm:w-auto sm:py-2.5"
                                            >
                                                {updatingShipmentId === shipment._id
                                                    ? "Updating..."
                                                    : "Mark as Picked Up"}
                                            </button>
                                        )}

                                        {shipment.status === "picked-up" && (
                                            <button
                                                disabled={
                                                    updatingShipmentId ===
                                                    shipment._id
                                                }
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        shipment._id,
                                                        "in-transit"
                                                    )
                                                }
                                                className="w-full rounded-xl bg-amber-500 px-4 py-3 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-50 sm:w-auto sm:py-2.5"
                                            >
                                                {updatingShipmentId === shipment._id
                                                    ? "Updating..."
                                                    : "Start Delivery"}
                                            </button>
                                        )}

                                        {shipment.status === "in-transit" && (
                                            <button
                                                disabled={
                                                    updatingShipmentId ===
                                                    shipment._id
                                                }
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        shipment._id,
                                                        "delivered"
                                                    )
                                                }
                                                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:w-auto sm:py-2.5"
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
