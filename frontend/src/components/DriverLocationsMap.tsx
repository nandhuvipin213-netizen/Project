
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import api from "../services/Api";

interface DriverLocation {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  currentLocation: {
    lat: number | null;
    lng: number | null;
    updatedAt: string | null;
  };
  availabilityStatus: string;
}

const DriverLocationsMap = () => {
  const [drivers, setDrivers] = useState<DriverLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDriverLocations = async () => {
      try {
        const response = await api.get("/drivers/locations");

        setDrivers(response.data.drivers || []);
        setError("");
      } catch (err) {
        console.error("Failed to fetch driver locations:", err);
        setError("Unable to load driver locations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDriverLocations();

    // Refresh locations every 10 seconds
    const interval = setInterval(fetchDriverLocations, 10000);

    return () => clearInterval(interval);
  }, []);

  const driversWithLocation = drivers.filter(
    (driver) =>
      typeof driver.currentLocation?.lat === "number" &&
      typeof driver.currentLocation?.lng === "number"
  );

  if (loading) {
    return <p className="p-5 text-slate-500">Loading driver locations...</p>;
  }

  if (error) {
    return <p className="p-5 text-rose-600">{error}</p>;
  }

  return (
    <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
      <h2 className="mb-2 text-lg font-bold text-slate-800">
        Live Driver Locations
      </h2>

      <p className="mb-4 text-sm text-slate-500">
        Driver locations refresh automatically every 10 seconds.
      </p>

      {driversWithLocation.length === 0 ? (
        <p className="text-sm text-slate-500">
          No driver locations are currently available.
        </p>
      ) : (
        <MapContainer
          center={[9.5, 76.4]}
          zoom={8}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {driversWithLocation.map((driver) => (
            <CircleMarker
              key={driver._id}
              center={[
                driver.currentLocation.lat as number,
                driver.currentLocation.lng as number,
              ]}
              radius={9}
              pathOptions={{
                color: "#7c3aed",
                fillColor: "#8b5cf6",
                fillOpacity: 0.9,
              }}
            >
              <Popup>
                <strong>{driver.user.name}</strong>
                <br />
                {driver.user.email}
                <br />
                Status: {driver.availabilityStatus}
                <br />
                Last updated:{" "}
                {driver.currentLocation.updatedAt
                  ? new Date(
                      driver.currentLocation.updatedAt
                    ).toLocaleTimeString()
                  : "Not available"}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      )}
    </section>
  );
};

export default DriverLocationsMap;
