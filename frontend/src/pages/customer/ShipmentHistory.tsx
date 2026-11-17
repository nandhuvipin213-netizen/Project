import { useEffect, useState } from "react";
import {
    Package,
    MapPin,
    Flag,
    IndianRupee,
    Truck,
    User,
    Receipt,
    X,
    ArrowRight,
    Clock,
    Download,
    Scale,
    Boxes,
    Route,
    Loader2,
    Home
} from "lucide-react";
import api from "../../services/Api";
import { useNavigate } from "react-router-dom";

interface Shipment {
    _id: string;
    pickupAddress: string;
    deliveryAddress: string;
    goodsType: string;
    goodsDescription?: string;
    packageCount?: number;
    weight?: number | null;
    status: string;
    pickupDate: string;
    pickupTime: string;
    distanceKm?: number;
    advanceAmount?: number | null;
    advancePaymentStatus: string;
    advancePaymentId?: string | null;
    advancePaidAt?: string | null;
    createdAt: string;

    assignedDriver?: {
        name: string;
        email: string;
    } | null;

    assignedVehicle?: {
        registrationNumber: string;
        vehicleType: string;
    } | null;
}

type Filter = "all" | "active" | "delivered" | "unpaid";

const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "In progress" },
    { key: "delivered", label: "Delivered" },
    { key: "unpaid", label: "Payment due" },
];

const STATUS_CHIP: Record<string, string> = {
    delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cancelled: "bg-red-50 text-red-700 ring-red-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    default: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

const statusChip = (status: string) => STATUS_CHIP[status] ?? STATUS_CHIP.default;
const statusLabel = (status: string) => status.replace(/-/g, " ");
const isPaid = (s: Shipment) => s.advancePaymentStatus === "paid";
const isActive = (s: Shipment) => s.status !== "delivered" && s.status !== "cancelled";
const money = (v: unknown) => `₹${Number(v ?? 0).toFixed(2)}`;

// Escape text before it is written into the receipt page
const escapeHtml = (value: unknown) =>
    String(value ?? "").replace(/[&<>"']/g, (c) =>
        (
            {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            } as Record<string, string>
        )[c]
    );

function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold capitalize tracking-wide ring-1 ring-inset ${statusChip(status)}`}
        >
            {statusLabel(status)}
        </span>
    );
}

function PaymentBadge({ paid }: { paid: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ring-1 ring-inset ${
                paid
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-amber-50 text-amber-700 ring-amber-200"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${paid ? "bg-emerald-500" : "bg-amber-500"}`}
            />
            {paid ? "Advance paid" : "Payment due"}
        </span>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {title}
            </h3>
            <div className="space-y-3">{children}</div>
        </section>
    );
}

function Detail({
    icon,
    label,
    children,
}: {
    icon?: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start justify-between gap-4 text-sm">
            <span className="flex shrink-0 items-center gap-2 text-slate-500">
                {icon}
                {label}
            </span>
            <span className="text-right font-semibold text-slate-800 [overflow-wrap:anywhere]">
                {children}
            </span>
        </div>
    );
}

