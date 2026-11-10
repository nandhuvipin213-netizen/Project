import CustomerTrackingMap from "../../components/customer/CustomerTrackingMap";
import { useEffect, useState } from "react";
import api from "../../services/Api";

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


const TrackShipment = () => {
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
            setTrackingError("");
            setTrackingDetails(null);

            await fetchTrackingDetails(shipmentId);
        } finally {
            setTrackingLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F8F3] p-6">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-2xl font-bold text-[#142B4A]">
                    Track Your Shipments
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    View your shipment details and delivery progress.
                </p>

                {loading ? (
                    <p className="mt-8 text-center text-gray-500">
                        Loading your shipments...
                    </p>
                ) : error ? (
                    <p className="mt-8 text-center text-red-500">{error}</p>
                ) : shipments.length === 0 ? (
                    <p className="mt-8 text-center text-gray-500">
                        You haven't created any shipments yet.
                    </p>
                ) : (
                    <div className="mt-8 grid gap-5">
                        {shipments.map((shipment) => (
                            <div
                                key={shipment._id}
                                className="rounded-2xl bg-white p-6 shadow-sm"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="font-semibold text-[#142B4A]">
                                        Shipment #{shipment._id.slice(-6).toUpperCase()}
                                    </h2>

                                    <span className="rounded-full bg-[#F4F8E9] px-4 py-2 text-xs font-semibold text-[#142B4A]">
                                        {shipment.status.replace("-", " ").toUpperCase()}
                                    </span>
                                </div>

                                <div className="mt-6 grid gap-5 md:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Pickup Location</p>
                                        <p className="mt-1 font-medium text-gray-800">
                                            {shipment.pickupAddress}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Delivery Location</p>
                                        <p className="mt-1 font-medium text-gray-800">
                                            {shipment.deliveryAddress}
                                        </p>
                                    </div>
                                </div>


                                <div className="mt-7 border-t border-gray-100 pt-5">
                                    <h3 className="mb-5 text-sm font-semibold text-[#142B4A]">
                                        Delivery Progress
                                    </h3>

                                    <div className="grid grid-cols-4 gap-2">
                                        {["assigned", "picked-up", "in-transit", "delivered"].map(
                                            (step, index) => {
                                                const currentIndex = [
                                                    "assigned",
                                                    "picked-up",
                                                    "in-transit",
                                                    "delivered",
                                                ].indexOf(shipment.status);

                                                const completed = currentIndex >= index;

                                                return (
                                                    <div key={step} className="text-center">
                                                        <div
                                                            className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${completed
                                                                ? "bg-[#142B4A] text-white"
                                                                : "bg-gray-200 text-gray-500"
                                                                }`}
                                                        >
                                                            {completed ? "✓" : index + 1}
                                                        </div>

                                                        <p className="mt-2 text-[10px] font-medium text-gray-600 sm:text-xs">
                                                            {["Assigned", "Picked Up", "In Transit", "Delivered"][index]}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>


                                <div className="mt-5 border-t border-gray-100 pt-4">
                                    <p className="text-xs text-gray-500">Goods Type</p>
                                    <p className="mt-1 text-sm font-medium text-gray-800">
                                        {shipment.goodsType}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleTrackShipment(shipment._id)}
                                    disabled={trackingLoading}
                                    className="mt-5 w-full rounded-full bg-[#142B4A] py-3 text-sm font-semibold text-white transition hover:bg-[#0D1F36] disabled:opacity-50"
                                >
                                    {trackingLoading ? "Loading tracking..." : "View Live Tracking →"}
                                </button>


                                {trackingError && (
                                    <p className="mt-3 text-sm text-red-600">{trackingError}</p>
                                )}

                                {trackingDetails && trackingDetails.tracking._id === shipment._id && (
                                    <div className="mt-5 rounded-2xl bg-[#F4F8E9] p-5">
                                        <h3 className="font-semibold text-[#142B4A]">
                                            Live Tracking Details
                                        </h3>

                                        <div className="mt-4 space-y-3 text-sm">
                                            <p>
                                                <span className="font-medium">Shipment Status: </span>
                                                {trackingDetails.tracking.status}
                                            </p>

                                            <p>
                                                <span className="font-medium">Driver: </span>
                                                {trackingDetails.tracking.assignedDriver?.name || "Not assigned"}
                                            </p>

                                            <p>
                                                <span className="font-medium">Vehicle: </span>
                                                {trackingDetails.tracking.assignedVehicle?.registrationNumber || "Not assigned"}
                                            </p>


                                            {trackingDetails.latestLocation ? (
                                                <>
                                                    <p>
                                                        <span className="font-medium">Driver Latitude: </span>
                                                        {trackingDetails.latestLocation.latitude}
                                                    </p>

                                                    <p>
                                                        <span className="font-medium">Driver Longitude: </span>
                                                        {trackingDetails.latestLocation.longitude}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        Last updated:{" "}
                                                        {new Date(
                                                            trackingDetails.latestLocation.recordedAt
                                                        ).toLocaleString()}
                                                    </p>
                                                    <CustomerTrackingMap
                                                        driverLatitude={trackingDetails.latestLocation.latitude}
                                                        driverLongitude={trackingDetails.latestLocation.longitude}
                                                        pickupLatitude={trackingDetails.tracking.pickupCoordinates!.lat!}
                                                        pickupLongitude={trackingDetails.tracking.pickupCoordinates!.lng!}
                                                        deliveryLatitude={trackingDetails.tracking.deliveryCoordinates!.lat!}
                                                        deliveryLongitude={trackingDetails.tracking.deliveryCoordinates!.lng!}
                                                    />
                                                </>
                                            ) : (
                                                <p className="text-gray-500">
                                                    Driver location is not available yet.
                                                </p>
                                            )}

                                        </div>
                                    </div>
                                )}


                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

};

export default TrackShipment;