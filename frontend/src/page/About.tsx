
function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#0a0f1d] px-4 py-16 text-white sm:px-6 sm:py-20 md:py-24 lg:px-20 lg:py-28"
    >
      {/* Background Glow Effects */}
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[140px]" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-indigo-600/10 blur-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-8">

          <div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 shadow-inner shadow-blue-500/20">

              <span className="h-2 w-2 animate-ping rounded-full bg-blue-400" />

              <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                System Overview
              </span>

            </div>

            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-100 sm:text-4xl md:text-5xl lg:text-6xl">
              Transforming Fleet

              <br className="hidden sm:block" />

              <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200 bg-clip-text text-transparent">
                Logistics & Optimization
              </span>
            </h2>

          </div>

          <p className="max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
            A centralized, intelligent platform built to tackle inefficient
            routes, vehicle capacity mismatch, and empty return journeys
            through advanced automation.
          </p>

        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">

          {/* Main Platform Description Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-blue-900/40 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-blue-950/30 p-5 backdrop-blur-xl transition-all duration-500 hover:border-blue-500/40 sm:rounded-3xl sm:p-7 lg:col-span-2 lg:p-10">

            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:bg-blue-500/20 sm:h-64 sm:w-64" />

            <div className="relative">

              <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-blue-400">
                Architecture & Purpose
              </span>

              <h3 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                Centralized Fleet Control System
              </h3>

              <p className="mb-6 text-sm leading-7 text-slate-300 sm:text-base sm:leading-relaxed md:text-lg">
                Smart Logistics & Fleet Optimization Platform is a centralized
                web-based system developed to help businesses manage their
                fleet and delivery operations more efficiently. We address
                common operational challenges such as poor vehicle utilization,
                unnecessary empty trips, inefficient route planning, vehicle
                capacity mismatches, driver availability, and delivery delays.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-2">

                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">
                  Route Optimization
                </span>

                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">
                  Empty Return Matching
                </span>

                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">
                  Load Consolidation
                </span>

                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">
                  Real-Time Tracking
                </span>

              </div>

            </div>
          </div>

          {/* Mission Card */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 sm:rounded-3xl sm:p-7 lg:p-8">

            <div>

              <div className="mb-4 flex items-center justify-between">

                <span className="font-mono text-xs uppercase tracking-widest text-blue-400">
                  01 / Mission
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 transition-transform group-hover:scale-110">
                  ⚡
                </div>

              </div>

              <h3 className="mb-3 text-lg font-bold text-white sm:text-xl">
                Driven By Efficiency
              </h3>

              <p className="text-sm leading-6 text-slate-400">
                To make delivery operations faster, smarter, and more efficient
                by leveraging advanced route optimization, load consolidation,
                and real-time tracking.
              </p>

            </div>

            <div className="mt-6 border-t border-slate-800/80 pt-4 text-xs font-medium text-blue-400">
              Speed & Precision →
            </div>

          </div>

          {/* Vision Card */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 sm:rounded-3xl sm:p-7 lg:p-8">

            <div>

              <div className="mb-4 flex items-center justify-between">

                <span className="font-mono text-xs uppercase tracking-widest text-blue-400">
                  02 / Vision
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 transition-transform group-hover:scale-110">
                  🌐
                </div>

              </div>

              <h3 className="mb-3 text-lg font-bold text-white sm:text-xl">
                Intelligent Ecosystem
              </h3>

              <p className="text-sm leading-6 text-slate-400">
                To provide a reliable and intelligent logistics management
                solution that seamlessly integrates internal fleets, external
                services, and data-driven analytics.
              </p>

            </div>

            <div className="mt-6 border-t border-slate-800/80 pt-4 text-xs font-medium text-blue-400">
              Scalable Control →
            </div>

          </div>

          {/* Goal Card */}
          <div className="group relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 sm:rounded-3xl sm:p-7 md:flex-row md:items-center md:p-8 lg:col-span-2">

            <div className="min-w-0">

              <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-blue-400">
                03 / Core Objective
              </span>

              <h3 className="mb-2 text-lg font-bold text-white sm:text-xl">
                Optimizing Existing Capacity
              </h3>

              <p className="max-w-xl text-sm leading-6 text-slate-400">
                To reduce delivery times, eliminate unnecessary empty journeys,
                and help businesses make optimal use of their existing vehicles.
              </p>

            </div>

            <div className="w-full shrink-0 rounded-2xl border border-blue-500/20 bg-blue-600/10 px-5 py-4 text-center sm:w-auto sm:min-w-36 sm:px-6">

              <span className="block text-2xl font-extrabold text-blue-400">
                100%
              </span>

              <span className="text-xs uppercase tracking-wider text-slate-400">
                Fleet Visibility
              </span>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default About;
