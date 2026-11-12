
import { useState, useEffect, type FormEvent } from "react";
import {
    UserPlus,
    Mail,
    Phone,
    User,
    CreditCard,
    MapPin,
    Calendar,
    CheckCircle,
    AlertCircle,
    Search,
    RefreshCw,
} from "lucide-react";

import api from "../../services/Api";

interface Driver {
    _id: string;
    licenseNumber: string;
    licenseExpiryDate: string;
    address: string;
    availabilityStatus: "available" | "on-duty" | "off-duty";
    user: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        isActive: boolean;
    };
}

function ManageDriver() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        licenseNumber: "",
        licenseExpiryDate: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [fetchingDrivers, setFetchingDrivers] = useState(false);


    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

    const [editFormData, setEditFormData] = useState({
        name: "",
        email: "",
        phone: "",
        licenseNumber: "",
        licenseExpiryDate: "",
        address: "",
        availabilityStatus: "available",
    });


    // Fetch all drivers
    const fetchDrivers = async () => {
        try {
            setFetchingDrivers(true);

            const response = await api.get("/drivers");

            setDrivers(response.data.drivers || []);
        } catch (err) {
            console.error("Failed to fetch drivers:", err);
            setError("Failed to load drivers");
        } finally {
            setFetchingDrivers(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    // Handle form input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Create driver
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            setSuccess("");
            setError("");

            const response = await api.post("/drivers", {
                ...formData,
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                licenseNumber: formData.licenseNumber.trim(),
                address: formData.address.trim(),
            });

            setSuccess(response.data.message);

            setFormData({
                name: "",
                email: "",
                phone: "",
                licenseNumber: "",
                licenseExpiryDate: "",
                address: "",
            });

            await fetchDrivers();
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Failed to create driver"
            );
        } finally {
            setLoading(false);
        }
    };

    // Activate / Deactivate driver
    const handleToggleStatus = async (driver: Driver) => {
        try {
            setSuccess("");
            setError("");

            const endpoint = driver.user.isActive
                ? `/drivers/${driver._id}/deactivate`
                : `/drivers/${driver._id}/activate`;

            const response = await api.patch(endpoint);

            setSuccess(response.data.message);

            await fetchDrivers();
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Failed to update driver status"
            );
        }
    };



    // Open edit form
    const handleEditDriver = (driver: Driver) => {
        setEditingDriver(driver);

        setEditFormData({
            name: driver.user?.name || "",
            email: driver.user?.email || "",
            phone: driver.user?.phone || "",
            licenseNumber: driver.licenseNumber || "",
            licenseExpiryDate: driver.licenseExpiryDate
                ? new Date(driver.licenseExpiryDate).toISOString().split("T")[0]
                : "",
            address: driver.address || "",
            availabilityStatus: driver.availabilityStatus || "available",
        });

        setSuccess("");
        setError("");
    };

    // Handle edit form changes
    const handleEditChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setEditFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Save updated driver
    const handleUpdateDriver = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editingDriver) return;

        try {
            setLoading(true);
            setSuccess("");
            setError("");

            const response = await api.put(
                `/drivers/${editingDriver._id}`,
                editFormData
            );

            setSuccess(response.data.message);

            setEditingDriver(null);

            await fetchDrivers();
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Failed to update driver"
            );
        } finally {
            setLoading(false);
        }
    };


    // Search drivers
    const filteredDrivers = drivers.filter((driver) => {
        const search = searchTerm.toLowerCase();

        return (
            driver.user?.name?.toLowerCase().includes(search) ||
            driver.user?.email?.toLowerCase().includes(search) ||
            driver.licenseNumber?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="space-y-8">

            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#20213a]">
                    Driver Management
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Create and manage your delivery drivers.
                </p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    <CheckCircle size={18} />
                    {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* Add Driver Form */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#20213a]">
                        Add New Driver
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Enter the driver's details to create an account.
                        Login credentials will be sent to their email.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Personal Information */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-700">
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-3.5 text-gray-400" />

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        required
                                        className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        required
                                        className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>

                                <div className="relative">
                                    <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        required
                                        className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* License Information */}
                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="mb-4 text-sm font-semibold text-gray-700">
                            License Information
                        </h3>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* License Number */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    License Number
                                </label>

                                <div className="relative">
                                    <CreditCard size={18} className="absolute left-3 top-3.5 text-gray-400" />

                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                        placeholder="Enter license number"
                                        required
                                        className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                    />
                                </div>
                            </div>

                            {/* Expiry Date */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    License Expiry Date
                                </label>

                                <div className="relative">
                                    <Calendar size={18} className="absolute left-3 top-3.5 text-gray-400" />

                                    <input
                                        type="date"
                                        name="licenseExpiryDate"
                                        value={formData.licenseExpiryDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Address */}
                    <div className="border-t border-gray-100 pt-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Residential Address
                        </label>

                        <div className="relative">
                            <MapPin size={18} className="absolute left-3 top-4 text-gray-400" />

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter complete address"
                                required
                                rows={3}
                                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="border-t border-gray-100 pt-5">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60 sm:w-auto"
                        >
                            <UserPlus size={18} />
                            {loading ? "Creating Driver..." : "Create Driver"}
                        </button>
                    </div>

                </form>
            </div>

            {/* Driver List */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">

                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>
                        <h2 className="text-lg font-semibold text-[#20213a]">
                            Registered Drivers
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Total drivers: {drivers.length}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fetchDrivers}
                        disabled={fetchingDrivers}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>

                </div>

                {/* Search */}
                <div className="relative mb-6">

                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by driver name, email or license..."
                        className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-violet-500"
                    />

                </div>

                {/* Loading */}
                {fetchingDrivers ? (
                    <p className="py-8 text-center text-gray-500">
                        Loading drivers...
                    </p>
                ) : filteredDrivers.length === 0 ? (

                    <p className="py-8 text-center text-gray-500">
                        No drivers found.
                    </p>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[850px] text-left">

                            <thead>
                                <tr className="border-b border-gray-100 text-sm text-gray-500">
                                    <th className="px-4 py-3">Driver</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">License</th>
                                    <th className="px-4 py-3">Availability</th>
                                    <th className="px-4 py-3">Account</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredDrivers.map((driver) => (

                                    <tr
                                        key={driver._id}
                                        className="border-b border-gray-50 hover:bg-gray-50"
                                    >

                                        {/* Driver */}
                                        <td className="px-4 py-4">
                                            <p className="font-medium text-[#20213a]">
                                                {driver.user?.name || "Unknown"}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {driver.user?.email}
                                            </p>
                                        </td>

                                        {/* Phone */}
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            {driver.user?.phone || "—"}
                                        </td>

                                        {/* License */}
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-medium text-gray-700">
                                                {driver.licenseNumber}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Expires:{" "}
                                                {new Date(
                                                    driver.licenseExpiryDate
                                                ).toLocaleDateString("en-IN")}
                                            </p>
                                        </td>

                                        {/* Availability */}
                                        <td className="px-4 py-4">
                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                                {driver.availabilityStatus}
                                            </span>
                                        </td>

                                        {/* Account Status */}
                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${driver.user?.isActive
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-red-50 text-red-700"
                                                    }`}
                                            >
                                                {driver.user?.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>

                                        {/* Action */}

                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Edit Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditDriver(driver)}
                                                    className="rounded-lg bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-200"
                                                >
                                                    Edit
                                                </button>

                                                {/* Activate / Deactivate */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(driver)}
                                                    className={`rounded-lg px-4 py-2 text-sm font-medium ${driver.user.isActive
                                                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                                        }`}
                                                >
                                                    {driver.user.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                            </div>
                                        </td>


                                    </tr>

                                ))}
                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* Edit Driver Modal */}
            {editingDriver && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

                        {/* Modal Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-[#20213a]">
                                    Edit Driver
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Update driver information
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setEditingDriver(null)}
                                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Edit Form */}
                        <form onSubmit={handleUpdateDriver} className="space-y-5">

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                {/* Name */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleEditChange}
                                        required
                                        className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editFormData.email}
                                        onChange={handleEditChange}
                                        required
                                        className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editFormData.phone}
                                        onChange={handleEditChange}
                                        required
                                        className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500"
                                    />
                                </div>

                                {/* License Number */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        License Number
                                    </label>
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        value={editFormData.licenseNumber}
                                        onChange={handleEditChange}
                                        required
                                        className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500"
                                    />
                                </div>

                                {/* Expiry Date */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        License Expiry Date
                                    </label>
                                    <input
                                        type="date"
                                        name="licenseExpiryDate"
                                        value={editFormData.licenseExpiryDate}
                                        onChange={handleEditChange}
                                        required
                                        className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500"
                                    />
                                </div>

                                {/* Availability */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Availability Status
                                    </label>
                                    <select
                                        name="availabilityStatus"
                                        value={editFormData.availabilityStatus}
                                        onChange={handleEditChange}
                                        className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500"
                                    >
                                        <option value="available">Available</option>
                                        <option value="on-duty">On Duty</option>
                                        <option value="off-duty">Off Duty</option>
                                    </select>
                                </div>

                            </div>

                            {/* Address */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Residential Address
                                </label>
                                <textarea
                                    name="address"
                                    value={editFormData.address}
                                    onChange={handleEditChange}
                                    required
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

                                <button
                                    type="button"
                                    onClick={() => setEditingDriver(null)}
                                    className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}


        </div>
    );
}

export default ManageDriver;
