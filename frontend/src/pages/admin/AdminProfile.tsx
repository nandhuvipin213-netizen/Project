import { useEffect, useState } from "react";
import api from "../../services/Api";

interface Admin {
  name: string;
  email: string;
  phone: string;
}

function AdminProfile() {
  const [admin, setAdmin] = useState<Admin>({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        const user = response.data.user || response.data;

        setAdmin({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Unable to load admin profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await api.put("/auth/profile", admin);

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Unable to update profile. Please check the API endpoint.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="text-[#20213a]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your account information
        </p>
      </div>

      <div className="max-w-2xl rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
            {admin.name.charAt(0).toUpperCase() || "A"}
          </div>

          <div>
            <h2 className="break-words text-lg font-semibold">{admin.name}</h2>
            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>

        {message && (
          <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Full Name</label>
            <input
              name="name"
              value={admin.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={admin.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Phone</label>
            <input
              name="phone"
              value={admin.phone}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-medium sm:w-auto text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminProfile;