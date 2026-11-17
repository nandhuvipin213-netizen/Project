
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import api from "../services/Api";

function CommonLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        setError("Invalid login response from server.");
        return;
      }

      // Store authentication details
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "driver") {
        if (user.mustChangePassword === true) {
          navigate("/driver/change-password");
        } else {
          navigate("/driver/dashboard");
        }
      } else if (user.role === "customer") {
        navigate("/customer/dashboard");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("Invalid user role.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-950 px-4 py-8 text-white sm:py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-8">

        {/* Logo and heading */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-5 flex justify-center">
            <img
              src="/logo-full.svg"
              alt="Smart Logistics"
              className="h-14 w-auto max-w-[240px] object-contain"
            />
          </div>

          <h2 className="text-xl font-semibold sm:text-2xl">
            Welcome Back
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your account
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none focus:border-blue-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="mt-2 flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 font-semibold transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LockKeyhole size={18} />
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Registration link */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/customer/register"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Register
          </Link>
        </p>

        {/* Home link */}
        <p className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-slate-400 hover:text-white"
          >
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CommonLogin;
