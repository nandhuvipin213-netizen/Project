import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../services/Api";

interface DriverProfileData {
  _id: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  licenseNumber: string;
  licenseExpiryDate: string;
  address: string;
  availabilityStatus: string;
}

interface DriverProfileResponse {
  success: boolean;
  driver: DriverProfileData;
}

function DriverProfile() {
  const [driver, setDriver] = useState<DriverProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<DriverProfileResponse>(
          "/drivers/my-profile"
        );

        setDriver(response.data.driver);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
              "Unable to load driver profile."
          );
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
      <p className="text-violet-600">Loading profile...</p>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="rounded-xl bg-rose-50 p-5 text-center text-rose-600">
        {error || "Driver profile not found."}
      </div>
    );
  }


return (
  <div className="space-y-6">
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
        Driver Workspace
      </p>

      <h1 className="mt-2 text-2xl font-extrabold text-slate-800">
        My Profile
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        View your personal and professional information.
      </p>
    </div>

    {/* Profile Header */}
    <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-violet-100 text-3xl font-extrabold text-violet-700">
          {driver.user.name.charAt(0).toUpperCase()}
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-xl font-extrabold text-slate-800">
            {driver.user.name}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {driver.user.email}
          </p>

          <span className="mt-3 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-bold capitalize text-violet-700">
            {driver.availabilityStatus.replace("-", " ")}
          </span>
        </div>
      </div>
    </div>

    {/* Personal Information */}
    <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-slate-800">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Full Name
          </p>
          <p className="mt-2 font-semibold text-slate-700">
            {driver.user.name}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Email Address
          </p>
          <p className="mt-2 font-semibold text-slate-700">
            {driver.user.email}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Address
          </p>
          <p className="mt-2 font-semibold text-slate-700">
            {driver.address}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Account Role
          </p>
          <p className="mt-2 font-semibold capitalize text-slate-700">
            {driver.user.role}
          </p>
        </div>
      </div>
    </div>

    {/* Professional Information */}
    <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-slate-800">
        Professional Information
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            License Number
          </p>
          <p className="mt-2 font-semibold text-slate-700">
            {driver.licenseNumber}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            License Expiry Date
          </p>
          <p className="mt-2 font-semibold text-slate-700">
            {new Date(driver.licenseExpiryDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  </div>
);
}
export default DriverProfile;