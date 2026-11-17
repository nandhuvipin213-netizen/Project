import { Link } from "react-router-dom";
import HowItWorks from "../components/HowItWorks";

const features = [
  {
    no: "01",
    title: "Smart Vehicle Assignment",
    text: "Matches every shipment with the right vehicle and driver based on capacity and availability.",
    color: "bg-blue-500",
  },
  {
    no: "02",
    title: "Route Optimization",
    text: "Organizes multiple deliveries into efficient sequences that respect distance and deadlines.",
    color: "bg-cyan-500",
  },
  {
    no: "03",
    title: "Empty Return Matching",
    text: "Finds return shipments for vehicles that would otherwise travel back empty.",
    color: "bg-amber-500",
  },
  {
    no: "04",
    title: "Live Tracking & ETA",
    text: "Managers and customers follow every delivery in real time with accurate arrival estimates.",
    color: "bg-indigo-500",
  },
];

const stats = [
  { value: "Less", label: "Empty trips" },
  { value: "Faster", label: "Deliveries" },
  { value: "Real-time", label: "Tracking" },
  { value: "Better", label: "Fleet utilization" },
];

function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden">

        {/* Animated truck + crane background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('truck-hero.svg')" }}
        />

        {/* Overlay: dark on the left for the text, light on the right so the scene shows */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-slate-950/10" />

        {/* Fade into the next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />

        <div className="relative mx-auto grid min-h-[75vh] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:min-h-[85vh] lg:grid-cols-2 lg:gap-12">

          {/* Left: Text */}
          <div className="text-center lg:text-left">

            <p className="mb-5 inline-block rounded-full border border-blue-400/30 bg-slate-950/50 px-4 py-2 text-xs tracking-widest text-blue-300 backdrop-blur sm:px-5 sm:text-sm">
              SMART FLEET MANAGEMENT PLATFORM
            </p>

            <h1 className="text-3xl font-bold leading-tight tracking-tight drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
              Smarter Logistics.
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Faster Deliveries.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8 lg:mx-0 lg:mt-6 lg:max-w-lg">
              Manage your fleet, optimize delivery routes, and track shipments
              in one powerful platform designed to make logistics easier.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4 lg:mt-10 lg:justify-start">

              <Link
                to="/login"
                className="rounded-lg border border-blue-400 bg-slate-950/40 px-8 py-3 text-center font-semibold text-blue-300 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/customer/register"
                className="rounded-lg bg-amber-500 px-8 py-3 text-center font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-amber-400"
              >
                Register
              </Link>

            </div>
          </div>
       
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500">

        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 px-4 py-8 text-center sm:gap-6 sm:px-6 sm:py-10 md:grid-cols-4">

          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-xl font-bold sm:text-2xl md:text-3xl">
                {s.value}
              </p>

              <p className="mt-1 text-xs text-blue-50/90 sm:text-sm">
                {s.label}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* About + Features Section */}
      <section className="bg-slate-100 text-slate-900">

        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">

          <div className="mx-auto max-w-3xl text-center">

            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              About the{" "}
              <span className="text-blue-600">
                Platform
              </span>
            </h2>

            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-amber-500" />

            <p className="mt-5 text-sm leading-7 text-slate-600 sm:mt-6 sm:text-base sm:leading-8">
              Smart Logistics & Fleet Optimization Platform helps businesses
              manage vehicles, drivers, shipments, and deliveries from one
              place. It recommends the right vehicle for each shipment, plans
              efficient routes, reduces empty return trips, and offers
              real-time tracking with ETA, so deliveries are faster and fleets
              are used better.
            </p>

          </div>

          {/* Feature Cards */}
          <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">

            {features.map((f) => (
              <div
                key={f.no}
                className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6"
              >

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white ${f.color}`}
                >
                  {f.no}
                </div>

                <h3 className="mt-5 font-semibold">
                  {f.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {f.text}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Footer CTA */}
      <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">

        <h2 className="text-2xl font-bold sm:text-3xl">
          Ready to optimize your{" "}
          <span className="text-amber-400">
            fleet
          </span>
          ?
        </h2>

        <p className="mt-3 text-sm text-slate-400 sm:text-base">
          Create an account and start managing deliveries smarter.
        </p>

        <Link
          to="/customer/register"
          className="mt-8 inline-block rounded-lg bg-blue-500 px-8 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-blue-600 sm:text-base"
        >
          Get Started
        </Link>

      </section>

    </div>
  );
}

export default Home;