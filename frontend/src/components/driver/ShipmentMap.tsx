
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface Coordinates {
  lat: number;
  lng: number;
}

interface ShipmentMapProps {
  pickupCoordinates: Coordinates;
  deliveryCoordinates: Coordinates;
}

const ShipmentMap = ({
  pickupCoordinates,
  deliveryCoordinates,
}: ShipmentMapProps) => {
  const center: [number, number] = [
    (pickupCoordinates.lat + deliveryCoordinates.lat) / 2,
    (pickupCoordinates.lng + deliveryCoordinates.lng) / 2,
  ];

  const route: [number, number][] = [
    [pickupCoordinates.lat, pickupCoordinates.lng],
    [deliveryCoordinates.lat, deliveryCoordinates.lng],
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl">
      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={true}
        className="h-[350px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Pickup Location */}
        <CircleMarker
          center={[
            pickupCoordinates.lat,
            pickupCoordinates.lng,
          ]}
          radius={9}
          pathOptions={{
            color: "#ffffff",
            fillColor: "#22c55e",
            fillOpacity: 1,
            weight: 3,
          }}
        >
          <Popup>Pickup Location</Popup>
        </CircleMarker>

        {/* Delivery Location */}
        <CircleMarker
          center={[
            deliveryCoordinates.lat,
            deliveryCoordinates.lng,
          ]}
          radius={9}
          pathOptions={{
            color: "#ffffff",
            fillColor: "#ef4444",
            fillOpacity: 1,
            weight: 3,
          }}
        >
          <Popup>Delivery Location</Popup>
        </CircleMarker>

        {/* Route Line */}
        <Polyline
          positions={route}
          pathOptions={{
            color: "#7c3aed",
            weight: 4,
            opacity: 0.8,
          }}
        />
      </MapContainer>
    </div>
  );
};

export default ShipmentMap;
