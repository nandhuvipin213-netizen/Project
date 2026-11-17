import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapUpdaterProps {
  route: [number, number][];
  driverRoute: [number, number][];
  driverCoordinates?: Coordinates | null;
  pickupCoordinates: Coordinates;
  deliveryCoordinates: Coordinates;
  routeLoading: boolean;
}

// Fits the map to all points once, so the driver can zoom and pan
// freely while live location updates keep coming in.
const MapUpdater = ({
  route,
  driverRoute,
  driverCoordinates,
  pickupCoordinates,
  deliveryCoordinates,
  routeLoading,
}: MapUpdaterProps) => {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (hasFitted.current || routeLoading) return;

    const bounds: [number, number][] =
      route.length > 0
        ? [...route]
        : [
            [pickupCoordinates.lat, pickupCoordinates.lng],
            [deliveryCoordinates.lat, deliveryCoordinates.lng],
          ];

    bounds.push(...driverRoute);

    if (driverCoordinates) {
      bounds.push([driverCoordinates.lat, driverCoordinates.lng]);
    }

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
      hasFitted.current = true;
    }
  }, [
    route,
    driverRoute,
    driverCoordinates,
    pickupCoordinates,
    deliveryCoordinates,
    routeLoading,
    map,
  ]);

  return null;
};

interface ShipmentMapProps {
  pickupCoordinates: Coordinates;
  deliveryCoordinates: Coordinates;
  driverCoordinates?: Coordinates | null;
  shipmentStatus: string;
}

const ShipmentMap = ({
  pickupCoordinates,
  deliveryCoordinates,
  driverCoordinates,
  shipmentStatus,
}: ShipmentMapProps) => {
  const center: [number, number] = [
    (pickupCoordinates.lat + deliveryCoordinates.lat) / 2,
    (pickupCoordinates.lng + deliveryCoordinates.lng) / 2,
  ];

  const [route, setRoute] = useState<[number, number][]>([]);
  const [driverRoute, setDriverRoute] = useState<[number, number][]>([]);

  const [routeLoading, setRouteLoading] = useState(true);
  const [driverRouteLoading, setDriverRouteLoading] = useState(false);

  // Full route: Pickup to Delivery
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setRouteLoading(true);

        const url = `https://router.project-osrm.org/route/v1/driving/${pickupCoordinates.lng},${pickupCoordinates.lat};${deliveryCoordinates.lng},${deliveryCoordinates.lat}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === "Ok" && data.routes?.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates;

          const roadRoute: [number, number][] = coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          );

          setRoute(roadRoute);
        } else {
          setRoute([]);
        }
      } catch (error) {
        console.error("Failed to fetch full route:", error);
        setRoute([]);
      } finally {
        setRouteLoading(false);
      }
    };

    fetchRoute();
  }, [
    pickupCoordinates.lat,
    pickupCoordinates.lng,
    deliveryCoordinates.lat,
    deliveryCoordinates.lng,
  ]);

  // Driver route: Driver to Pickup or Delivery
  useEffect(() => {
    if (!driverCoordinates) {
      setDriverRoute([]);
      return;
    }

    const fetchDriverRoute = async () => {
      try {
        setDriverRouteLoading(true);

        // Before pickup: Driver goes to pickup.
        // After pickup: Driver goes to delivery.
        const targetCoordinates =
          shipmentStatus === "assigned"
            ? pickupCoordinates
            : deliveryCoordinates;

        const url = `https://router.project-osrm.org/route/v1/driving/${driverCoordinates.lng},${driverCoordinates.lat};${targetCoordinates.lng},${targetCoordinates.lat}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === "Ok" && data.routes?.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates;

          const roadRoute: [number, number][] = coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          );

          setDriverRoute(roadRoute);
        } else {
          setDriverRoute([]);
        }
      } catch (error) {
        console.error("Failed to fetch driver route:", error);
        setDriverRoute([]);
      } finally {
        setDriverRouteLoading(false);
      }
    };

    fetchDriverRoute();
  }, [
    driverCoordinates?.lat,
    driverCoordinates?.lng,
    shipmentStatus,
    pickupCoordinates.lat,
    pickupCoordinates.lng,
    deliveryCoordinates.lat,
    deliveryCoordinates.lng,
  ]);

  return (
    <div className="w-full overflow-hidden rounded-xl">
      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={true}
        className="h-[280px] w-full sm:h-[350px] lg:h-[420px]"
      >
        <MapUpdater
          route={route}
          driverRoute={driverRoute}
          driverCoordinates={driverCoordinates}
          pickupCoordinates={pickupCoordinates}
          deliveryCoordinates={deliveryCoordinates}
          routeLoading={routeLoading}
        />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Pickup Location */}
        <CircleMarker
          center={[pickupCoordinates.lat, pickupCoordinates.lng]}
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
          center={[deliveryCoordinates.lat, deliveryCoordinates.lng]}
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

        {/* Driver's Current Location */}
        {driverCoordinates && (
          <CircleMarker
            center={[driverCoordinates.lat, driverCoordinates.lng]}
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

        {/* Full Pickup-to-Delivery Route */}
        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: "#7c3aed",
              weight: 5,
              opacity: 0.5,
            }}
          />
        )}

        {/* Driver-to-Target Route */}
        {driverRoute.length > 0 && (
          <Polyline
            positions={driverRoute}
            pathOptions={{
              color: "#2563eb",
              weight: 6,
              opacity: 1,
            }}
          />
        )}
      </MapContainer>

      {routeLoading && (
        <p className="bg-violet-50 p-3 text-center text-sm text-violet-700">
          Calculating road route...
        </p>
      )}

      {driverRouteLoading && (
        <p className="bg-blue-50 p-2 text-center text-sm text-blue-700">
          Updating driver's route...
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