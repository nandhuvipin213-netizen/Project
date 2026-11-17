import CustomerTrackingMap from "../../components/customer/CustomerTrackingMap";
import { useEffect, useState } from "react";
import api from "../../services/Api";
import {
    MapPin,
    Flag,
    Package,
    Truck,
    Scale,
    Box,
    Calendar,
    Navigation,
    Clock,
    User,
    ArrowRight,
    Check,
    Loader2,
    Radio,
    Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CustomerShipment {
    _id: string;
    pickupAddress: string;
    deliveryAddress: string;
    status: string;
    createdAt: string;
    goodsType: string;
    weight: number;
    volume: number;
    pickupCoordinates?: {
        lat: number | null;
        lng: number | null;
    };

    deliveryCoordinates?: {
        lat: number | null;
        lng: number | null;
    };
}


interface TrackingLocation {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recordedAt: string;
}

interface ShipmentTrackingResponse {
    success: boolean;
    tracking: CustomerShipment & {
        assignedDriver?: {
            name: string;
            email: string;
        };
        assignedVehicle?: {
            registrationNumber: string;
            vehicleType: string;
        };
    };
    latestLocation: (TrackingLocation & {
        driver?: {
            name: string;
            email: string;
        };
        vehicle?: {
            registrationNumber: string;
            vehicleType: string;
        };
    }) | null;
}

const STEPS = ["assigned", "picked-up", "in-transit", "delivered"];
const STEP_LABELS = ["Assigned", "Picked up", "In transit", "Delivered"];

const STATUS_STYLES: Record<string, { chip: string; bar: string }> = {
    delivered: {
        chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        bar: "from-emerald-400 to-emerald-600",
    },
    cancelled: {
        chip: "bg-red-50 text-red-700 ring-red-200",
        bar: "from-red-400 to-red-600",
    },
    pending: {
        chip: "bg-amber-50 text-amber-700 ring-amber-200",
        bar: "from-amber-300 to-amber-500",
    },
    default: {
        chip: "bg-teal-50 text-teal-700 ring-teal-200",
        bar: "from-teal-400 to-blue-600",
    },
};

const styleFor = (status: string) => STATUS_STYLES[status] ?? STATUS_STYLES.default;
const labelFor = (status: string) => status.replace(/-/g, " ").toUpperCase();

function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-wider ring-1 ring-inset ${styleFor(status).chip}`}
        >
            {labelFor(status)}
        </span>
    );
}

function ProgressTrack({ status }: { status: string }) {
    const currentIndex = STEPS.indexOf(status);
    const fill = currentIndex <= 0 ? 0 : (currentIndex / (STEPS.length - 1)) * 100;

    return (
        <div className="relative">
            {/* base line and filled line, running between the first and last node centres */}
            <div className="absolute left-[12.5%] right-[12.5%] top-4 h-1 rounded-full bg-slate-100 sm:top-5">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-blue-600 transition-all duration-700"
                    style={{ width: `${fill}%` }}
                />
            </div>

            <div className="relative grid grid-cols-4">
                {STEPS.map((step, index) => {
                    const completed = currentIndex >= index;
                    const current = currentIndex === index;

                    return (
                        <div key={step} className="text-center">
                            <div
                                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ring-4 ring-white transition sm:h-11 sm:w-11 ${completed
                                        ? "bg-gradient-to-br from-teal-500 to-blue-600 text-white shadow-md shadow-blue-200"
                                        : "bg-slate-100 text-slate-400"
                                    } ${current ? "scale-110" : ""}`}
                            >
                                {completed ? <Check size={16} strokeWidth={3} /> : index + 1}
                            </div>
                            <p
                                className={`mt-2.5 text-[10px] font-semibold sm:text-xs ${completed ? "text-slate-800" : "text-slate-400"
                                    }`}
                            >
                                {STEP_LABELS[index]}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function Chip({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                </p>
                <p className="truncate text-sm font-semibold text-slate-800">{value}</p>
            </div>
        </div>
    );
}


