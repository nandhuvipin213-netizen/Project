
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
        <div className="min-h-screen flex items-center justify-center bg-[#f5f4fb] px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-violet-100 p-4">
                        <Lock className="h-8 w-8 text-violet-600" />
                    </div>
                </div>

                <h1 className="text-center text-2xl font-bold text-[#20213a]">
                    Change Your Password
                </h1>

                <p className="mt-2 mb-6 text-center text-sm text-gray-500">
                    Please create a new password before accessing your driver dashboard.
                </p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Temporary Password
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-violet-500"
                            placeholder="Enter temporary password"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-violet-500"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Minimum 12 characters.
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-violet-500"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
                    >
                        {loading ? "Updating..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
