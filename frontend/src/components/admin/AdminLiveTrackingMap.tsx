
import { useEffect } from "react";
import { useMap, MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

export interface VehicleLocation {
    _id: string;
    latitude: number;
    longitude: number;
    recordedAt: string;
    vehicle: {
        _id: string;
        registrationNumber: string;
        vehicleType: string;
    };
    driver: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    shipment: {
        _id: string;
        pickupAddress: string;
        deliveryAddress: string;
        status: string;
    };
}

interface AdminLiveTrackingMapProps {
    locations: VehicleLocation[];
}

const MapUpdater = ({ locations }: { locations: VehicleLocation[] }) => {
    const map = useMap();

    useEffect(() => {
        if (locations.length === 1) {
            map.setView(
                [locations[0].latitude, locations[0].longitude],
                14
            );
        } else if (locations.length > 1) {
            map.fitBounds(
                locations.map(
                    (location) =>
                        [location.latitude, location.longitude] as [number, number]
                ),
                { padding: [40, 40] }
            );
        }
    }, [locations, map]);

    return null;
};

const AdminLiveTrackingMap = ({
    locations,
}: AdminLiveTrackingMapProps) => {
    const defaultPosition: [number, number] =
        locations.length > 0
            ? [locations[0].latitude, locations[0].longitude]
            : [10.8505, 76.2711];

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
            <MapContainer
                center={defaultPosition}
                zoom={7}
                scrollWheelZoom={true}
                style={{ height: "500px", width: "100%" }}
            >
                <MapUpdater locations={locations} />

                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locations.map((location) => (
                    <CircleMarker
                        key={location._id}
                        center={[
                            location.latitude,
                            location.longitude,
                        ]}
                        radius={11}
                        pathOptions={{
                            color: "#7c3aed",
                            fillColor: "#a78bfa",
                            fillOpacity: 1,
                        }}
                    >
                        <Popup>
                            <div className="min-w-[220px] space-y-2">
                                <h3 className="font-bold text-purple-700">
                                    {location.vehicle.registrationNumber}
                                </h3>

                                <p>
                                    <strong>Vehicle:</strong>{" "}
                                    {location.vehicle.vehicleType}
                                </p>

                                <p>
                                    <strong>Driver:</strong>{" "}
                                    {location.driver.name}
                                </p>

                                <p>
                                    <strong>Phone:</strong>{" "}
                                    {location.driver.phone}
                                </p>

                                <p>
                                    <strong>Shipment Status:</strong>{" "}
                                    {location.shipment.status}
                                </p>

                                <p>
                                    <strong>Pickup:</strong>{" "}
                                    {location.shipment.pickupAddress}
                                </p>

                                <p>
                                    <strong>Delivery:</strong>{" "}
                                    {location.shipment.deliveryAddress}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Last updated:{" "}
                                    {new Date(
                                        location.recordedAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};

export default AdminLiveTrackingMap;