const TrackShipment = () => {
    const navigate = useNavigate();
    const [shipments, setShipments] = useState<CustomerShipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const [trackingDetails, setTrackingDetails] =
        useState<ShipmentTrackingResponse | null>(null);

    useEffect(() => {
        const shipmentId = trackingDetails?.tracking?._id;

        if (!shipmentId) return;

        const interval = setInterval(() => {
            fetchTrackingDetails(shipmentId);
        }, 5000);

        return () => clearInterval(interval);
    }, [trackingDetails?.tracking?._id]);

    const [trackingLoading, setTrackingLoading] = useState(false);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [trackingError, setTrackingError] = useState("");


    useEffect(() => {
        const fetchShipments = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get<{
                    success: boolean;
                    count: number;
                    shipments: CustomerShipment[];
                }>("/shipments");

                setShipments(response.data.shipments);
            } catch (error: any) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load your shipments."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchShipments();
    }, []);

    const fetchTrackingDetails = async (shipmentId: string) => {
        try {
            const response = await api.get<ShipmentTrackingResponse>(
                `/shipments/${shipmentId}/tracking`
            );

            setTrackingDetails(response.data);
            setTrackingError("");
        } catch (error: any) {
            console.error("Failed to fetch tracking details:", error);
            setTrackingError(
                error.response?.data?.message || "Unable to load tracking details."
            );
        }
    };


    const handleTrackShipment = async (shipmentId: string) => {
        try {
            setTrackingLoading(true);
            setLoadingId(shipmentId);
            setTrackingError("");
            setTrackingDetails(null);

            await fetchTrackingDetails(shipmentId);
        } finally {
            setTrackingLoading(false);
            setLoadingId(null);
        }
    };

    // Closing the panel clears the details, which also stops the 5 second refresh
    const handleHideTracking = () => {
        setTrackingDetails(null);
        setTrackingError("");
    };

    // Only draw the map when every coordinate is available
    const renderTrackingMap = (details: ShipmentTrackingResponse) => {
        const loc = details.latestLocation;
        const pickupLat = details.tracking.pickupCoordinates?.lat;
        const pickupLng = details.tracking.pickupCoordinates?.lng;
        const deliveryLat = details.tracking.deliveryCoordinates?.lat;
        const deliveryLng = details.tracking.deliveryCoordinates?.lng;

        if (
            !loc ||
            pickupLat == null ||
            pickupLng == null ||
            deliveryLat == null ||
            deliveryLng == null
        ) {
            return (
                <p className="rounded-xl bg-white/5 p-4 text-sm text-slate-300">
                    Map is not available for this shipment yet.
                </p>
            );
        }

        return (
            <CustomerTrackingMap
                driverLatitude={loc.latitude}
                driverLongitude={loc.longitude}
                pickupLatitude={pickupLat}
                pickupLongitude={pickupLng}
                deliveryLatitude={deliveryLat}
                deliveryLongitude={deliveryLng}
            />
        );
    };

    const deliveredCount = shipments.filter((s) => s.status === "delivered").length;
    const activeCount = shipments.filter(
        (s) => s.status !== "delivered" && s.status !== "cancelled"
    ).length;

    return (
        <div>
            <div className="mx-auto max-w-6xl">

                <button
                    type="button"
                    onClick={() => navigate("/customer/dashboard")}
                    className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                >
                    <Home size={17} />
                    Back to Home
                </button>

                {/* Page header */}
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-600">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
                        </span>
                        Customer portal
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-[#142B4A] sm:text-4xl">
                        Track your shipments
                    </h1>

                    <p className="mt-2 max-w-xl text-sm text-slate-500">
                        Follow every delivery from pickup to doorstep, with live driver
                        location on the map.
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-xl">
                        {[
                            { label: "Total", value: shipments.length, tone: "text-[#142B4A]" },
                            { label: "In progress", value: activeCount, tone: "text-teal-600" },
                            { label: "Delivered", value: deliveredCount, tone: "text-emerald-600" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                            >
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    {stat.label}
                                </p>
                                <p className={`mt-1 text-2xl font-extrabold ${stat.tone}`}>
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* States */}
                {loading ? (
                    <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center shadow-sm">
                        <Loader2 className="mx-auto mb-4 h-9 w-9 animate-spin text-teal-600" />
                        <p className="font-medium text-slate-500">Loading your shipments...</p>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
                        {error}
                    </div>
                ) : shipments.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-50 text-teal-600">
                            <Package size={36} />
                        </div>
                        <h2 className="text-xl font-bold text-[#142B4A]">No shipments yet</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            You haven't created any shipments yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">

                        {shipments.map((shipment) => {
                            const isOpen = trackingDetails?.tracking._id === shipment._id;
                            const isLoading = loadingId === shipment._id;

                            return (
                                <article
                                    key={shipment._id}
                                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-lg"
                                >
                                    {/* Status accent bar */}
                                    <div className={`h-1.5 bg-gradient-to-r ${styleFor(shipment.status).bar}`} />

                                    <div className="p-4 sm:p-7">
                                        {/* Header */}
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                                    Shipment
                                                </p>
                                                <h2 className="mt-0.5 font-mono text-xl font-extrabold tracking-tight text-[#142B4A]">
                                                    #{shipment._id.slice(-6).toUpperCase()}
                                                </h2>
                                            </div>
                                            <StatusBadge status={shipment.status} />
                                        </div>

                                        {/* Route ticket */}
                                        <div className="mt-6 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
                                            <div className="rounded-2xl bg-slate-50 p-4">
                                                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                                    <MapPin size={14} />
                                                    Pickup
                                                </p>
                                                <p className="mt-2 font-semibold leading-snug text-[#142B4A] [overflow-wrap:anywhere]">
                                                    {shipment.pickupAddress}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-center text-slate-300">
                                                <ArrowRight size={22} className="hidden md:block" />
                                                <ArrowRight size={22} className="rotate-90 md:hidden" />
                                            </div>

                                            <div className="rounded-2xl bg-slate-50 p-4">
                                                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-teal-600">
                                                    <Flag size={14} />
                                                    Delivery
                                                </p>
                                                <p className="mt-2 font-semibold leading-snug text-[#142B4A] [overflow-wrap:anywhere]">
                                                    {shipment.deliveryAddress}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="mt-8 rounded-2xl border border-slate-100 px-3 py-6 sm:px-6">
                                            <ProgressTrack status={shipment.status} />
                                        </div>

                                        {/* Goods details */}
                                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                            <Chip
                                                icon={<Package size={18} />}
                                                label="Goods"
                                                value={shipment.goodsType}
                                            />
                                            <Chip
                                                icon={<Scale size={18} />}
                                                label="Weight"
                                                value={`${shipment.weight} kg`}
                                            />
                                            <Chip
                                                icon={<Box size={18} />}
                                                label="Volume"
                                                value={`${shipment.volume} m³`}
                                            />
                                            <Chip
                                                icon={<Calendar size={18} />}
                                                label="Booked on"
                                                value={new Date(shipment.createdAt).toLocaleDateString()}
                                            />
                                        </div>

                                        {/* Track button */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                isOpen
                                                    ? handleHideTracking()
                                                    : handleTrackShipment(shipment._id)
                                            }
                                            disabled={trackingLoading}
                                            className={`mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-sm font-bold transition duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${isOpen
                                                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                    : "bg-[#142B4A] text-white shadow-lg shadow-blue-950/10 hover:bg-teal-600"
                                                }`}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Loading tracking...
                                                </>
                                            ) : isOpen ? (
                                                "Hide live tracking"
                                            ) : (
                                                <>
                                                    <Navigation size={18} />
                                                    View live tracking
                                                </>
                                            )}
                                        </button>

                                        {trackingError && !isOpen && (
                                            <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                                                {trackingError}
                                            </p>
                                        )}

                                        {/* Live tracking panel */}
                                        {trackingDetails && isOpen && (
                                            <div className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#142B4A] to-slate-900 p-5 text-white sm:p-7">
                                                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
                                                            <Truck size={22} />
                                                        </span>
                                                        <div>
                                                            <h3 className="font-bold">Live tracking</h3>
                                                            <p className="text-xs text-slate-400">
                                                                Refreshes every 5 seconds
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1.5 text-[11px] font-bold tracking-wider text-emerald-300">
                                                        <Radio size={13} className="animate-pulse" />
                                                        LIVE
                                                    </span>
                                                </div>

                                                {trackingError && (
                                                    <p className="mb-4 rounded-xl bg-red-500/15 p-3 text-sm text-red-300">
                                                        {trackingError}
                                                    </p>
                                                )}

                                                <div className="grid gap-3 sm:grid-cols-3">
                                                    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                            Status
                                                        </p>
                                                        <p className="mt-1.5 font-semibold capitalize">
                                                            {trackingDetails.tracking.status.replace(/-/g, " ")}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                                                        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                            <User size={12} />
                                                            Driver
                                                        </p>
                                                        <p className="mt-1.5 font-semibold">
                                                            {trackingDetails.tracking.assignedDriver?.name || "Not assigned"}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                                                        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                            <Truck size={12} />
                                                            Vehicle
                                                        </p>
                                                        <p className="mt-1.5 font-semibold">
                                                            {trackingDetails.tracking.assignedVehicle?.registrationNumber || "Not assigned"}
                                                        </p>
                                                        {trackingDetails.tracking.assignedVehicle?.vehicleType && (
                                                            <p className="text-xs capitalize text-slate-400">
                                                                {trackingDetails.tracking.assignedVehicle.vehicleType}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {trackingDetails.latestLocation ? (
                                                    <div className="mt-5">
                                                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                                                            <span className="font-mono">
                                                                {trackingDetails.latestLocation.latitude.toFixed(5)},{" "}
                                                                {trackingDetails.latestLocation.longitude.toFixed(5)}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1.5">
                                                                <Clock size={12} />
                                                                Updated{" "}
                                                                {new Date(
                                                                    trackingDetails.latestLocation.recordedAt
                                                                ).toLocaleString()}
                                                            </span>
                                                        </div>

                                                        <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                                                            {renderTrackingMap(trackingDetails)}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="mt-5 rounded-2xl bg-white/5 p-4 text-sm text-slate-300 ring-1 ring-white/10">
                                                        Driver location is not available yet.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackShipment;