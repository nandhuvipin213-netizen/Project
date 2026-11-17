import api from "../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import {
    MapPin,
    Package,
    IndianRupee,
    ArrowLeft,
    ShieldCheck,
    Truck,
    Scale,
    Route,
    Lock,
} from "lucide-react";

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
    }) => void;
    theme?: {
        color: string;
    };
}

interface RazorpayInstance {
    open: () => void;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

const money = (value: unknown) => `₹${Number(value).toFixed(2)}`;

function AdvancePayment() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const shipment = state?.shipment;

    if (!shipment) {
        return (
            <div className="mx-auto mt-16 max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Package size={26} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                    Shipment details not found
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Start by booking a shipment and we will bring you back here to pay.
                </p>
                <button
                    onClick={() => navigate("/customer/book-shipment")}
                    className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    Book Shipment
                </button>
            </div>
        );
    }

    const handlePayment = async () => {
        try {
            if (!shipment?._id) {
                alert("Shipment details not found");
                return;
            }

            // Step 1: Create Razorpay order through backend
            const response = await api.post("/shipments/advance-order", {
                shipmentId: shipment._id,
            });

            const { order, key } = response.data;

            // Step 2: Configure Razorpay Checkout
            const options: RazorpayOptions = {
                key,
                amount: order.amount,
                currency: order.currency,
                name: "Smart Logistics",
                description: "Shipment Advance Payment",
                order_id: order.id,
                handler: async (paymentResponse) => {
                    try {
                        const verifyResponse = await api.post(
                            "/shipments/verify-advance-payment",
                            {
                                shipmentId: shipment._id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_signature: paymentResponse.razorpay_signature,
                            }
                        );

                        if (verifyResponse.data.success) {
                            alert("Advance payment successful!");

                            navigate("/customer/dashboard");
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        alert(
                            "Payment received, but verification failed. Please contact support."
                        );
                    }
                },

                theme: {
                    color: "#2563eb",
                },
            };

            // Step 3: Open Razorpay payment window
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error("Payment error:", error);
            alert("Unable to start payment. Please try again.");
        }
    };

    const estimatedTotal = shipment.estimatedTotal ?? shipment.advanceAmount;
    const distanceCharge = shipment.distanceCharge ?? shipment.advanceAmount;

    // One receipt row with a dotted leader between label and value
    const Row = ({
        label,
        children,
    }: {
        label: string;
        children: React.ReactNode;
    }) => (
        <div className="flex items-baseline gap-3 text-sm">
            <span className="text-slate-500">{label}</span>
            <span className="min-w-4 flex-1 border-b border-dashed border-slate-200" />
            <span className="text-right font-medium text-slate-800">{children}</span>
        </div>
    );

    const Pending = ({ text = "Pending" }: { text?: string }) => (
        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            {text}
        </span>
    );

    return (
        <div className="mx-auto max-w-5xl">
            <button
                onClick={() => navigate("/customer/dashboard")}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            >
                <ArrowLeft size={16} />
                Back to Dashboard
            </button>

            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Checkout
                </p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    Advance Payment
                </h1>
                <p className="mt-2 max-w-xl text-slate-500">
                    Confirm your route and pay the advance to lock in your booking.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* LEFT COLUMN */}
                <div className="space-y-6 lg:col-span-3">
                    {/* Route card */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-slate-900">Your route</h2>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                <Route size={14} />
                                {Number(shipment.distanceKm).toFixed(2)} km
                            </span>
                        </div>

                        <div className="relative space-y-8 pl-10">
                            {/* vertical dashed line */}
                            <div className="absolute bottom-6 left-[15px] top-6 border-l-2 border-dashed border-slate-300" />

                            <div className="relative">
                                <span className="absolute -left-10 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-white">
                                    <MapPin size={16} />
                                </span>
                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                                    Pickup
                                </p>
                                <p className="mt-0.5 font-medium text-slate-800 [overflow-wrap:anywhere]">
                                    {shipment.pickupAddress}
                                </p>
                            </div>

                            <div className="relative">
                                <span className="absolute -left-10 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600 ring-4 ring-white">
                                    <MapPin size={16} />
                                </span>
                                <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                                    Delivery
                                </p>
                                <p className="mt-0.5 font-medium text-slate-800 [overflow-wrap:anywhere]">
                                    {shipment.deliveryAddress}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                                <Package size={20} />
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs text-slate-500">Goods type</p>
                                <p className="font-semibold text-slate-800 [overflow-wrap:anywhere]">
                                    {shipment.goodsType}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Receipt card */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                        <h2 className="mb-5 text-lg font-bold text-slate-900">
                            Estimated cost breakdown
                        </h2>

                        <div className="space-y-4">
                            <Row label="Distance">
                                {Number(shipment.distanceKm).toFixed(2)} km
                            </Row>

                            <Row label="Distance charge">{money(distanceCharge)}</Row>

                            <Row label="Vehicle type">
                                {shipment.estimatedVehicleType ? (
                                    <span className="inline-flex items-center gap-1.5 capitalize">
                                        <Truck size={14} className="text-slate-400" />
                                        {shipment.estimatedVehicleType}
                                    </span>
                                ) : (
                                    <Pending text="Pending selection" />
                                )}
                            </Row>

                            <Row label="Vehicle rent">
                                {shipment.estimatedVehicleRent != null ? (
                                    money(shipment.estimatedVehicleRent)
                                ) : (
                                    <Pending text="Pending selection" />
                                )}
                            </Row>

                            <Row label="Weight charge">
                                <span className="inline-flex items-center gap-1.5">
                                    <Scale size={14} className="text-slate-400" />
                                    <Pending text="After driver verification" />
                                </span>
                            </Row>
                        </div>

                        <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-900 px-5 py-4 text-white">
                            <span className="text-sm font-medium text-slate-300">
                                Estimated total
                            </span>
                            <span className="text-2xl font-extrabold tracking-tight">
                                {money(estimatedTotal)}
                            </span>
                        </div>

                        {shipment.estimateStatus === "no-suitable-vehicle" && (
                            <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                No currently available vehicle has sufficient weight capacity.
                                Your vehicle selection and final estimate are pending.
                            </p>
                        )}
                    </section>

                    {/* How it works */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                        <h2 className="mb-5 text-lg font-bold text-slate-900">What happens next</h2>
                        <ol className="grid gap-4 sm:grid-cols-3">
                            {[
                                { t: "Pay advance", d: "Secure your booking with the amount shown." },
                                { t: "Weight check", d: "The driver verifies the actual goods weight." },
                                { t: "Pay balance", d: "The remaining amount is calculated and billed." },
                            ].map((step, i) => (
                                <li key={step.t} className="rounded-2xl bg-slate-50 p-4">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                        {i + 1}
                                    </span>
                                    <p className="mt-3 font-semibold text-slate-800">{step.t}</p>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                        {step.d}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </section>
                </div>

                {/* RIGHT COLUMN: pay card (desktop) */}
                <aside className="hidden lg:col-span-2 lg:block">
                    <div className="sticky top-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-blue-700 p-7 text-white shadow-xl">
                        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-indigo-400/20 blur-3xl" />

                        <div className="relative">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                                Pay now
                            </p>

                            <p className="mt-3 flex items-baseline gap-1 text-5xl font-extrabold tracking-tight">
                                {money(shipment.advanceAmount)}
                            </p>

                            <p className="mt-2 text-sm text-blue-100/80">
                                {money(shipment.advanceRatePerKm)} per km advance rate
                            </p>

                            <div className="my-6 border-t border-dashed border-white/20" />

                            <div className="space-y-2 text-sm text-blue-100/90">
                                <div className="flex justify-between">
                                    <span>Estimated total</span>
                                    <span className="font-semibold text-white">
                                        {money(estimatedTotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Balance later</span>
                                    <span className="font-semibold text-white">
                                        After verification
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-blue-700 shadow-lg transition hover:bg-blue-50 active:scale-[0.99]"
                            >
                                <IndianRupee size={18} />
                                Pay Advance
                            </button>

                            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-blue-100/80">
                                <Lock size={12} />
                                Secured by Razorpay
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 flex items-start gap-2 px-2 text-xs leading-relaxed text-slate-500">
                        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                        The final cost may change after the driver verifies the actual goods
                        weight and vehicle assignment.
                    </p>
                </aside>
            </div>

            {/* Mobile pay bar */}
            <div className="sticky bottom-4 mt-6 lg:hidden">
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-900 p-3 pl-5 text-white shadow-2xl">
                    <div>
                        <p className="text-xs text-slate-400">Pay now</p>
                        <p className="text-xl font-extrabold">{money(shipment.advanceAmount)}</p>
                    </div>
                    <button
                        onClick={handlePayment}
                        className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-bold text-white transition hover:bg-blue-400"
                    >
                        <IndianRupee size={16} />
                        Pay Advance
                    </button>
                </div>
                <p className="mt-3 text-center text-xs text-slate-500">
                    The final cost may change after the driver verifies the goods weight.
                </p>
            </div>
        </div>
    );
}

export default AdvancePayment;