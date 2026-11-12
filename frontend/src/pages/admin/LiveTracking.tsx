
import { useCallback, useEffect, useState } from "react";
import api from "../../services/Api";
import AdminLiveTrackingMap, {
    type VehicleLocation,
} from "../../components/admin/AdminLiveTrackingMap";

const LiveTracking = () => {
    const [locations, setLocations] = useState<VehicleLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchLocations = useCallback(async () => {
        try {
            const response = await api.get("/vehicle-locations");

            setLocations(response.data.locations || []);
            setError("");
        } catch (err) {
            console.error("Failed to fetch vehicle locations:", err);
            setError("Unable to load vehicle locations.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLocations();

        const interval = setInterval(fetchLocations, 10000);

        return () => clearInterval(interval);
    }, [fetchLocations]);

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-[#20213a]">
                        Live Vehicle Tracking
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Monitor your active delivery vehicles in real time.
                    </p>
                </div>

                <button
                    onClick={fetchLocations}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700"
                >
                    Refresh Locations
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Active Vehicles Tracked
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-violet-600">
                        {locations.length}
                    </h2>
                </div>

                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Tracking Status
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-green-600">
                        {loading ? "Loading..." : "Connected"}
                    </h2>
                </div>
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            {loading ? (
                <div className="rounded-xl bg-white p-10 text-center">
                    Loading vehicle locations...
                </div>
            ) : locations.length === 0 ? (
                <div className="rounded-xl bg-white p-10 text-center text-gray-500">
                    No active vehicle locations available.
                </div>
            ) : (
                <AdminLiveTrackingMap locations={locations} />
            )}
        </div>
    );
};

export default LiveTracking;
