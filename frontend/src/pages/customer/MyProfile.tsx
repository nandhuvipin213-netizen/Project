
import { useEffect, useState } from "react";
import { User, Mail, Phone, Lock, Save } from "lucide-react";
import api from "../../services/Api";

interface Profile {
    name: string;
    email: string;
    phone: string;
    role: string;
}

function MyProfile() {
    const [profile, setProfile] = useState<Profile>({
        name: "",
        email: "",
        phone: "",
        role: "customer",
    });

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/auth/profile");
            setProfile(response.data.user);
        } catch (error) {
            console.error("Failed to load profile:", error);
            alert("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            const response = await api.put("/auth/profile", {
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
            });

            setProfile(response.data.user);
            setEditMode(false);
            alert("Profile updated successfully!");
        } catch (error: any) {
            alert(error.response?.data?.message || "Profile update failed");
        }
    };

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill all password fields");
            return;
        }

        if (newPassword.length < 12) {
            alert("New password must be at least 12 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        try {
            const response = await api.put("/auth/change-password", {
                currentPassword,
                newPassword,
            });

            alert(response.data.message);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            alert(error.response?.data?.message || "Password update failed");
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-[#f5f4fb] p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#20213a]">
                    My Profile
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your personal information and password.
                </p>
            </div>

            {/* Profile Information */}
            <div className="max-w-3xl rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#20213a]">
                        Personal Information
                    </h2>

                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
                    >
                        {editMode ? "Cancel" : "Edit Profile"}
                    </button>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm text-gray-500">
                            Full Name
                        </label>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4">
                            <User size={18} className="text-gray-400" />
                            <input
                                value={profile.name}
                                disabled={!editMode}
                                onChange={(e) =>
                                    setProfile({ ...profile, name: e.target.value })
                                }
                                className="w-full py-3 outline-none disabled:bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-500">
                            Email Address
                        </label>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4">
                            <Mail size={18} className="text-gray-400" />
                            <input
                                type="email"
                                value={profile.email}
                                disabled={!editMode}
                                onChange={(e) =>
                                    setProfile({ ...profile, email: e.target.value })
                                }
                                className="w-full py-3 outline-none disabled:bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-500">
                            Phone Number
                        </label>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4">
                            <Phone size={18} className="text-gray-400" />
                            <input
                                type="tel"
                                value={profile.phone}
                                disabled={!editMode}
                                onChange={(e) =>
                                    setProfile({ ...profile, phone: e.target.value })
                                }
                                className="w-full py-3 outline-none disabled:bg-white"
                            />
                        </div>
                    </div>

                    {editMode && (
                        <button
                            onClick={handleProfileUpdate}
                            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    )}
                </div>
            </div>

            {/* Change Password */}
            <div className="mt-6 max-w-3xl rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                    <Lock className="text-indigo-600" />
                    <h2 className="text-lg font-semibold text-[#20213a]">
                        Change Password
                    </h2>
                </div>

                <div className="space-y-4">
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                    />

                    <input
                        type="password"
                        placeholder="New Password (minimum 12 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                    />

                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                    />

                    <button
                        onClick={handlePasswordChange}
                        className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
                    >
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;
