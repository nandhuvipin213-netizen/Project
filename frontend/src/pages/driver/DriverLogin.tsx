
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

      onLoginSuccess?.();

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
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f4fb] p-3 sm:p-5 lg:p-6">

      <div className="grid w-full max-w-6xl min-w-0 overflow-hidden rounded-2xl bg-white shadow-xl shadow-violet-100 sm:rounded-3xl lg:grid-cols-2">

        {/* Left Section - Desktop */}
        <div className="relative hidden min-w-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#171936] via-[#252451] to-[#493b87] p-8 text-white lg:flex xl:p-10">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

          {/* Logo */}
          <div className="relative z-10">
            <img
              src="/logo-full.svg"
              alt="Smart Logistics"
              className="h-14 w-auto max-w-[240px] object-contain"
            />

            <p className="mt-2 text-xs text-slate-300">
              Fleet Management Platform
            </p>
          </div>

          {/* Main Content */}
          <div className="relative z-10 my-10 xl:my-12">

            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-white/10 px-4 py-2 text-xs font-semibold text-violet-200">
              <MapPin className="h-4 w-4 shrink-0" />
              DRIVER WORKSPACE
            </p>

            <h2 className="max-w-md text-3xl font-extrabold leading-tight xl:text-5xl">
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

            <div className="mt-8 space-y-5 xl:mt-10">

              <div className="flex items-center gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
                  <Truck className="h-5 w-5 text-violet-300" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold">
                    Manage Shipments
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    View your assigned deliveries
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
                  <MapPin className="h-5 w-5 text-violet-300" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold">
                    Navigate Your Routes
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Find pickup and delivery locations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
                  <ShieldCheck className="h-5 w-5 text-violet-300" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold">
                    Secure Access
                  </p>

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

        {/* Right Section - Login Form */}
        <div className="flex min-w-0 items-center justify-center px-4 py-8 sm:px-8 sm:py-10 md:px-12 lg:px-8 lg:py-12 xl:px-14">

          <div className="w-full min-w-0 max-w-md">

            {/* Mobile Logo */}
            <div className="mb-7 flex items-center sm:mb-10 lg:hidden">
              <img
                src="/logo-full.svg"
                alt="Smart Logistics"
                className="h-12 w-auto max-w-[220px] object-contain"
              />
            </div>

            {/* Heading */}
            <div className="mb-7 sm:mb-8">

              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-violet-700 sm:mb-5 sm:h-14 sm:w-14">
                <Truck className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-violet-600 sm:text-sm">
                Driver Portal
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-[#20213a] sm:text-3xl">
                Welcome Back!
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sign in to access your driver account and manage your deliveries.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

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
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
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
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
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
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="break-words rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
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
            <div className="mt-6 rounded-xl bg-violet-50 p-3 sm:mt-7 sm:p-4">

              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

                <div className="min-w-0">
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

            {/* Back to Home */}
            <div className="mt-6 text-center sm:mt-7">
              <Link
                to="/"
                className="inline-block py-2 text-xs font-semibold text-slate-500 transition hover:text-violet-600"
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
