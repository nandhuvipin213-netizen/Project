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

    // return (
    //     <div className="min-h-screen bg-[#F7F8F3] p-6">
    //         <div className="mx-auto max-w-6xl">
    //             <h1 className="text-2xl font-bold text-[#142B4A]">
    //                 Track Your Shipments
    //             </h1>

    //             <p className="mt-2 text-sm text-gray-500">
    //                 View your shipment details and delivery progress.
    //             </p>

    //             {loading ? (
    //                 <p className="mt-8 text-center text-gray-500">
    //                     Loading your shipments...
    //                 </p>
    //             ) : error ? (
    //                 <p className="mt-8 text-center text-red-500">{error}</p>
    //             ) : shipments.length === 0 ? (
    //                 <p className="mt-8 text-center text-gray-500">
    //                     You haven't created any shipments yet.
    //                 </p>
    //             ) : (
    //                 <div className="mt-8 grid gap-5">
    //                     {shipments.map((shipment) => (
    //                         <div
    //                             key={shipment._id}
    //                             className="rounded-2xl bg-white p-6 shadow-sm"
    //                         >
    //                             <div className="flex flex-wrap items-center justify-between gap-3">
    //                                 <h2 className="font-semibold text-[#142B4A]">
    //                                     Shipment #{shipment._id.slice(-6).toUpperCase()}
    //                                 </h2>

    //                                 <span className="rounded-full bg-[#F4F8E9] px-4 py-2 text-xs font-semibold text-[#142B4A]">
    //                                     {shipment.status.replace("-", " ").toUpperCase()}
    //                                 </span>
    //                             </div>

    //                             <div className="mt-6 grid gap-5 md:grid-cols-2">
    //                                 <div>
    //                                     <p className="text-xs text-gray-500">Pickup Location</p>
    //                                     <p className="mt-1 font-medium text-gray-800">
    //                                         {shipment.pickupAddress}
    //                                     </p>
    //                                 </div>

    //                                 <div>
    //                                     <p className="text-xs text-gray-500">Delivery Location</p>
    //                                     <p className="mt-1 font-medium text-gray-800">
    //                                         {shipment.deliveryAddress}
    //                                     </p>
    //                                 </div>
    //                             </div>


    //                             <div className="mt-7 border-t border-gray-100 pt-5">
    //                                 <h3 className="mb-5 text-sm font-semibold text-[#142B4A]">
    //                                     Delivery Progress
    //                                 </h3>

    //                                 <div className="grid grid-cols-4 gap-2">
    //                                     {["assigned", "picked-up", "in-transit", "delivered"].map(
    //                                         (step, index) => {
    //                                             const currentIndex = [
    //                                                 "assigned",
    //                                                 "picked-up",
    //                                                 "in-transit",
    //                                                 "delivered",
    //                                             ].indexOf(shipment.status);

    //                                             const completed = currentIndex >= index;

    //                                             return (
    //                                                 <div key={step} className="text-center">
    //                                                     <div
    //                                                         className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${completed
    //                                                             ? "bg-[#142B4A] text-white"
    //                                                             : "bg-gray-200 text-gray-500"
    //                                                             }`}
    //                                                     >
    //                                                         {completed ? "✓" : index + 1}
    //                                                     </div>

    //                                                     <p className="mt-2 text-[10px] font-medium text-gray-600 sm:text-xs">
    //                                                         {["Assigned", "Picked Up", "In Transit", "Delivered"][index]}
    //                                                     </p>
    //                                                 </div>
    //                                             );
    //                                         }
    //                                     )}
    //                                 </div>
    //                             </div>


    //                             <div className="mt-5 border-t border-gray-100 pt-4">
    //                                 <p className="text-xs text-gray-500">Goods Type</p>
    //                                 <p className="mt-1 text-sm font-medium text-gray-800">
    //                                     {shipment.goodsType}
    //                                 </p>
    //                             </div>

    //                             <button
    //                                 type="button"
    //                                 onClick={() => handleTrackShipment(shipment._id)}
    //                                 disabled={trackingLoading}
    //                                 className="mt-5 w-full rounded-full bg-[#142B4A] py-3 text-sm font-semibold text-white transition hover:bg-[#0D1F36] disabled:opacity-50"
    //                             >
    //                                 {trackingLoading ? "Loading tracking..." : "View Live Tracking →"}
    //                             </button>


    //                             {trackingError && (
    //                                 <p className="mt-3 text-sm text-red-600">{trackingError}</p>
    //                             )}

    //                             {trackingDetails && trackingDetails.tracking._id === shipment._id && (
    //                                 <div className="mt-5 rounded-2xl bg-[#F4F8E9] p-5">
    //                                     <h3 className="font-semibold text-[#142B4A]">
    //                                         Live Tracking Details
    //                                     </h3>

    //                                     <div className="mt-4 space-y-3 text-sm">
    //                                         <p>
    //                                             <span className="font-medium">Shipment Status: </span>
    //                                             {trackingDetails.tracking.status}
    //                                         </p>

    //                                         <p>
    //                                             <span className="font-medium">Driver: </span>
    //                                             {trackingDetails.tracking.assignedDriver?.name || "Not assigned"}
    //                                         </p>

    //                                         <p>
    //                                             <span className="font-medium">Vehicle: </span>
    //                                             {trackingDetails.tracking.assignedVehicle?.registrationNumber || "Not assigned"}
    //                                         </p>


    //                                         {trackingDetails.latestLocation ? (
    //                                             <>
    //                                                 <p>
    //                                                     <span className="font-medium">Driver Latitude: </span>
    //                                                     {trackingDetails.latestLocation.latitude}
    //                                                 </p>

    //                                                 <p>
    //                                                     <span className="font-medium">Driver Longitude: </span>
    //                                                     {trackingDetails.latestLocation.longitude}
    //                                                 </p>

    //                                                 <p className="text-xs text-gray-500">
    //                                                     Last updated:{" "}
    //                                                     {new Date(
    //                                                         trackingDetails.latestLocation.recordedAt
    //                                                     ).toLocaleString()}
    //                                                 </p>
    //                                                 <CustomerTrackingMap
    //                                                     driverLatitude={trackingDetails.latestLocation.latitude}
    //                                                     driverLongitude={trackingDetails.latestLocation.longitude}
    //                                                     pickupLatitude={trackingDetails.tracking.pickupCoordinates!.lat!}
    //                                                     pickupLongitude={trackingDetails.tracking.pickupCoordinates!.lng!}
    //                                                     deliveryLatitude={trackingDetails.tracking.deliveryCoordinates!.lat!}
    //                                                     deliveryLongitude={trackingDetails.tracking.deliveryCoordinates!.lng!}
    //                                                 />
    //                                             </>
    //                                         ) : (
    //                                             <p className="text-gray-500">
    //                                                 Driver location is not available yet.
    //                                             </p>
    //                                         )}

    //                                     </div>
    //                                 </div>
    //                             )}


    //                         </div>
    //                     ))}
    //                 </div>
    //             )}
    //         </div>
    //     </div>
    // );




