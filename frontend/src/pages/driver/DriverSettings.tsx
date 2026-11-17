
import { useState } from "react";
import axios from "axios";
import api from "../../services/Api";

function DriverSettings() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }

        if (newPassword.length < 12) {
            setError("New password must contain at least 12 characters.");
            return;
        }

        try {
            setLoading(true);

            await api.put("/auth/change-password", {
                currentPassword,
                newPassword,
            });

            setMessage("Password updated successfully.");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                    "Unable to update password."
                );
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-w-0 space-y-5 sm:space-y-6">
            {/* Page Heading */}
            <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                    Driver Workspace
                </p>

                <h1 className="mt-2 text-xl font-extrabold text-slate-800 sm:text-2xl">
                    Settings
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Manage your account and security preferences.
                </p>
            </div>

            {/* Change Password */}
            <div className="min-w-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                    Change Password
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    Update your account password regularly to keep your account secure.
                </p>

                <form
                    onSubmit={handlePasswordChange}
                    className="mt-5 max-w-2xl space-y-5 sm:mt-6"
                >
                    <div className="min-w-0">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Current Password
                        </label>

                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            required
                            autoComplete="current-password"
                            className="w-full min-w-0 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:px-4"
                        />
                    </div>

                    <div className="min-w-0">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            New Password
                        </label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                            minLength={12}
                            autoComplete="new-password"
                            className="w-full min-w-0 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:px-4"
                        />
                        <p className="mt-1 text-xs text-slate-400">
                            Minimum 12 characters.
                        </p>
                    </div>

                    <div className="min-w-0">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                            minLength={12}
                            autoComplete="new-password"
                            className="w-full min-w-0 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:px-4"
                        />
                    </div>

                    {error && (
                        <p className="break-words rounded-lg bg-rose-50 p-3 text-sm text-rose-600">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="break-words rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DriverSettings;
