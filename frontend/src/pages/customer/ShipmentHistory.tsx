import { useEffect, useState } from "react";
import {
    Package,
    MapPin,
    CalendarDays,
    IndianRupee,
} from "lucide-react";
import api from "../../services/Api";

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

function ShipmentHistory() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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
                    <strong>${shipment._id}</strong>
                </div>
                <div class="row">
                    <span>Pickup</span>
                    <strong>${shipment.pickupAddress}</strong>
                </div>
                <div class="row">
                    <span>Delivery</span>
                    <strong>${shipment.deliveryAddress}</strong>
                </div>
                <div class="row">
                    <span>Payment ID</span>
                    <strong>${shipment.advancePaymentId || "N/A"}</strong>
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

    if (loading) {
        return <div className="p-8 text-center">Loading shipment history...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-[#f5f4fb] p-6 md:p-8">

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#20213a]">
                    Shipment History
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    View all your previous and current shipments.
                </p>
            </div>

            <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total Shipments</p>
                <h2 className="mt-2 text-3xl font-bold text-[#20213a]">
                    {shipments.length}
                </h2>
            </div>

            {shipments.length === 0 ? (
                <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                    <Package size={42} className="mx-auto text-gray-400" />

                    <h2 className="mt-4 text-lg font-semibold text-[#20213a]">
                        No shipments found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Your shipment bookings will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {shipments.map((shipment) => (
                        <div
                            key={shipment._id}
                            className="rounded-xl bg-white p-5 shadow-sm"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <Package className="text-indigo-600" />
                                    <span className="font-semibold text-[#20213a]">
                                        #{shipment._id.slice(-8).toUpperCase()}
                                    </span>
                                </div>

                                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                                    {shipment.status}
                                </span>
                            </div>

                            <div className="my-5 grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-xs text-gray-400">PICKUP</p>
                                    <p className="mt-1 flex items-center gap-2 font-medium text-gray-700">
                                        <MapPin size={16} className="text-green-600" />
                                        {shipment.pickupAddress}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">DELIVERY</p>
                                    <p className="mt-1 flex items-center gap-2 font-medium text-gray-700">
                                        <MapPin size={16} className="text-red-500" />
                                        {shipment.deliveryAddress}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <p className="text-xs text-gray-400">GOODS TYPE</p>
                                    <p className="mt-1 text-sm font-medium text-gray-700">
                                        {shipment.goodsType}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">PICKUP DATE</p>
                                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                                        <CalendarDays size={15} />
                                        {new Date(shipment.pickupDate).toLocaleDateString("en-IN")}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">ADVANCE AMOUNT</p>
                                    <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-gray-700">
                                        <IndianRupee size={15} />
                                        {Number(shipment.advanceAmount ?? 0).toFixed(2)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">PAYMENT STATUS</p>
                                    <p className={`mt-1 text-sm font-semibold capitalize ${shipment.advancePaymentStatus === "paid"
                                        ? "text-green-600"
                                        : "text-orange-500"
                                        }`}>
                                        {shipment.advancePaymentStatus}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex justify-end border-t border-gray-100 pt-4">
                                <button
                                    onClick={() => setSelectedShipment(shipment)}
                                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedShipment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

                        {/* Modal Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-[#20213a]">
                                    Shipment Details
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    #{selectedShipment._id}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedShipment(null)}
                                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Shipment Information */}
                        <div className="grid gap-5 sm:grid-cols-2">

                            <div>
                                <p className="text-xs text-gray-400">PICKUP LOCATION</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {selectedShipment.pickupAddress}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">DELIVERY LOCATION</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {selectedShipment.deliveryAddress}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">GOODS TYPE</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {selectedShipment.goodsType}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">DESCRIPTION</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {selectedShipment.goodsDescription || "Not provided"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">PACKAGE COUNT</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {selectedShipment.packageCount ?? "Not available"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">ACTUAL WEIGHT</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {selectedShipment.weight != null
                                        ? `${selectedShipment.weight} kg`
                                        : "Not provided"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">DISTANCE</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {Number(selectedShipment.distanceKm ?? 0).toFixed(2)} km
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">PICKUP DATE & TIME</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {new Date(selectedShipment.pickupDate).toLocaleDateString("en-IN")}
                                    {" at "}
                                    {selectedShipment.pickupTime}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">SHIPMENT STATUS</p>
                                <p className="mt-1 font-semibold capitalize text-indigo-600">
                                    {selectedShipment.status}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">ADVANCE PAYMENT STATUS</p>
                                <p className={`mt-1 font-semibold capitalize ${selectedShipment.advancePaymentStatus === "paid"
                                    ? "text-green-600"
                                    : "text-orange-500"
                                    }`}>
                                    {selectedShipment.advancePaymentStatus}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">ADVANCE AMOUNT</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    ₹{Number(selectedShipment.advanceAmount ?? 0).toFixed(2)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">PAYMENT DATE</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {selectedShipment.advancePaidAt
                                        ? new Date(selectedShipment.advancePaidAt).toLocaleString("en-IN")
                                        : "Not paid"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">ASSIGNED DRIVER</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {selectedShipment.assignedDriver?.name || "Not assigned"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">ASSIGNED VEHICLE</p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {selectedShipment.assignedVehicle?.registrationNumber || "Not assigned"}
                                </p>
                            </div>

                        </div>

                        {/* Download Receipt Button */}
                        {selectedShipment.advancePaymentStatus === "paid" && (
                            <button
                                onClick={() => handleDownloadReceipt(selectedShipment)}
                                className="mt-4 w-full rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
                            >
                                Download Payment Receipt
                            </button>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedShipment(null)}
                            className="mt-8 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
                        >
                            Close Details
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

export default ShipmentHistory;