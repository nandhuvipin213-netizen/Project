
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, LockKeyhole, Eye, EyeOff } from "lucide-react";
import api from "../../services/Api";

function AdminLogin() {
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
        email,
        password,
      });

      const { token, user } = response.data;

      // Only admin accounts can enter this portal.
      if (user?.role !== "admin") {
        setError("Access denied. Only administrators can log in here.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/admin/dashboard");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f1effb]">
      {/* Left branding section */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/20">
            <Truck size={24} />
          </div>
          <span className="text-xl font-bold tracking-wide">
            SMART LOGISTICS.
          </span>
        </div>

        <div className="relative">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-200">
            Administration Portal
          </p>
          <h1 className="text-4xl font-bold leading-tight">
            Manage your fleet.
            <br />
            Deliver smarter.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-violet-100">
            Monitor vehicles, manage drivers, organize shipments and keep
            your logistics operations running smoothly.
          </p>
        </div>

        <p className="relative text-xs text-violet-200">
          © {new Date().getFullYear()} Smart Logistics. All rights reserved.
        </p>
      </div>

      {/* Login form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md rounded-3xl border border-white bg-white p-7 shadow-xl shadow-violet-100/70 sm:p-10">
          <div className="mb-8">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-violet-700">
              <LockKeyhole size={23} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
              Admin Access
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#24233d]">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your administration dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-violet-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in to Admin Portal"}
            </button>
          </form>

          <p className="mt-7 text-center text-xs text-slate-400">
            Authorized administrators only
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
