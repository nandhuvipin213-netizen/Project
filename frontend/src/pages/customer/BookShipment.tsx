import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Package, MapPin, Calendar, Clock, Truck, ArrowLeft, ShieldAlert } from "lucide-react";
import api from "../../services/Api";


const goodsOptions = ["Electronics", "Furniture", "Food", "Documents", "Clothing", "Machinery"];

const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#0f2557] focus:bg-white focus:ring-4 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

function SectionCard({
    icon,
    title,
    subtitle,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0f2557]">
                    {icon}
                </span>
                <div>
                    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                    <p className="text-xs text-slate-400">{subtitle}</p>
                </div>
            </div>
            {children}
        </section>
    );
}

function BookShipment() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        pickupAddress: "",
        deliveryAddress: "",
        goodsType: "",
        goodsDescription: "",
        packageCount: "1",
        weight: "",
        pickupDate: "",
        pickupTime: "",
        isFragile: false,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/shipments", {
                pickupAddress: formData.pickupAddress,
                deliveryAddress: formData.deliveryAddress,
                goodsType: formData.goodsType,
                weight: formData.weight ? Number(formData.weight) : null,
                goodsDescription: formData.goodsDescription,
                packageCount: Number(formData.packageCount),
                pickupDate: formData.pickupDate,
                pickupTime: formData.pickupTime,
                isFragile: formData.isFragile,
            });

            navigate("/customer/advance-payment", {
                state: {
                    shipment: response.data.shipment,
                },
            });
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to create shipment");
        } finally {
            setLoading(false);
        }
    };

    const summaryRows = [
        { label: "Goods", value: formData.goodsType || "—" },
        { label: "Packages", value: formData.packageCount || "—" },
        { label: "Weight", value: formData.weight ? `${formData.weight} kg` : "Not set" },
        { label: "Pickup date", value: formData.pickupDate || "—" },
        { label: "Pickup time", value: formData.pickupTime || "—" },
    ];

    return (
        <div className="mx-auto max-w-6xl ">
            {/* Header banner */}
            <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2557] to-blue-800 px-6 py-6 text-white shadow-lg shadow-blue-900/20 sm:px-8">
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
                <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10" />
                <div className="relative flex items-center gap-4">
                     
                    <span className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur sm:flex">
                        <Truck className="h-6 w-6" />
                    </span>
                   
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Book a Shipment</h1>
                        <p className="mt-1 text-sm text-blue-50">
                            Enter your shipment details to create a delivery request.
                        </p>
                    </div>
                   
                </div>
            </div>

              <button
                        type="button"
                        onClick={() => navigate("/customer/dashboard")}
                        className="mb-6 flex items-center gap-2 text-slate-500 transition hover:text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </button>
            <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-3">
                {/* ===== Left: form sections ===== */}
                <div className="space-y-5 lg:col-span-2">
                    {/* Route */}
                    <SectionCard
                        icon={<MapPin className="h-5 w-5" />}
                        title="Delivery Information"
                        subtitle="Where should we pick up and deliver?"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>Pickup Address</label>
                                <textarea
                                    name="pickupAddress"
                                    value={formData.pickupAddress}
                                    onChange={handleChange}
                                    placeholder="Enter pickup address"
                                    required
                                    rows={2}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Delivery Address</label>
                                <textarea
                                    name="deliveryAddress"
                                    value={formData.deliveryAddress}
                                    onChange={handleChange}
                                    placeholder="Enter delivery address"
                                    required
                                    rows={2}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                        </div>
                    </SectionCard>

                    {/* Goods */}
                    <SectionCard
                        icon={<Package className="h-5 w-5" />}
                        title="Goods Information"
                        subtitle="Tell us what you are sending"
                    >
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Goods Type</label>
                                <input
                                    type="text"
                                    name="goodsType"
                                    value={formData.goodsType}
                                    onChange={handleChange}
                                    placeholder="Example: Electronics, Furniture"
                                    required
                                    className={inputClass}
                                />
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {goodsOptions.map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setFormData((p) => ({ ...p, goodsType: g }))}
                                            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 transition ${formData.goodsType === g
                                                    ? "bg-[#0f2557] text-white ring-[#0f2557]"
                                                    : "bg-white text-slate-600 ring-slate-200 hover:bg-blue-50 hover:text-[#0f2557]"
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>Number of Packages</label>
                                    <input
                                        type="number"
                                        name="packageCount"
                                        min="1"
                                        required
                                        value={formData.packageCount}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>
                                        Weight (kg) <span className="font-normal normal-case text-slate-400">(optional)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        min="0.1"
                                        step="0.1"
                                        placeholder="If known"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Goods Description <span className="font-normal normal-case text-slate-400">(optional)</span>
                                </label>
                                <textarea
                                    name="goodsDescription"
                                    value={formData.goodsDescription}
                                    onChange={handleChange}
                                    placeholder="Describe your goods..."
                                    required
                                    rows={2}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>

                            {/* Fragile toggle card */}
                            <label
                                className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 transition ${formData.isFragile
                                        ? "border-amber-300 bg-amber-50"
                                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <ShieldAlert
                                        className={`h-5 w-5 ${formData.isFragile ? "text-amber-600" : "text-slate-400"}`}
                                    />
                                    <span>
                                        <span className="block text-sm font-semibold text-slate-800">Fragile goods</span>
                                        <span className="block text-xs text-slate-500">
                                            This shipment needs extra careful handling
                                        </span>
                                    </span>
                                </span>
                                <input
                                    type="checkbox"
                                    name="isFragile"
                                    checked={formData.isFragile}
                                    onChange={handleChange}
                                    className="h-5 w-5 accent-[#0f2557]"
                                />
                            </label>
                        </div>
                    </SectionCard>

                    {/* Schedule */}
                    <SectionCard
                        icon={<Calendar className="h-5 w-5" />}
                        title="Pickup Schedule"
                        subtitle="Choose a date and time that suits you"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>Preferred Pickup Date</label>
                                <input
                                    type="date"
                                    name="pickupDate"
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                    value={formData.pickupDate}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Preferred Pickup Time</label>
                                <input
                                    type="time"
                                    name="pickupTime"
                                    required
                                    value={formData.pickupTime}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </SectionCard>
                </div>

                {/* ===== Right: live summary + submit ===== */}
                <aside className="lg:col-span-1">
                    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
                        <h3 className="text-base font-semibold text-slate-900">Booking Summary</h3>

                        {/* Route preview */}
                        <div className="flex gap-3">
                            <div className="flex flex-col items-center pt-1">
                                <span className="h-3 w-3 rounded-full bg-[#0f2557]" />
                                <span className="my-1 w-px flex-1 border-l-2 border-dashed border-slate-300" />
                                <span className="h-3 w-3 rounded-full bg-amber-500" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-4 text-sm">
                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-slate-400">Pickup</p>
                                    <p className="line-clamp-2 break-words text-slate-800">
                                        {formData.pickupAddress || "Not entered yet"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-slate-400">Delivery</p>
                                    <p className="line-clamp-2 break-words text-slate-800">
                                        {formData.deliveryAddress || "Not entered yet"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <dl className="divide-y divide-slate-100 rounded-2xl bg-slate-50 px-4 text-sm">
                            {summaryRows.map((r) => (
                                <div key={r.label} className="flex items-center justify-between gap-3 py-2.5">
                                    <dt className="text-slate-500">{r.label}</dt>
                                    <dd className="truncate font-medium text-slate-800">{r.value}</dd>
                                </div>
                            ))}
                        </dl>

                        {formData.isFragile && (
                            <p className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                                <ShieldAlert className="h-4 w-4" /> Marked as fragile
                            </p>
                        )}

                        {error && (
                            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0f2557] to-blue-800 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/25 transition hover:from-[#0a1a40] hover:to-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Clock className={`h-4 w-4 ${loading ? "animate-spin" : "hidden"}`} />
                            {loading ? "Booking..." : "Book Shipment"}
                        </button>
                    </div>
                </aside>
            </form>
        </div>
    );
}

export default BookShipment;