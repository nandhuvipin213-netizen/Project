import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Package, MapPin } from "lucide-react";
import api from "../../services/Api";

function BookShipment() {
    const navigate = useNavigate();
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
        alert(
            error.response?.data?.message ||
            "Failed to create shipment"
        );
    }
};
    return (
        <div className="mx-auto max-w-4xl p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">
                    Book a Shipment
                </h1>
                <p className="mt-2 text-slate-500">
                    Enter your shipment details to create a delivery request.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
                {/* Pickup and delivery */}
                <div>
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <MapPin className="text-blue-600" />
                        Delivery Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block font-medium text-slate-700">
                                Pickup Address
                            </label>
                            <textarea
                                name="pickupAddress"
                                value={formData.pickupAddress}
                                onChange={handleChange}
                                placeholder="Enter pickup address"
                                required
                                rows={3}
                                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-slate-700">
                                Delivery Address
                            </label>
                            <textarea
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleChange}
                                placeholder="Enter delivery address"
                                required
                                rows={3}
                                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-slate-200" />

                {/* Goods details */}
                <div>
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <Package className="text-blue-600" />
                        Goods Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block font-medium text-slate-700">
                                Goods Type
                            </label>
                            <input
                                type="text"
                                name="goodsType"
                                value={formData.goodsType}
                                onChange={handleChange}
                                placeholder="Example: Electronics, Furniture"
                                required
                                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                            />
                        </div>
                        {/* Goods Description */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Goods Description (Optional)
                            </label>
                            <textarea
                                name="goodsDescription"
                                value={formData.goodsDescription}
                                onChange={handleChange}
                                placeholder="Describe your goods..."
                                rows={3}
                                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Package Count */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Number of Packages
                            </label>
                            <input
                                type="number"
                                name="packageCount"
                                min="1"
                                required
                                value={formData.packageCount}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Pickup Date */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Preferred Pickup Date
                            </label>
                            <input
                                type="date"
                                name="pickupDate"
                                min={new Date().toISOString().split("T")[0]}
                                required
                                value={formData.pickupDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Pickup Time */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Preferred Pickup Time
                            </label>
                            <input
                                type="time"
                                name="pickupTime"
                                required
                                value={formData.pickupTime}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block font-medium text-slate-700">
                                Weight (kg) <span className="text-slate-400">(Optional)</span>
                            </label>

                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                min="0.1"
                                step="0.1"
                                placeholder="Enter weight if known"
                                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                            />

                            <p className="mt-1 text-sm text-slate-500">
                                If you don't know the actual weight, you can leave this empty.
                            </p>
                        </div>

                        <label className="flex items-center gap-3 text-slate-700">
                            <input
                                type="checkbox"
                                name="isFragile"
                                checked={formData.isFragile}
                                onChange={handleChange}
                                className="h-4 w-4 accent-blue-600"
                            />
                            This shipment contains fragile goods
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    Book Shipment
                </button>
            </form>
        </div>
    );
}

export default BookShipment;