return (
    <div className="min-h-screen bg-[#F3F6FA] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">

            {/* Page Header */}
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-600">
                        <span className="h-2 w-2 rounded-full bg-teal-500"></span>
                        CUSTOMER PORTAL
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-[#142B4A] sm:text-4xl">
                        Track Your Shipments
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Monitor your deliveries and follow their journey in real time.
                    </p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-xl">
                        📦
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-400">
                            YOUR SHIPMENTS
                        </p>
                        <p className="text-lg font-bold text-[#142B4A]">
                            {shipments.length} Total
                        </p>
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="rounded-3xl bg-white py-20 text-center shadow-sm">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-teal-600"></div>
                    <p className="font-medium text-gray-500">
                        Loading your shipments...
                    </p>
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
                    {error}
                </div>
            ) : shipments.length === 0 ? (
                <div className="rounded-3xl border border-gray-100 bg-white px-6 py-20 text-center shadow-sm">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-50 text-4xl">
                        📦
                    </div>
                    <h2 className="text-xl font-bold text-[#142B4A]">
                        No Shipments Yet
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        You haven't created any shipments yet.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">

                    {shipments.map((shipment) => (
                        <div
                            key={shipment._id}
                            className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            {/* Card Header */}
                            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#142B4A] px-6 py-5 sm:px-8">
                                <div>
                                    <p className="text-xs font-medium tracking-widest text-teal-300">
                                        SHIPMENT DETAILS
                                    </p>
                                    <h2 className="mt-1 text-lg font-bold text-white">
                                        Shipment #{shipment._id.slice(-6).toUpperCase()}
                                    </h2>
                                </div>

                                <span
                                    className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide ${
                                        shipment.status === "delivered"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : shipment.status === "cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : shipment.status === "pending"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-teal-100 text-teal-800"
                                    }`}
                                >
                                    {shipment.status.replace("-", " ").toUpperCase()}
                                </span>
                            </div>

                            <div className="p-6 sm:p-8">

                                {/* Route Details */}
                                <div className="grid gap-5 md:grid-cols-2">

                                    <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5">
                                        <div className="mb-3 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg">
                                                📍
                                            </div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                                Pickup Location
                                            </p>
                                        </div>

                                        <p className="font-semibold leading-relaxed text-[#142B4A]">
                                            {shipment.pickupAddress}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5">
                                        <div className="mb-3 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-lg">
                                                🏁
                                            </div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                                Delivery Location
                                            </p>
                                        </div>

                                        <p className="font-semibold leading-relaxed text-[#142B4A]">
                                            {shipment.deliveryAddress}
                                        </p>
                                    </div>
                                </div>

                                {/* Delivery Progress */}
                                <div className="mt-8 rounded-2xl border border-gray-100 p-5 sm:p-7">
                                    <div className="mb-7 flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <h3 className="font-bold text-[#142B4A]">
                                                Delivery Progress
                                            </h3>
                                            <p className="mt-1 text-xs text-gray-400">
                                                Follow each stage of your shipment.
                                            </p>
                                        </div>

                                        <span className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700">
                                            {shipment.status.replace("-", " ").toUpperCase()}
                                        </span>
                                    </div>

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
                                                            className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition sm:h-11 sm:w-11 ${
                                                                completed
                                                                    ? "bg-teal-600 text-white shadow-lg shadow-teal-100"
                                                                    : "bg-gray-100 text-gray-400"
                                                            }`}
                                                        >
                                                            {completed ? "✓" : index + 1}
                                                        </div>

                                                        <p className="mt-3 text-[10px] font-semibold text-gray-500 sm:text-xs">
                                                            {["Assigned", "Picked Up", "In Transit", "Delivered"][index]}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>

                                {/* Goods Information */}
                                <div className="mt-6 flex items-center gap-4 rounded-2xl bg-[#F4F8E9] p-5">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                                        📦
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Goods Type
                                        </p>
                                        <p className="mt-1 font-bold text-[#142B4A]">
                                            {shipment.goodsType}
                                        </p>
                                    </div>
                                </div>

                                {/* Tracking Button */}
                                <button
                                    type="button"
                                    onClick={() => handleTrackShipment(shipment._id)}
                                    disabled={trackingLoading}
                                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#142B4A] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-950/10 transition duration-300 hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {trackingLoading
                                        ? "Loading tracking..."
                                        : "View Live Tracking →"}
                                </button>

                                {trackingError && (
                                    <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                                        {trackingError}
                                    </p>
                                )}

                                {/* Live Tracking Details */}
                                {trackingDetails && trackingDetails.tracking._id === shipment._id && (
                                    <div className="mt-6 rounded-2xl border border-teal-100 bg-[#F0FAF8] p-5 sm:p-7">
                                        <div className="mb-6 flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-xl text-white">
                                                🚚
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#142B4A]">
                                                    Live Tracking Details
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    Latest shipment information
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="rounded-xl bg-white p-4">
                                                <p className="text-xs text-gray-400">Shipment Status</p>
                                                <p className="mt-1 font-semibold text-[#142B4A]">
                                                    {trackingDetails.tracking.status}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-white p-4">
                                                <p className="text-xs text-gray-400">Driver</p>
                                                <p className="mt-1 font-semibold text-[#142B4A]">
                                                    {trackingDetails.tracking.assignedDriver?.name || "Not assigned"}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-white p-4">
                                                <p className="text-xs text-gray-400">Vehicle</p>
                                                <p className="mt-1 font-semibold text-[#142B4A]">
                                                    {trackingDetails.tracking.assignedVehicle?.registrationNumber || "Not assigned"}
                                                </p>
                                            </div>
                                        </div>

                                        {trackingDetails.latestLocation ? (
                                            <div className="mt-5 rounded-xl bg-white p-5">
                                                <h4 className="mb-4 font-bold text-[#142B4A]">
                                                    📍 Driver's Current Location
                                                </h4>

                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-semibold text-[#142B4A]">Latitude: </span>
                                                        {trackingDetails.latestLocation.latitude}
                                                    </p>

                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-semibold text-[#142B4A]">Longitude: </span>
                                                        {trackingDetails.latestLocation.longitude}
                                                    </p>
                                                </div>

                                                <p className="mt-3 text-xs text-gray-400">
                                                    Last updated:{" "}
                                                    {new Date(
                                                        trackingDetails.latestLocation.recordedAt
                                                    ).toLocaleString()}
                                                </p>

                                                <div className="mt-5 overflow-hidden rounded-xl">
                                                    <CustomerTrackingMap
                                                        driverLatitude={trackingDetails.latestLocation.latitude}
                                                        driverLongitude={trackingDetails.latestLocation.longitude}
                                                        pickupLatitude={trackingDetails.tracking.pickupCoordinates!.lat!}
                                                        pickupLongitude={trackingDetails.tracking.pickupCoordinates!.lng!}
                                                        deliveryLatitude={trackingDetails.tracking.deliveryCoordinates!.lat!}
                                                        deliveryLongitude={trackingDetails.tracking.deliveryCoordinates!.lng!}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="mt-5 rounded-xl bg-white p-4 text-sm text-gray-500">
                                                Driver location is not available yet.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

};

export default TrackShipment;