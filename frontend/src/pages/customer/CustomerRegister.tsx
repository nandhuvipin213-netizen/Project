import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleLogin,
  type CredentialResponse,
} from "@react-oauth/google";
import api from "../../services/Api";
import axios from "axios";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  Truck,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  Loader2,
} from "lucide-react";

// Password strength (display only): 0 to 4
function getPasswordStrength(value: string) {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = [
  "bg-slate-200",
  "bg-red-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-emerald-500",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

function CustomerRegister() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Normal customer registration
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Password does not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
      });

      setSuccess(response.data.message || "Registration successful");

      setTimeout(() => {
        navigate("/customer/login");
      }, 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google sign-up
  const handleGoogleSuccess = async (res: CredentialResponse) => {
    if (!res.credential) {
      setError("Google sign-up failed.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await api.post("/auth/google", {
        credential: res.credential,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        setError("Invalid response from server.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/customer/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Google sign-up failed. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsDiffer = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="min-h-dvh bg-slate-50 lg:grid lg:grid-cols-2">

      {/* Brand panel (desktop) */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-[#0b1f4a] to-blue-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl" />

        {/* decorative route */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
          viewBox="0 0 400 600"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            d="M-20 120 C 140 80, 260 200, 420 150 M-20 300 C 120 360, 280 240, 420 330 M-20 480 C 160 420, 240 540, 420 500"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="6 10"
          />
        </svg>

        <div className="relative">
          <img
            src="/logo-full.svg"
            alt="Smart Logistics"
            className="h-14 w-auto max-w-[260px] object-contain"
          />
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            Ship smarter.
            <br />
            <span className="text-teal-300">Track every mile.</span>
          </h2>
          <p className="mt-4 text-blue-100/80">
            Create your free account to book shipments, follow your delivery
            live, and manage payments in one place.
          </p>

          <ul className="mt-10 space-y-5">
            {[
              {
                icon: <Truck size={20} />,
                title: "Book in minutes",
                text: "Schedule pickups and get an instant cost estimate.",
              },
              {
                icon: <MapPin size={20} />,
                title: "Live tracking",
                text: "See your driver's location on the map in real time.",
              },
              {
                icon: <ShieldCheck size={20} />,
                title: "Secure payments",
                text: "Pay your advance safely and download receipts anytime.",
              },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-teal-300 ring-1 ring-white/15">
                  {item.icon}
                </span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-blue-100/70">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-blue-100/50">
          © {new Date().getFullYear()} Smart Logistics
        </p>
      </aside>

      {/* Form side */}
      <main className="flex items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-md">

          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          {/* Logo (mobile only, the brand panel shows it on desktop) */}
          <div className="mb-6 lg:hidden">
            <img
              src="/logo-full.svg"
              alt="Smart Logistics"
              className="h-12 w-auto max-w-[240px] object-contain"
            />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-slate-500">
            Register to manage and track your shipments.
          </p>

          {/* Google Sign-Up */}
          <div className="mt-7 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-up failed.")}
              theme="outline"
              text="continue_with"
              shape="pill"
            />
          </div>

          {/* OR divider */}
          <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            or register with email
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Registration form */}
          <form onSubmit={handleRegister} className="space-y-4">

            <Field label="Full name" icon={<User size={18} />}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Email address" icon={<Mail size={18} />}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Phone number" icon={<Phone size={18} />}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                autoComplete="tel"
                required
                className={inputClass}
              />
            </Field>

            <div>
              <Field label="Password" icon={<Lock size={18} />}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </Field>

              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <span
                        key={bar}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          strength >= bar ? STRENGTH_COLORS[strength] : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Strength:{" "}
                    <span className="font-semibold text-slate-700">
                      {STRENGTH_LABELS[strength]}
                    </span>
                    {strength < 4 && " · use 8+ characters, upper and lower case, numbers and symbols"}
                  </p>
                </div>
              )}
            </div>

            <div>
              <Field label="Confirm password" icon={<Lock size={18} />}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  className={`${inputClass} pr-12 ${
                    passwordsDiffer
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </Field>

              {passwordsMatch && (
                <p className="mt-1.5 text-xs font-medium text-emerald-600">
                  Passwords match
                </p>
              )}
              {passwordsDiffer && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  Passwords do not match yet
                </p>
              )}
            </div>

            {/* Error message */}
            {error && (
              <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Success message */}
            {success && (
              <p className="rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
                {success}
              </p>
            )}

            {/* Register button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/customer/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default CustomerRegister;