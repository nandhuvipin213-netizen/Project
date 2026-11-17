
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import api from "../../services/Api";

function ChangePassword() {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword.length < 12) {
            setError("New password must contain at least 12 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        try {
            setLoading(true);

            await api.put("/auth/change-password", {
                currentPassword,
                newPassword,
            });

            const savedUser = localStorage.getItem("user");

            if (savedUser) {
                const user = JSON.parse(savedUser);
                user.mustChangePassword = false;
                localStorage.setItem("user", JSON.stringify(user));
            }

            navigate("/driver/dashboard", { replace: true });
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Unable to change password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#f5f4fb] px-3 py-6 sm:px-6 sm:py-10">

            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg sm:p-7 md:p-8">

                {/* Icon */}
                <div className="mb-5 flex justify-center sm:mb-6">
                    <div className="rounded-full bg-violet-100 p-3 sm:p-4">
                        <Lock className="h-7 w-7 text-violet-600 sm:h-8 sm:w-8" />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-center text-xl font-bold text-[#20213a] sm:text-2xl">
                    Change Your Password
                </h1>

                <p className="mx-auto mb-5 mt-2 max-w-sm text-center text-sm leading-6 text-gray-500 sm:mb-6">
                    Please create a new password before accessing your driver dashboard.
                </p>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 break-words rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Temporary Password */}
                    <div className="min-w-0">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Temporary Password
                        </label>

                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                            required
                            autoComplete="current-password"
                            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:px-4 sm:text-base"
                            placeholder="Enter temporary password"
                        />
                    </div>

                    {/* New Password */}
                    <div className="min-w-0">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            New Password
                        </label>

                        <div className="relative min-w-0">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                required
                                autoComplete="new-password"
                                className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 pr-12 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:px-4 sm:text-base"
                                placeholder="Enter new password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-violet-600"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        <p className="mt-1.5 text-xs text-gray-500">
                            Minimum 12 characters.
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div className="min-w-0">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                            autoComplete="new-password"
                            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:px-4 sm:text-base"
                            placeholder="Confirm new password"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                    >
                        {loading ? "Updating..." : "Change Password"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
