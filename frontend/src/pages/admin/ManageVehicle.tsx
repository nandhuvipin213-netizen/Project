
import { useState, type FormEvent } from "react";
import { UserPlus, Mail, Phone, User, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../services/Api";

function ManageDriver() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const response = await api.post("/auth/create-driver", {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
            });

            setSuccess(
                response.data.message ||
                "Driver account created and login credentials sent successfully!"
            );

            setFormData({
                name: "",
                email: "",
                phone: "",
            });
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Unable to create driver account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f7fc] p-6 md:p-8">

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#20213a]">
                    Driver Management
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Create and manage your delivery drivers.
                </p>
            </div>

            {/* Add Driver Section */}
            <div className="max-w-3xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">

                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-violet-100 p-3">
                        <UserPlus className="h-6 w-6 text-violet-600" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-[#20213a]">
                            Add New Driver
                        </h2>
                        <p className="text-sm text-gray-500">
                            Enter the driver's basic information.
                        </p>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-5 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        <CheckCircle size={18} className="mt-0.5 shrink-0" />
                        <p>{success}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Driver Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Driver Name
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter driver's full name"
                                required
                                minLength={2}
                                maxLength={80}
                                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="driver@example.com"
                                required
                                maxLength={250}
                                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>

                        <div className="relative">
                            <Phone
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
                                maxLength={20}
                                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="border-t border-gray-100 pt-5">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            <UserPlus size={18} />
                            {loading ? "Creating Driver..." : "Create Driver"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default ManageDriver;
