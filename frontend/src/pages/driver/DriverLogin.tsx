import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Truck,
    Mail,
    Lock,
    Eye,
    EyeOff,
    MapPin,
    ShieldCheck,
    ArrowRight,
} from "lucide-react";
import axios from "axios";
import api from "../../services/Api";

interface DriverLoginProps {
    onLoginSuccess?: () => void;
}

function DriverLogin({ onLoginSuccess }: DriverLoginProps) {


    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email: email.trim().toLowerCase(),
                password,
            });

            const { token, user } = response.data;

            // Only driver accounts can access the Driver Portal.
            if (user?.role !== "driver") {
                setError("Access denied. Only drivers can log in here.");
                return;
            }

            if (!token) {
                setError("Authentication token was not received.");
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));


            // Notify the protected route that login succeeded
            onLoginSuccess?.();

            // Check whether the driver must change the temporary password
            if (user.mustChangePassword) {
                navigate("/driver/change-password", { replace: true });
            } else {
                navigate("/driver/dashboard", { replace: true });
            }

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                    "Login failed. Please try again."
                );
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f5f4fb] p-4 sm:p-6">

            <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-violet-100 lg:grid-cols-2">

                {/* Left Section */}
                <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#171936] via-[#252451] to-[#493b87] p-10 text-white lg:flex">

                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
                    <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

                    {/* Logo */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-500">
                            <Truck className="h-7 w-7 text-white" />
                        </div>

                        <div>
                            <h1 className="text-xl font-extrabold tracking-wide">
                                SMART<span className="text-violet-400">LOGISTICS.</span>
                            </h1>
                            <p className="text-xs text-slate-300">
                                Fleet Management Platform
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 my-12">
                        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-white/10 px-4 py-2 text-xs font-semibold text-violet-200">
                            <MapPin className="h-4 w-4" />
                            DRIVER WORKSPACE
                        </p>

                        <h2 className="max-w-md text-4xl font-extrabold leading-tight xl:text-5xl">
                            Every Delivery.
                            <span className="block text-violet-400">
                                Every Mile.
                            </span>
                            Under Control.
                        </h2>

                        <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
                            Access your assigned shipments, manage delivery schedules,
                            navigate routes and keep track of your daily activities
                            from one simple dashboard.
                        </p>

                        <div className="mt-10 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
                                    <Truck className="h-5 w-5 text-violet-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Manage Shipments</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        View your assigned deliveries
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
                                    <MapPin className="h-5 w-5 text-violet-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Navigate Your Routes</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Find pickup and delivery locations
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
                                    <ShieldCheck className="h-5 w-5 text-violet-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Secure Access</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Protected driver account
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="relative z-10 text-xs text-slate-400">
                        © 2026 Smart Logistics. All rights reserved.
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-14">

                    <div className="w-full max-w-md">

                        {/* Mobile Logo */}
                        <div className="mb-10 flex items-center gap-3 lg:hidden">
                            <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-600">
                                <Truck className="h-6 w-6 text-white" />
                            </div>

                            <h1 className="text-lg font-extrabold text-slate-800">
                                SMART<span className="text-violet-600">LOGISTICS.</span>
                            </h1>
                        </div>

                        <div className="mb-8">
                            <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-violet-700">
                                <Truck className="h-7 w-7" />
                            </div>

                            <p className="text-sm font-bold uppercase tracking-[0.15em] text-violet-600">
                                Driver Portal
                            </p>

                            <h2 className="mt-2 text-3xl font-extrabold text-[#20213a]">
                                Welcome Back!
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Sign in to access your driver account and manage your deliveries.
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        autoComplete="username"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-violet-600"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
                                    {error}
                                </div>
                            )}

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                                {!loading && <ArrowRight className="h-4 w-4" />}
                            </button>
                        </form>

                        {/* Account Information */}
                        <div className="mt-7 rounded-xl bg-violet-50 p-4">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

                                <div>
                                    <p className="text-xs font-bold text-slate-800">
                                        Driver Account Information
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Driver accounts are created by the administrator.
                                        Contact your administrator if you need login credentials.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-7 text-center">
                            <Link
                                to="/"
                                className="text-xs font-semibold text-slate-500 transition hover:text-violet-600"
                            >
                                ← Back to Home
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default DriverLogin;