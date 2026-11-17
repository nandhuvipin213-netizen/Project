import {
  Package,
  Truck,
  Route,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Create Shipment",
    text: "Enter pickup and delivery details, goods type, weight, and deadline.",
    tile: "bg-blue-500/10 text-blue-400 ring-blue-400/30",
  },
  {
    icon: Truck,
    title: "Smart Vehicle Assignment",
    text: "The system recommends the best vehicle and driver for the load.",
    tile: "bg-cyan-500/10 text-cyan-400 ring-cyan-400/30",
  },
  {
    icon: Route,
    title: "Route Planning",
    text: "Deliveries are organized into an efficient route with ETAs.",
    tile: "bg-amber-500/10 text-amber-400 ring-amber-400/30",
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    text: "Managers and customers follow the trip in real time.",
    tile: "bg-indigo-500/10 text-indigo-400 ring-indigo-400/30",
  },
  {
    icon: CheckCircle2,
    title: "Delivery Confirmation",
    text: "The driver confirms delivery and the status updates instantly.",
    tile: "bg-emerald-500/10 text-emerald-400 ring-emerald-400/30",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 md:py-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[34rem] max-w-full -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-4 inline-block rounded-full border border-blue-400/30 bg-blue-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:px-5">
            How It Works
          </p>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            From Order to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Delivery
            </span>{" "}
            in 5 Steps
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-amber-500" />
        </div>

        {/* Steps */}
        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {/* Connector line (desktop only) */}
          <div className="pointer-events-none absolute left-[10%] right-[10%] top-8 hidden border-t-2 border-dashed border-blue-400/30 lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                // 5 items in 2 columns: center the last one instead of leaving it orphaned
                className="group relative text-center sm:last:col-span-2 lg:last:col-span-1"
              >
                <div
                  className={`relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 ring-1 transition duration-300 group-hover:-translate-y-1 group-hover:scale-110 ${step.tile}`}
                >
                  <Icon className="h-7 w-7" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-slate-950">
                    {index + 1}
                  </span>
                </div>

                <h3 className="mt-5 font-semibold">{step.title}</h3>

                <p className="mx-auto mt-2 max-w-[14rem] text-sm leading-6 text-slate-400">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;