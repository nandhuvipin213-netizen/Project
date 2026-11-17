
import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import api from "../../services/Api";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  IdCard,
  Calendar,
  Pencil,
  Save,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";

interface DriverProfileData {
  _id: string;
  user: {
    name: string;
    email: string;
    phone?: string;
    role: string;
  };
  licenseNumber: string;
  licenseExpiryDate: string;
  address: string;
  availabilityStatus: string;
}

interface DriverProfileResponse {
  success: boolean;
  message?: string;
  driver: DriverProfileData;
}

interface DriverProfileForm {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  address: string;
}

function DriverProfile() {
  const [driver, setDriver] = useState<DriverProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<DriverProfileForm>({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    address: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<DriverProfileResponse>(
        "/drivers/my-profile"
      );

      const profile = response.data.driver;

      setDriver(profile);

      setFormData({
        name: profile.user.name || "",
        email: profile.user.email || "",
        phone: profile.user.phone || "",
        licenseNumber: profile.licenseNumber || "",
        licenseExpiryDate: profile.licenseExpiryDate
          ? new Date(profile.licenseExpiryDate).toISOString().split("T")[0]
          : "",
        address: profile.address || "",
      });
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    if (!driver) return;

    setFormData({
      name: driver.user.name || "",
      email: driver.user.email || "",
      phone: driver.user.phone || "",
      licenseNumber: driver.licenseNumber || "",
      licenseExpiryDate: driver.licenseExpiryDate
        ? new Date(driver.licenseExpiryDate).toISOString().split("T")[0]
        : "",
      address: driver.address || "",
    });

    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (!driver) return;

    setFormData({
      name: driver.user.name || "",
      email: driver.user.email || "",
      phone: driver.user.phone || "",
      licenseNumber: driver.licenseNumber || "",
      licenseExpiryDate: driver.licenseExpiryDate
        ? new Date(driver.licenseExpiryDate).toISOString().split("T")[0]
        : "",
      address: driver.address || "",
    });

    setError("");
    setIsEditing(false);
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.licenseNumber.trim() ||
      !formData.licenseExpiryDate ||
      !formData.address.trim()
    ) {
      setError("Please fill in all profile fields.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put<DriverProfileResponse>(
        "/drivers/my-profile",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          licenseNumber: formData.licenseNumber.trim(),
          licenseExpiryDate: formData.licenseExpiryDate,
          address: formData.address.trim(),
        }
      );

      const updatedDriver = response.data.driver;

      setDriver(updatedDriver);

      setFormData({
        name: updatedDriver.user.name || "",
        email: updatedDriver.user.email || "",
        phone: updatedDriver.user.phone || "",
        licenseNumber: updatedDriver.licenseNumber || "",
        licenseExpiryDate: updatedDriver.licenseExpiryDate
          ? new Date(updatedDriver.licenseExpiryDate)
              .toISOString()
              .split("T")[0]
          : "",
        address: updatedDriver.address || "",
      });

      setIsEditing(false);
      setSuccess(response.data.message || "Profile updated successfully.");

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Unable to update profile. Please try again."
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100";

  const displayValueClass =
    "mt-2 break-words [overflow-wrap:anywhere] font-semibold text-slate-700";

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center gap-2">
        <Loader2 className="animate-spin text-violet-600" size={20} />
        <p className="text-violet-600">Loading profile...</p>
      </div>
    );
  }

  if (error && !driver) {
    return (
      <div className="rounded-xl bg-rose-50 p-4 text-center text-sm text-rose-600 sm:p-5">
        {error}
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="rounded-xl bg-rose-50 p-4 text-center text-sm text-rose-600">
        Driver profile not found.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      {/* Page Heading */}
      <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
            Driver Workspace
          </p>

          <h1 className="mt-2 text-xl font-extrabold text-slate-800 sm:text-2xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View and manage your personal and professional information.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          <CheckCircle size={18} className="shrink-0" />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && driver && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-600">
          {error}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-5 sm:space-y-6">
        {/* Profile Header */}
        <div className="min-w-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex min-w-0 flex-col items-center gap-4 sm:flex-row">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-violet-100 text-2xl font-extrabold text-violet-700 sm:h-20 sm:w-20 sm:text-3xl">
              {driver.user.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 text-center sm:text-left">
              <h2 className="break-words text-lg font-extrabold text-slate-800 sm:text-xl">
                {driver.user.name}
              </h2>

              <p className="mt-1 break-all text-sm text-slate-500">
                {driver.user.email}
              </p>

              <span className="mt-3 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-bold capitalize text-violet-700">
                {driver.availabilityStatus.replace("-", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="min-w-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-800 sm:text-lg">
            <UserRound size={19} className="text-violet-600" />
            Personal Information
          </h2>

          <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div className="min-w-0">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                <UserRound size={14} />
                Full Name
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Enter your full name"
                  required
                />
              ) : (
                <p className={displayValueClass}>{driver.user.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="min-w-0">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                <Mail size={14} />
                Email Address
              </label>

              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Enter your email"
                  required
                />
              ) : (
                <p className={displayValueClass}>{driver.user.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="min-w-0">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                <Phone size={14} />
                Phone Number
              </label>

              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Enter your phone number"
                  required
                />
              ) : (
                <p className={displayValueClass}>
                  {driver.user.phone || "Not provided"}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="min-w-0">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                <MapPin size={14} />
                Address
              </label>

              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={inputClass}
                  placeholder="Enter your address"
                  required
                />
              ) : (
                <p className={displayValueClass}>
                  {driver.address || "Not provided"}
                </p>
              )}
            </div>

            {/* Account Role */}
            <div className="min-w-0">
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
        <div className="min-w-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-800 sm:text-lg">
            <IdCard size={19} className="text-violet-600" />
            Professional Information
          </h2>

          <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
            {/* License Number */}
            <div className="min-w-0">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                <IdCard size={14} />
                License Number
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Enter license number"
                  required
                />
              ) : (
                <p className={displayValueClass}>
                  {driver.licenseNumber}
                </p>
              )}
            </div>

            {/* License Expiry Date */}
            <div className="min-w-0">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                <Calendar size={14} />
                License Expiry Date
              </label>

              {isEditing ? (
                <input
                  type="date"
                  name="licenseExpiryDate"
                  value={formData.licenseExpiryDate}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              ) : (
                <p className={displayValueClass}>
                  {driver.licenseExpiryDate
                    ? new Date(
                        driver.licenseExpiryDate
                      ).toLocaleDateString()
                    : "Not provided"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default DriverProfile;
