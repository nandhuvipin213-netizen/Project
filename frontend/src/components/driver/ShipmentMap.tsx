
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";

const MapUpdater = ({
  route,
  driverCoordinates,
}: {
  route: [number, number][];
  driverCoordinates?: Coordinates | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      const bounds: [number, number][] = [...route];

      if (driverCoordinates) {
        bounds.push([
          driverCoordinates.lat,
          driverCoordinates.lng,
        ]);
      }

      map.fitBounds(bounds, {
        padding: [40, 40],
      });
    }
  }, [route, driverCoordinates, map]);

  return null;
};

interface Coordinates {
  lat: number;
  lng: number;
}

interface ShipmentMapProps {
  pickupCoordinates: Coordinates;
  deliveryCoordinates: Coordinates;
  driverCoordinates?: Coordinates | null;
}

const ShipmentMap = ({
  pickupCoordinates,
  deliveryCoordinates,
  driverCoordinates,
}: ShipmentMapProps) => {
  const center: [number, number] = [
    (pickupCoordinates.lat + deliveryCoordinates.lat) / 2,
    (pickupCoordinates.lng + deliveryCoordinates.lng) / 2,
  ];

  const [route, setRoute] = useState<[number, number][]>([]);
  const [routeLoading, setRouteLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setRouteLoading(true);

        const url = `https://router.project-osrm.org/route/v1/driving/${pickupCoordinates.lng},${pickupCoordinates.lat};${deliveryCoordinates.lng},${deliveryCoordinates.lat}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === "Ok" && data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates;

          const roadRoute: [number, number][] = coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          );

          setRoute(roadRoute);
        }
      } catch (error) {
        console.error("Failed to fetch road route:", error);
      } finally {
        setRouteLoading(false);
      }
    };

    fetchRoute();
  }, [pickupCoordinates.lat, pickupCoordinates.lng,
  deliveryCoordinates.lat, deliveryCoordinates.lng]);
  return (
    <div className="w-full overflow-hidden rounded-xl">
      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={true}
        className="h-[350px] w-full"
      >
        <MapUpdater
          route={route}
          driverCoordinates={driverCoordinates}
        />
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

        {driverCoordinates && (
          <CircleMarker
            center={[
              driverCoordinates.lat,
              driverCoordinates.lng,
            ]}
            radius={10}
            pathOptions={{
              color: "#ffffff",
              fillColor: "#2563eb",
              fillOpacity: 1,
              weight: 3,
            }}
          >
            <Popup>Driver's Current Location</Popup>
          </CircleMarker>
        )}

        {/* Route Line */}
        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: "#7c3aed",
              weight: 5,
              opacity: 0.9,
            }}
          />
        )}
      </MapContainer>
      {routeLoading && (
        <p className="bg-violet-50 p-3 text-center text-sm text-violet-700">
          Calculating road route...
        </p>
      )}

      {!routeLoading && route.length === 0 && (
        <p className="bg-amber-50 p-3 text-center text-sm text-amber-700">
          Road route unavailable. Please try again.
        </p>
      )}
    </div>
  );
};

export default ShipmentMap;
