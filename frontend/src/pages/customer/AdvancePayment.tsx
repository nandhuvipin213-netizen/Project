import api from "../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Package, IndianRupee, ArrowLeft } from "lucide-react";

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

function AdvancePayment() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const shipment = state?.shipment;

    if (!shipment) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold">
                    Shipment details not found
                </h2>
                <button
                    onClick={() => navigate("/customer/book-shipment")}
                    className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white"
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

    return (
        <div className="mx-auto max-w-3xl p-6">
            <button
                onClick={() => navigate("/customer/dashboard")}
                className="mb-6 flex items-center gap-2 text-slate-500"
            >
                <ArrowLeft size={18} />
                Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold text-slate-800">
                Advance Payment
            </h1>

            <p className="mt-2 text-slate-500">
                Review your shipment details and advance amount.
            </p>

            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-semibold">
                    Shipment Details
                </h2>

                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <MapPin className="text-green-600" />
                        <div>
                            <p className="text-sm text-slate-500">Pickup</p>
                            <p className="font-medium">{shipment.pickupAddress}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="text-red-600" />
                        <div>
                            <p className="text-sm text-slate-500">Delivery</p>
                            <p className="font-medium">{shipment.deliveryAddress}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Package className="text-blue-600" />
                        <div>
                            <p className="text-sm text-slate-500">Goods Type</p>
                            <p className="font-medium">{shipment.goodsType}</p>
                        </div>
                    </div>
                </div>

                <hr className="my-6" />

                <h2 className="mb-4 text-xl font-semibold">
                    Advance Payment Breakdown
                </h2>

                <div className="space-y-3 text-slate-600">
                    <div className="flex justify-between">
                        <span>Distance</span>
                        <span>{shipment.distanceKm} km</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Advance Rate</span>
                        <span>₹{shipment.advanceRatePerKm} / km</span>
                    </div>

                    <div className="flex justify-between border-t pt-4 text-lg font-bold text-slate-800">
                        <span>Advance Amount</span>
                        <span>₹{Number(shipment.advanceAmount).toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
                >
                    <IndianRupee size={18} />
                    Pay Advance
                </button>

                <p className="mt-3 text-center text-xs text-slate-500">
                    Online payment will be enabled in the next step.
                </p>
            </div>
        </div>
    );
}

export default AdvancePayment;
