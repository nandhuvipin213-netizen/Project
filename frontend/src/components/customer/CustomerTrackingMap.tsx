import { useEffect, useState } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    Polyline,
} from "react-leaflet";

interface CustomerTrackingMapProps {
    driverLatitude: number;
    driverLongitude: number;
    pickupLatitude: number;
    pickupLongitude: number;
    deliveryLatitude: number;
    deliveryLongitude: number;
}
const MapUpdater = ({
    driverLatitude,
    driverLongitude,
    pickupLatitude,
    pickupLongitude,
    deliveryLatitude,
    deliveryLongitude,
}: {
    driverLatitude: number;
    driverLongitude: number;
    pickupLatitude: number;
    pickupLongitude: number;
    deliveryLatitude: number;
    deliveryLongitude: number;
}) => {
    const map = useMap();

    useEffect(() => {
        map.fitBounds(
            [
                [pickupLatitude, pickupLongitude],
                [driverLatitude, driverLongitude],
                [deliveryLatitude, deliveryLongitude],
            ],
            { padding: [40, 40] }
        );
    }, [
        map,
        driverLatitude,
        driverLongitude,
        pickupLatitude,
        pickupLongitude,
        deliveryLatitude,
        deliveryLongitude,
    ]);

    return null;
};
const CustomerTrackingMap = ({
    driverLatitude,
    driverLongitude,
    pickupLatitude,
    pickupLongitude,
    deliveryLatitude,
    deliveryLongitude,
}: CustomerTrackingMapProps) => {
    const driverPosition: [number, number] = [
        driverLatitude,
        driverLongitude,
    ];
    const pickupPosition: [number, number] = [
        pickupLatitude,
        pickupLongitude,
    ];

    const deliveryPosition: [number, number] = [
        deliveryLatitude,
        deliveryLongitude,
    ];
    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);

    useEffect(() => {
        const fetchRoadRoute = async () => {
            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${pickupLongitude},${pickupLatitude};${deliveryLongitude},${deliveryLatitude}?overview=full&geometries=geojson`
                );

                const data = await response.json();

                if (data.routes && data.routes.length > 0) {
                    const coordinates = data.routes[0].geometry.coordinates;

                    const formattedCoordinates: [number, number][] =
                        coordinates.map(
                            ([longitude, latitude]: [number, number]) => [
                                latitude,
                                longitude,
                            ]
                        );

                    setRouteCoordinates(formattedCoordinates);
                }
            } catch (error) {
                console.error("Failed to fetch road route:", error);
                setRouteCoordinates([]);
            }
        };

        fetchRoadRoute();
    }, [
        pickupLatitude,
        pickupLongitude,
        deliveryLatitude,
        deliveryLongitude,
    ]);

    return (
        <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
            <h3 className="bg-[#F4F8E9] p-4 font-semibold text-[#142B4A]">
                Live Driver Location
            </h3>

            <MapContainer
                center={driverPosition}
                zoom={14}
                scrollWheelZoom={true}
                style={{ height: "400px", width: "100%" }}
            >
                <MapUpdater
                    driverLatitude={driverLatitude}
                    driverLongitude={driverLongitude}
                    pickupLatitude={pickupLatitude}
                    pickupLongitude={pickupLongitude}
                    deliveryLatitude={deliveryLatitude}
                    deliveryLongitude={deliveryLongitude}
                />

                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Pickup Marker - Green */}
                <CircleMarker
                    center={pickupPosition}
                    radius={10}
                    pathOptions={{
                        color: "#16a34a",
                        fillColor: "#22c55e",
                        fillOpacity: 1,
                    }}
                >
                    <Popup>Pickup Location</Popup>
                </CircleMarker>

                {/* Delivery Marker - Red */}
                <CircleMarker
                    center={deliveryPosition}
                    radius={10}
                    pathOptions={{
                        color: "#dc2626",
                        fillColor: "#ef4444",
                        fillOpacity: 1,
                    }}
                >
                    <Popup>Delivery Destination</Popup>
                </CircleMarker>

                {/* Driver Marker - Blue */}
                <CircleMarker
                    center={driverPosition}
                    radius={10}
                    pathOptions={{
                        color: "#2563eb",
                        fillColor: "#3b82f6",
                        fillOpacity: 1,
                    }}
                >
                    <Popup>Current Driver Location</Popup>
                </CircleMarker>

                {routeCoordinates.length > 0 && (
                    <Polyline
                        positions={routeCoordinates}
                        pathOptions={{
                            color: "#9333ea",
                            weight: 5,
                            opacity: 0.9,
                        }}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default CustomerTrackingMap;
