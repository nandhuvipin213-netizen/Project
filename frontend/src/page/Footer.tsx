
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-800 bg-slate-950 text-slate-400">

      {/* Background Glow */}
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-[32rem] max-w-full -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Footer Main Content */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-9 px-4 py-10 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-12 md:grid-cols-3 lg:py-14">

        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1">

          <Link to="/" className="inline-flex items-center">
            <img
              src="/logo-full.svg"
              alt="Smart Logistics"
              className="h-14 w-auto max-w-full object-contain"
            />
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-6">
            Manage your fleet, optimize delivery routes, and track shipments
            in one platform built to make logistics easier.
          </p>

        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-4 font-semibold text-white">
            Quick Links
          </h4>

          <ul className="space-y-3 text-sm">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="transition duration-300 hover:text-amber-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-4 font-semibold text-white">
            Contact
          </h4>

          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <span className="break-all">
                support@smartlogistics.com
              </span>
            </li>

            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <span>+91 00000 00000</span>
            </li>

            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <span>Kerala, India</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="relative border-t border-slate-800">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs leading-6 text-slate-500 sm:px-6 sm:text-sm">
          © {new Date().getFullYear()} Smart Logistics & Fleet Optimization
          Platform. All rights reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;