function ShipmentHistory() {
    const navigate = useNavigate();
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState<Filter>("all");
    const [selectedShipment, setSelectedShipment] =
        useState<Shipment | null>(null);

    const handleDownloadReceipt = (shipment: Shipment) => {
        const receiptWindow = window.open("", "_blank");

        if (!receiptWindow) {
            alert("Please allow pop-ups to download the receipt.");
            return;
        }

        const receiptHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Payment Receipt</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #333;
                }
                .receipt {
                    max-width: 650px;
                    margin: auto;
                    border: 1px solid #ddd;
                    padding: 30px;
                    border-radius: 10px;
                }
                h1 { color: #4f46e5; }
                @media (max-width: 600px) { body { padding: 16px; } .receipt { padding: 16px; } .row { flex-direction: column; gap: 4px; } }
                .row {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #eee;
                }
                .amount {
                    font-size: 22px;
                    font-weight: bold;
                    color: #16a34a;
                }
                @media print {
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="receipt">
                <h1>Smart Logistics</h1>
                <h2>Advance Payment Receipt</h2>

                <div class="row">
                    <span>Shipment ID</span>
                    <strong>${escapeHtml(shipment._id)}</strong>
                </div>
                <div class="row">
                    <span>Pickup</span>
                    <strong>${escapeHtml(shipment.pickupAddress)}</strong>
                </div>
                <div class="row">
                    <span>Delivery</span>
                    <strong>${escapeHtml(shipment.deliveryAddress)}</strong>
                </div>
                <div class="row">
                    <span>Payment ID</span>
                    <strong>${escapeHtml(shipment.advancePaymentId || "N/A")}</strong>
                </div>
                <div class="row">
                    <span>Payment Date</span>
                    <strong>
                        ${shipment.advancePaidAt
                ? new Date(shipment.advancePaidAt).toLocaleString()
                : "N/A"}
                    </strong>
                </div>
                <div class="row">
                    <span>Payment Status</span>
                    <strong>PAID</strong>
                </div>
                <p class="amount">
                    Advance Paid: ₹${Number(shipment.advanceAmount ?? 0).toFixed(2)}
                </p>

                <p>Thank you for choosing Smart Logistics!</p>
                <button onclick="window.print()">Download / Save as PDF</button>
            </div>
        </body>
        </html>
    `;

        receiptWindow.document.write(receiptHtml);
        receiptWindow.document.close();
    };

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const response = await api.get("/shipments");

                setShipments(response.data.shipments);
            } catch (error) {
                console.error("Shipment history error:", error);
                setError("Failed to load shipment history");
            } finally {
                setLoading(false);
            }
        };

        fetchShipments();
    }, []);

    // Close the details panel with the Escape key
    useEffect(() => {
        if (!selectedShipment) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedShipment(null);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [selectedShipment]);

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center shadow-sm">
                <Loader2 className="mx-auto mb-4 h-9 w-9 animate-spin text-indigo-600" />
                <p className="font-medium text-slate-500">Loading shipment history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
                {error}
            </div>
        );
    }

    const paidShipments = shipments.filter(isPaid);
    const totalAdvancePaid = paidShipments.reduce(
        (sum, s) => sum + Number(s.advanceAmount ?? 0),
        0
    );

    const visibleShipments = shipments.filter((s) => {
        if (filter === "active") return isActive(s);
        if (filter === "delivered") return s.status === "delivered";
        if (filter === "unpaid") return !isPaid(s);
        return true;
    });

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


                {/* Header */}
                <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                        Customer portal
                    </p>
                    <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#20213a] sm:text-4xl">
                        Shipment history
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Every booking you have made, with payment and delivery details.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Total shipments
                            </p>
                            <p className="mt-1 text-3xl font-extrabold text-[#20213a]">
                                {shipments.length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Advances paid
                            </p>
                            <p className="mt-1 text-3xl font-extrabold text-emerald-600">
                                {paidShipments.length}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4 text-white shadow-md">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200">
                                Total advance paid
                            </p>
                            <p className="mt-1 flex items-center text-3xl font-extrabold">
                                <IndianRupee size={24} />
                                {totalAdvancePaid.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {shipments.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
                            <Package size={36} />
                        </div>
                        <h2 className="text-xl font-bold text-[#20213a]">
                            No shipments found
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Your shipment bookings will appear here.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Filter tabs */}
                        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.key}
                                    type="button"
                                    onClick={() => setFilter(f.key)}
                                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        filter === f.key
                                            ? "bg-[#20213a] text-white shadow"
                                            : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        {visibleShipments.length === 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500 shadow-sm">
                                No shipments match this filter.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {visibleShipments.map((shipment) => {
                                    const pickup = new Date(shipment.pickupDate);

                                    return (
                                        <article
                                            key={shipment._id}
                                            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-lg"
                                        >
                                            <div className="flex flex-col md:flex-row">
                                                {/* Date block */}
                                                <div className="flex items-center gap-4 bg-[#20213a] px-5 py-4 text-white md:w-32 md:flex-col md:justify-center md:gap-0 md:px-4 md:py-6 md:text-center">
                                                    <p className="text-4xl font-extrabold leading-none">
                                                        {pickup.getDate()}
                                                    </p>
                                                    <div className="md:mt-1">
                                                        <p className="text-sm font-bold uppercase tracking-wider text-indigo-200">
                                                            {pickup.toLocaleString("en-IN", { month: "short" })}
                                                        </p>
                                                        <p className="text-xs text-slate-400">
                                                            {pickup.getFullYear()}
                                                        </p>
                                                    </div>
                                                    <p className="ml-auto flex items-center gap-1.5 text-xs text-slate-300 md:ml-0 md:mt-3">
                                                        <Clock size={12} />
                                                        {shipment.pickupTime}
                                                    </p>
                                                </div>

                                                {/* Body */}
                                                <div className="flex-1 p-4 sm:p-6">
                                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <Package size={18} className="text-indigo-600" />
                                                            <span className="font-mono text-lg font-extrabold text-[#20213a]">
                                                                #{shipment._id.slice(-8).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <StatusBadge status={shipment.status} />
                                                    </div>

                                                    <div className="mt-4 grid items-center gap-2 lg:grid-cols-[1fr_auto_1fr]">
                                                        <p className="flex items-start gap-2 text-sm font-medium text-slate-700 [overflow-wrap:anywhere]">
                                                            <MapPin size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                                                            {shipment.pickupAddress}
                                                        </p>
                                                        <ArrowRight
                                                            size={18}
                                                            className="hidden text-slate-300 lg:block"
                                                        />
                                                        <p className="flex items-start gap-2 text-sm font-medium text-slate-700 [overflow-wrap:anywhere]">
                                                            <Flag size={16} className="mt-0.5 shrink-0 text-rose-500" />
                                                            {shipment.deliveryAddress}
                                                        </p>
                                                    </div>

                                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                                {shipment.goodsType}
                                                            </span>
                                                            <PaymentBadge paid={isPaid(shipment)} />
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right">
                                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                                    Advance
                                                                </p>
                                                                <p className="text-lg font-extrabold text-[#20213a]">
                                                                    {money(shipment.advanceAmount)}
                                                                </p>
                                                            </div>

                                                            <button
                                                                onClick={() => setSelectedShipment(shipment)}
                                                                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                                                            >
                                                                View details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Details panel */}
            {selectedShipment && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-stretch sm:justify-end"
                    onClick={() => setSelectedShipment(null)}
                >
                    <div
                        className="flex h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-full sm:rounded-none sm:rounded-l-3xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Panel header */}
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                                    Shipment details
                                </p>
                                <h2 className="mt-1 font-mono text-xl font-extrabold text-[#20213a]">
                                    #{selectedShipment._id.slice(-8).toUpperCase()}
                                </h2>
                                <p className="mt-1 break-all text-[11px] text-slate-400">
                                    {selectedShipment._id}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <StatusBadge status={selectedShipment.status} />
                                    <PaymentBadge paid={isPaid(selectedShipment)} />
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedShipment(null)}
                                aria-label="Close details"
                                className="shrink-0 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Panel body */}
                        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
                            {/* Route */}
                            <section className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                        Route
                                    </h3>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                                        <Route size={13} />
                                        {Number(selectedShipment.distanceKm ?? 0).toFixed(2)} km
                                    </span>
                                </div>

                                <div className="relative space-y-6 pl-9">
                                    <div className="absolute bottom-5 left-[13px] top-5 border-l-2 border-dashed border-slate-300" />

                                    <div className="relative">
                                        <span className="absolute -left-9 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-slate-50">
                                            <MapPin size={14} />
                                        </span>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                            Pickup
                                        </p>
                                        <p className="mt-0.5 text-sm font-semibold text-slate-800 [overflow-wrap:anywhere]">
                                            {selectedShipment.pickupAddress}
                                        </p>
                                    </div>

                                    <div className="relative">
                                        <span className="absolute -left-9 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600 ring-4 ring-slate-50">
                                            <Flag size={14} />
                                        </span>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                                            Delivery
                                        </p>
                                        <p className="mt-0.5 text-sm font-semibold text-slate-800 [overflow-wrap:anywhere]">
                                            {selectedShipment.deliveryAddress}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <Section title="Schedule">
                                <Detail icon={<Clock size={15} />} label="Pickup">
                                    {new Date(selectedShipment.pickupDate).toLocaleDateString("en-IN")}
                                    {" at "}
                                    {selectedShipment.pickupTime}
                                </Detail>
                            </Section>

                            <Section title="Cargo">
                                <Detail icon={<Package size={15} />} label="Goods type">
                                    {selectedShipment.goodsType}
                                </Detail>
                                <Detail label="Description">
                                    {selectedShipment.goodsDescription || "Not provided"}
                                </Detail>
                                <Detail icon={<Boxes size={15} />} label="Packages">
                                    {selectedShipment.packageCount ?? "Not available"}
                                </Detail>
                                <Detail icon={<Scale size={15} />} label="Actual weight">
                                    {selectedShipment.weight != null
                                        ? `${selectedShipment.weight} kg`
                                        : "Not provided"}
                                </Detail>
                            </Section>

                            <Section title="Payment">
                                <Detail icon={<IndianRupee size={15} />} label="Advance amount">
                                    {money(selectedShipment.advanceAmount)}
                                </Detail>
                                <Detail icon={<Receipt size={15} />} label="Paid on">
                                    {selectedShipment.advancePaidAt
                                        ? new Date(selectedShipment.advancePaidAt).toLocaleString("en-IN")
                                        : "Not paid"}
                                </Detail>
                            </Section>

                            <Section title="Assignment">
                                <Detail icon={<User size={15} />} label="Driver">
                                    {selectedShipment.assignedDriver?.name || "Not assigned"}
                                </Detail>
                                <Detail icon={<Truck size={15} />} label="Vehicle">
                                    {selectedShipment.assignedVehicle ? (
                                        <>
                                            {selectedShipment.assignedVehicle.registrationNumber}
                                            <span className="block text-xs font-medium capitalize text-slate-400">
                                                {selectedShipment.assignedVehicle.vehicleType}
                                            </span>
                                        </>
                                    ) : (
                                        "Not assigned"
                                    )}
                                </Detail>
                            </Section>
                        </div>

                        {/* Panel footer */}
                        <div className="space-y-3 border-t border-slate-100 p-5 sm:p-6">
                            {isPaid(selectedShipment) && (
                                <button
                                    onClick={() => handleDownloadReceipt(selectedShipment)}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                                >
                                    <Download size={16} />
                                    Download payment receipt
                                </button>
                            )}

                            <button
                                onClick={() => setSelectedShipment(null)}
                                className="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShipmentHistory;