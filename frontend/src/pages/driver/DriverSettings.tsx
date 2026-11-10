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
        <div className="space-y-6">
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                    Driver Workspace
                </p>

                <h1 className="mt-2 text-2xl font-extrabold text-slate-800">
                    Settings
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Manage your account and security preferences.
                </p>
            </div>
            {/* Change Password */}
            <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800">
                    Change Password
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Update your account password regularly to keep your account secure.
                </p>

                <form onSubmit={handlePasswordChange} className="mt-6 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            required
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DriverSettings;