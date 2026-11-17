
import { useEffect, useMemo, useState } from "react";
import ShipmentMap from "../../components/driver/ShipmentMap";
import axios from "axios";
import {
    Search,
    Package,
    MapPin,
    Weight,
    Truck,
    CalendarDays,
    Eye,
    RefreshCw,
    X,
    UserRound,
    Mail,
    Phone,
    Box,
    AlertTriangle,
} from "lucide-react";
import api from "../../services/Api";

interface Customer {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
}

interface AssignedVehicle {
    _id: string;
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
    volumeCapacity: number;
    status: string;
}

interface Coordinates {
    lat: number | null;
    lng: number | null;
}

interface Shipment {
    _id: string;
    customer?: Customer | null;
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
    assignedVehicle?: AssignedVehicle | null;
}

interface ShipmentsResponse {
    success: boolean;
    count: number;
    shipments: Shipment[];
}

const statusStyles: Record<string, string> = {
    pending: "bg-slate-100 text-slate-700",
    assigned: "bg-violet-100 text-violet-700",
    "picked-up": "bg-blue-100 text-blue-700",
    "in-transit": "bg-amber-100 text-amber-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700",
};

const formatStatus = (status: string) =>
    status.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (date: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

function MyShipments() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const handleStatusUpdate = async (shipmentId: string, newStatus: string) => {
        try {
            setUpdatingStatus(true);

            const response = await api.put(
                `/shipments/driver/${shipmentId}/status`,
                { status: newStatus }
            );

            if (response.data.success) {
                setShipments((prev) =>
                    prev.map((shipment) =>
                        shipment._id === shipmentId
                            ? { ...shipment, status: newStatus }
                            : shipment
                    )
                );

                setSelectedShipment((prev) =>
                    prev?._id === shipmentId
                        ? { ...prev, status: newStatus }
                        : prev
                );
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(
                    error.response?.data?.message ||
                    "Failed to update shipment status"
                );
            } else {
                alert("Something went wrong while updating shipment status.");
            }
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Fetch shipments assigned to the logged-in driver
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
                    setShipments(response.data.shipments || []);
                }
            } catch (error: unknown) {
                if (isMounted) {
                    if (axios.isAxiosError(error)) {
                        setError(
                            error.response?.data?.message ||
                            "Unable to load your shipments."
                        );
                    } else {
                        setError("Something went wrong while loading shipments.");
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

    // Shipment summary counts
    const pendingCount = shipments.filter(
        (shipment) => shipment.status === "assigned"
    ).length;

    const activeCount = shipments.filter((shipment) =>
        ["picked-up", "in-transit"].includes(shipment.status)
    ).length;

    const completedCount = shipments.filter(
        (shipment) => shipment.status === "delivered"
    ).length;

    // Search and status filtering
    const filteredShipments = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return shipments.filter((shipment) => {
            const matchesStatus =
                statusFilter === "all" || shipment.status === statusFilter;

            const matchesSearch =
                !searchValue ||
                shipment._id.toLowerCase().includes(searchValue) ||
                shipment.customer?.name?.toLowerCase().includes(searchValue) ||
                shipment.pickupAddress.toLowerCase().includes(searchValue) ||
                shipment.deliveryAddress.toLowerCase().includes(searchValue) ||
                shipment.goodsType.toLowerCase().includes(searchValue);

            return matchesStatus && matchesSearch;
        });
    }, [shipments, search, statusFilter]);

    return (
        <div className="w-full min-w-0 space-y-5 sm:space-y-6">

            {/* Page Heading */}
            <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
                        Driver Workspace
                    </p>

                    <h1 className="mt-2 text-xl font-extrabold text-slate-800 sm:text-2xl lg:text-3xl">
                        My Shipments
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        View and manage all shipments assigned to you.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setRefreshKey((previous) => previous + 1)}
                    disabled={loading}
                    className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-50 sm:w-fit"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
                {[
                    {
                        title: "All Shipments",
                        count: shipments.length,
                        description: "Assigned to your account",
                        icon: Package,
                        color: "bg-violet-100 text-violet-700",
                    },
                    {
                        title: "Pending Pickups",
                        count: pendingCount,
                        description: "Waiting for pickup",
                        icon: CalendarDays,
                        color: "bg-amber-100 text-amber-700",
                    },
                    {
                        title: "Active Deliveries",
                        count: activeCount,
                        description: "Picked up or in transit",
                        icon: Truck,
                        color: "bg-blue-100 text-blue-700",
                    },
                    {
                        title: "Completed",
                        count: completedCount,
                        description: "Successfully delivered",
                        icon: Package,
                        color: "bg-emerald-100 text-emerald-700",
                    },
                ].map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="min-w-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-5"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 sm:text-sm">
                                        {item.title}
                                    </p>
                                    <h2 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">
                                        {item.count}
                                    </h2>
                                </div>

                                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl sm:h-12 sm:w-12 ${item.color}`}>
                                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                            </div>

                            <p className="mt-3 text-xs text-slate-400">
                                {item.description}
                            </p>
                        </div>
                    );
                })}
            </section>

            {/* Search and Filters */}
            <section className="min-w-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                        <h2 className="text-base font-bold text-slate-800">
                            Shipment List
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Search and filter your assigned shipments.
                        </p>
                    </div>

                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
                        <div className="relative min-w-0 flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search shipment, customer..."
                                className="w-full min-w-0 rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 sm:w-auto"
                        >
                            <option value="all">All Statuses</option>
                            <option value="assigned">Assigned</option>
                            <option value="picked-up">Picked Up</option>
                            <option value="in-transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Loading */}
            {loading && (
                <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-violet-100 bg-white">
                    <RefreshCw className="h-7 w-7 animate-spin text-violet-600" />
                    <p className="text-sm text-slate-500">
                        Loading shipments...
                    </p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="rounded-2xl border border-rose-200 bg-white p-5 text-center sm:p-8">
                    <p className="break-words text-sm font-semibold text-rose-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => setRefreshKey((previous) => previous + 1)}
                        className="mt-4 w-full rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 sm:w-auto"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Shipment Cards */}
            {!loading && !error && (
                <section className="min-w-0 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-600 sm:text-sm">
                            Showing {filteredShipments.length} of {shipments.length} shipments
                        </p>
                    </div>

                    {filteredShipments.length === 0 ? (
                        <div className="rounded-2xl border border-violet-100 bg-white px-4 py-10 text-center shadow-sm sm:px-5 sm:py-12">
                            <Package className="mx-auto h-12 w-12 text-slate-300" />
                            <h3 className="mt-4 font-bold text-slate-700">
                                No shipments found
                            </h3>
                            <p className="mt-2 text-sm text-slate-400">
                                Try changing your search or status filter.
                            </p>
                        </div>
                    ) : (
                        filteredShipments.map((shipment) => (
                            <div
                                key={shipment._id}
                                className="min-w-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md sm:p-6"
                            >
                                {/* Shipment Header */}
                                <div className="flex min-w-0 flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700 sm:h-11 sm:w-11">
                                            <Package className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="break-words text-sm font-bold text-slate-800 sm:text-base">
                                                Shipment #{shipment._id.slice(-6).toUpperCase()}
                                            </h3>
                                            <p className="mt-1 break-words text-xs text-slate-500">
                                                Customer: {shipment.customer?.name || "Not available"}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[shipment.status] || "bg-slate-100 text-slate-600"}`}
                                    >
                                        {formatStatus(shipment.status)}
                                    </span>
                                </div>

                                {/* Pickup and Delivery */}
                                <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 sm:gap-4">
                                    <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3 sm:p-4">
                                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Pickup Location
                                            </p>
                                            <p className="mt-1 break-words text-sm font-semibold text-slate-700 [overflow-wrap:anywhere]">
                                                {shipment.pickupAddress}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3 sm:p-4">
                                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Delivery Location
                                            </p>
                                            <p className="mt-1 break-words text-sm font-semibold text-slate-700 [overflow-wrap:anywhere]">
                                                {shipment.deliveryAddress}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipment Information */}
                                <div className="mt-4 flex min-w-0 flex-wrap items-center gap-x-5 gap-y-3 border-t border-slate-100 pt-4 sm:gap-x-6">
                                    <div className="min-w-0">
                                        <p className="text-[10px] uppercase text-slate-400">
                                            Goods Type
                                        </p>
                                        <p className="mt-1 break-words text-xs font-semibold text-slate-700">
                                            {shipment.goodsType}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] uppercase text-slate-400">
                                            Weight
                                        </p>
                                        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-700">
                                            <Weight className="h-3.5 w-3.5" />
                                            {shipment.weight} kg
                                        </p>
                                    </div>

                                    {shipment.volume !== undefined && (
                                        <div>
                                            <p className="text-[10px] uppercase text-slate-400">
                                                Volume
                                            </p>
                                            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-700">
                                                <Box className="h-3.5 w-3.5" />
                                                {shipment.volume} m³
                                            </p>
                                        </div>
                                    )}

                                    {shipment.isFragile && (
                                        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold text-amber-700">
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                            Fragile Goods
                                        </span>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="mt-5 flex min-w-0 flex-col justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
                                    <p className="text-xs text-slate-400">
                                        Created: {formatDate(shipment.createdAt)}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedShipment(shipment)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700 sm:w-fit"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            )}

            {/* Shipment Details Modal */}
            {selectedShipment && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-2 sm:p-4"
                    onClick={() => setSelectedShipment(null)}
                >
                    <div
                        className="my-auto flex max-h-[95dvh] w-full min-w-0 max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[90vh]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white p-4 sm:p-5">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                                    Shipment Details
                                </p>
                                <h2 className="mt-1 break-words text-base font-bold text-slate-800 sm:text-lg">
                                    #{selectedShipment._id.slice(-6).toUpperCase()}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedShipment(null)}
                                aria-label="Close details"
                                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="min-w-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
                            {/* Current Status */}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="text-sm font-semibold text-slate-600">
                                    Current Status
                                </span>

                                <span
                                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[selectedShipment.status] || "bg-slate-100 text-slate-600"}`}
                                >
                                    {formatStatus(selectedShipment.status)}
                                </span>
                            </div>

                            {/* Customer Details */}
                            <div className="min-w-0 rounded-xl bg-slate-50 p-3 sm:p-4">
                                <h3 className="mb-3 text-sm font-bold text-slate-800">
                                    Customer Information
                                </h3>

                                <div className="min-w-0 space-y-3 text-sm">
                                    <p className="flex min-w-0 items-start gap-2 text-slate-600">
                                        <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                                        <span className="min-w-0 break-words">
                                            {selectedShipment.customer?.name || "Not available"}
                                        </span>
                                    </p>

                                    <p className="flex min-w-0 items-start gap-2 text-slate-600">
                                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                                        <span className="min-w-0 break-all">
                                            {selectedShipment.customer?.email || "Not available"}
                                        </span>
                                    </p>

                                    <p className="flex min-w-0 items-start gap-2 text-slate-600">
                                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                                        <span className="min-w-0 break-words">
                                            {selectedShipment.customer?.phone || "Not available"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Locations */}
                            <div className="min-w-0">
                                <h3 className="mb-3 text-sm font-bold text-slate-800">
                                    Shipment Route
                                </h3>

                                <div className="min-w-0 space-y-3">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-slate-400">
                                                PICKUP
                                            </p>
                                            <p className="mt-1 break-words text-sm text-slate-700 [overflow-wrap:anywhere]">
                                                {selectedShipment.pickupAddress}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-2 h-5 border-l-2 border-dashed border-slate-300" />

                                    <div className="flex min-w-0 items-start gap-3">
                                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-slate-400">
                                                DELIVERY
                                            </p>
                                            <p className="mt-1 break-words text-sm text-slate-700 [overflow-wrap:anywhere]">
                                                {selectedShipment.deliveryAddress}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipment Map */}
                            <div className="min-w-0">
                                <h3 className="mb-3 text-sm font-bold text-slate-800">
                                    Location Map
                                </h3>

                                {selectedShipment.pickupCoordinates &&
                                    selectedShipment.deliveryCoordinates &&
                                    typeof selectedShipment.pickupCoordinates.lat === "number" &&
                                    typeof selectedShipment.pickupCoordinates.lng === "number" &&
                                    typeof selectedShipment.deliveryCoordinates.lat === "number" &&
                                    typeof selectedShipment.deliveryCoordinates.lng === "number" ? (
                                    <div className="w-full min-w-0 overflow-hidden rounded-xl">
                                        <ShipmentMap
                                            pickupCoordinates={{
                                                lat: selectedShipment.pickupCoordinates.lat,
                                                lng: selectedShipment.pickupCoordinates.lng,
                                            }}
                                            deliveryCoordinates={{
                                                lat: selectedShipment.deliveryCoordinates.lat,
                                                lng: selectedShipment.deliveryCoordinates.lng,
                                            }}
                                            shipmentStatus={selectedShipment.status}
                                        />
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center sm:p-6">
                                        <MapPin className="mx-auto h-8 w-8 text-slate-400" />
                                        <p className="mt-2 text-sm font-semibold text-slate-600">
                                            Map coordinates not available
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Location information is not available for this shipment.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Goods Details */}
                            <div className="min-w-0 rounded-xl bg-slate-50 p-3 sm:p-4">
                                <h3 className="mb-3 text-sm font-bold text-slate-800">
                                    Goods Information
                                </h3>

                                <div className="grid min-w-0 grid-cols-1 gap-4 min-[380px]:grid-cols-2">
                                    <div className="min-w-0">
                                        <p className="text-xs text-slate-400">Goods Type</p>
                                        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
                                            {selectedShipment.goodsType}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">Weight</p>
                                        <p className="mt-1 text-sm font-semibold text-slate-700">
                                            {selectedShipment.weight} kg
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">Volume</p>
                                        <p className="mt-1 text-sm font-semibold text-slate-700">
                                            {selectedShipment.volume ?? "Not available"}
                                            {selectedShipment.volume !== undefined ? " m³" : ""}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">Fragile</p>
                                        <p className="mt-1 text-sm font-semibold text-slate-700">
                                            {selectedShipment.isFragile ? "Yes" : "No"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Details */}
                            <div className="min-w-0 rounded-xl border border-violet-100 p-3 sm:p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <Truck className="h-5 w-5 shrink-0 text-violet-600" />
                                    <h3 className="text-sm font-bold text-slate-800">
                                        Assigned Vehicle
                                    </h3>
                                </div>

                                {selectedShipment.assignedVehicle ? (
                                    <div className="grid min-w-0 grid-cols-1 gap-4 min-[380px]:grid-cols-2">
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-400">
                                                Registration Number
                                            </p>
                                            <p className="mt-1 break-words text-sm font-bold text-slate-800">
                                                {selectedShipment.assignedVehicle.registrationNumber}
                                            </p>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-400">
                                                Vehicle Type
                                            </p>
                                            <p className="mt-1 break-words text-sm font-semibold capitalize text-slate-700">
                                                {selectedShipment.assignedVehicle.vehicleType}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        Vehicle information is not available.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="shrink-0 border-t border-slate-100 bg-white p-3 sm:p-5">
                            <div className="flex flex-col-reverse gap-2 sm:flex-row">
                                {selectedShipment.status === "assigned" && (
                                    <button
                                        type="button"
                                        disabled={updatingStatus}
                                        onClick={() =>
                                            handleStatusUpdate(selectedShipment._id, "picked-up")
                                        }
                                        className="w-full flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {updatingStatus ? "Updating..." : "Mark as Picked Up"}
                                    </button>
                                )}

                                {selectedShipment.status === "picked-up" && (
                                    <button
                                        type="button"
                                        disabled={updatingStatus}
                                        onClick={() =>
                                            handleStatusUpdate(selectedShipment._id, "in-transit")
                                        }
                                        className="w-full flex-1 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-50"
                                    >
                                        {updatingStatus ? "Updating..." : "Start Delivery"}
                                    </button>
                                )}

                                {selectedShipment.status === "in-transit" && (
                                    <button
                                        type="button"
                                        disabled={updatingStatus}
                                        onClick={() =>
                                            handleStatusUpdate(selectedShipment._id, "delivered")
                                        }
                                        className="w-full flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {updatingStatus ? "Updating..." : "Mark as Delivered"}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setSelectedShipment(null)}
                                    className="w-full flex-1 rounded-xl bg-violet-600 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyShipments;
