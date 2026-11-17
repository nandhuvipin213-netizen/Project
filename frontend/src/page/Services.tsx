
import {
  Truck,
  Route,
  MapPin,
  Package,
  BarChart3,
  Clock,
} from "lucide-react";

function Services() {
  const services = [
    {
      icon: Truck,
      title: "Fleet Management",
      description:
        "Manage vehicles, monitor availability, and maintain your fleet efficiently.",
      tile: "bg-blue-500/10 text-blue-400 ring-blue-400/20",
      bar: "bg-blue-500",
      hover: "hover:border-blue-400/50",
    },
    {
      icon: Route,
      title: "Route Optimization",
      description:
        "Find optimized delivery routes to reduce travel distance and transportation costs.",
      tile: "bg-cyan-500/10 text-cyan-400 ring-cyan-400/20",
      bar: "bg-cyan-400",
      hover: "hover:border-cyan-400/50",
    },
    {
      icon: MapPin,
      title: "Live Tracking",
      description:
        "Track delivery vehicles and monitor shipment locations in real time.",
      tile: "bg-amber-500/10 text-amber-400 ring-amber-400/20",
      bar: "bg-amber-500",
      hover: "hover:border-amber-400/50",
    },
    {
      icon: Package,
      title: "Shipment Management",
      description:
        "Create shipments, assign drivers, and manage delivery operations easily.",
      tile: "bg-indigo-500/10 text-indigo-400 ring-indigo-400/20",
      bar: "bg-indigo-500",
      hover: "hover:border-indigo-400/50",
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description:
        "View delivery statistics and analyze fleet performance.",
      tile: "bg-blue-500/10 text-blue-400 ring-blue-400/20",
      bar: "bg-blue-500",
      hover: "hover:border-blue-400/50",
    },
    {
      icon: Clock,
      title: "ETA Management",
      description:
        "Monitor estimated delivery times and keep customers informed.",
      tile: "bg-amber-500/10 text-amber-400 ring-amber-400/20",
      bar: "bg-amber-500",
      hover: "hover:border-amber-400/50",
    },
  ];

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20 md:py-24 lg:px-16"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl sm:h-80 sm:w-[36rem] sm:max-w-full" />

      <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl sm:h-72 sm:w-72" />

      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(96,165,250,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(96,165,250,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 text-center sm:mb-12 md:mb-16">

          <p className="mb-4 inline-block rounded-full border border-blue-400/30 bg-blue-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:px-5">
            Our Services
          </p>

          <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-5xl">
            Everything You Need for{" "}

            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Smarter Logistics
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-amber-500" />

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:mt-6 sm:text-base">
            Our platform provides powerful tools to simplify fleet
            management and improve delivery operations.
          </p>

        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">

          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-black/20 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-6 lg:p-7 lg:hover:-translate-y-2 ${service.hover}`}
              >

                {/* Background Number */}
                <span className="pointer-events-none absolute right-4 top-2 select-none text-5xl font-extrabold text-white/[0.04] transition duration-300 group-hover:text-white/[0.08] sm:right-5 sm:top-3 sm:text-6xl">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Service Icon */}
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ring-1 transition duration-300 group-hover:scale-110 sm:mb-6 sm:h-14 sm:w-14 ${service.tile}`}
                >
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-lg font-semibold sm:text-xl">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
                  {service.description}
                </p>

                {/* Bottom Accent Bar */}
                <span
                  className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full ${service.bar}`}
                />

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default Services;
