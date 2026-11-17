import { Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";

function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#0a0f1d] px-4 py-16 text-white sm:px-6 sm:py-20 md:py-24 lg:px-20 lg:py-28"
    >
      {/* Background Glow Effects */}
      <div className="pointer-events-none absolute -right-20 top-1/4 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px] sm:right-10 sm:h-[450px] sm:w-[450px] sm:blur-[130px]" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-[100px] sm:bottom-10 sm:left-10 sm:h-[450px] sm:w-[450px] sm:blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12 md:mb-16">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 shadow-inner shadow-blue-500/20">

            <span className="h-2 w-2 animate-ping rounded-full bg-blue-400" />

            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              Get In Touch
            </span>

          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-100 sm:text-4xl md:text-5xl lg:text-6xl">
            Let's Discuss Your

            <br className="hidden sm:block" />

            <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200 bg-clip-text text-transparent">
              Logistics Solutions
            </span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base md:text-lg">
            Have questions about smart fleet tracking, route optimization,
            or platform integration? We'd love to hear from you.
          </p>

        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-10">

          {/* Contact Information */}
          <div className="space-y-5 lg:col-span-5 lg:space-y-6">

            <div className="relative overflow-hidden rounded-2xl border border-blue-900/40 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-blue-950/30 p-5 backdrop-blur-xl sm:rounded-3xl sm:p-7 lg:p-8">

              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

              <div className="relative">

                <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl">
                  Contact Information
                </h3>

                <p className="mb-7 text-sm leading-6 text-slate-400 sm:mb-8 sm:leading-relaxed">
                  Reach out directly via channels below, or fill out the
                  form to request more details about our MERN stack platform.
                </p>

                {/* Contact Details */}
                <div className="space-y-6">

                  {/* Email */}
                  <div className="group flex min-w-0 items-center gap-3 sm:gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 transition-all group-hover:scale-110 group-hover:border-blue-500/40 sm:h-12 sm:w-12 sm:rounded-2xl">
                      <Mail className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
                        Email Us
                      </p>

                      <p className="break-all text-sm font-medium text-slate-200 sm:text-base">
                        support@smartlogistics.com
                      </p>
                    </div>

                  </div>

                  {/* Phone */}
                  <div className="group flex items-center gap-3 sm:gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 transition-all group-hover:scale-110 group-hover:border-blue-500/40 sm:h-12 sm:w-12 sm:rounded-2xl">
                      <Phone className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
                        Call Us
                      </p>

                      <p className="text-sm font-medium text-slate-200 sm:text-base">
                        +91 98765 43210
                      </p>
                    </div>

                  </div>

                  {/* Location */}
                  <div className="group flex items-center gap-3 sm:gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 transition-all group-hover:scale-110 group-hover:border-blue-500/40 sm:h-12 sm:w-12 sm:rounded-2xl">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
                        Location
                      </p>

                      <p className="text-sm font-medium text-slate-200 sm:text-base">
                        Kerala, India
                      </p>
                    </div>

                  </div>

                </div>

                {/* Support Badge */}
                <div className="mt-7 flex items-start gap-2 border-t border-slate-800/80 pt-5 text-xs font-medium leading-5 text-blue-400 sm:mt-8 sm:items-center">

                  <Sparkles size={15} className="mt-0.5 shrink-0 sm:mt-0" />

                  <span>
                    24/7 Fleet Management Support Available
                  </span>

                </div>

              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you! Your message has been submitted.");
              }}
              className="relative space-y-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-xl sm:space-y-6 sm:rounded-3xl sm:p-7 lg:p-10"
            >

              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl" />

              <div className="relative">

                {/* Name */}
                <div>
                  <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-slate-300">
                    Your Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-[#070b16] px-4 py-3.5 text-base text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base"
                  />
                </div>

                {/* Email */}
                <div className="mt-5 sm:mt-6">
                  <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-slate-300">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="name@company.com"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-[#070b16] px-4 py-3.5 text-base text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base"
                  />
                </div>

                {/* Message */}
                <div className="mt-5 sm:mt-6">
                  <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-slate-300">
                    Message
                  </label>

                  <textarea
                    rows={4}
                    placeholder="Tell us about your logistics inquiry or project feedback..."
                    required
                    className="w-full resize-none rounded-xl border border-slate-800 bg-[#070b16] px-4 py-3.5 text-base text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-600/40 active:scale-[0.99] sm:mt-6 sm:rounded-2xl sm:py-4 sm:text-base"
                >
                  <Send
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />

                  Send Message
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Contact;