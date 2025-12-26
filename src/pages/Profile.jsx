import { useState, useEffect } from "react";
import axios from "../utils/axios.js";

export function Profile() {
  // User profile state
  const [user, setUser] = useState({
    avatar: "",
    fullName: "",
    email: "",
    username: "",
    createdAt: "",
  });

  // Page loading/error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Update profile form state
  const [updateProfileForm, setUpdateProfileForm] = useState({
    fullName: "",
    email: "",
  });

  // Change password form state
  const [changePasswordForm, setChangePasswordForm] = useState({
    oldPass: "",
    newPass: "",
    confirmPassword: "",
  });

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/auth/profile");
        const userData = response.data.data;
        setUser(userData);
        setUpdateProfileForm({
          fullName: userData.fullName || "",
          email: userData.email || "",
        });
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!updateProfileForm.fullName.trim() && !updateProfileForm.email.trim()) {
      setSubmitMessage("Please provide at least one field to update");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.patch("/auth/update-profile", {
        fullName: updateProfileForm.fullName,
        email: updateProfileForm.email,
      });
      setUser(response.data.data);
      setSubmitMessage("Profile updated successfully!");
      setTimeout(() => setSubmitMessage(""), 3000);
    } catch (err) {
      setSubmitMessage(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      !changePasswordForm.oldPass ||
      !changePasswordForm.newPass ||
      !changePasswordForm.confirmPassword
    ) {
      setSubmitMessage("All password fields are required");
      return;
    }

    if (changePasswordForm.newPass !== changePasswordForm.confirmPassword) {
      setSubmitMessage("New passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      await axios.patch("/auth/update-password", {
        oldPass: changePasswordForm.oldPass,
        newPass: changePasswordForm.newPass,
        confirmPassword: changePasswordForm.confirmPassword,
      });
      setChangePasswordForm({ oldPass: "", newPass: "", confirmPassword: "" });
      setSubmitMessage("Password changed successfully!");
      setTimeout(() => setSubmitMessage(""), 3000);
    } catch (err) {
      setSubmitMessage(
        err.response?.data?.message || "Failed to change password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle update avatar
  const handleUpdateAvatar = async (e) => {
    e.preventDefault();

    if (!avatarFile) {
      setSubmitMessage("Please select an avatar image");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await axios.patch("/auth/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(response.data.data);
      setAvatarFile(null);
      setSubmitMessage("Avatar updated successfully!");
      setTimeout(() => setSubmitMessage(""), 3000);
    } catch (err) {
      setSubmitMessage(
        err.response?.data?.message || "Failed to update avatar"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-8">Your Profile</h1>

        {/* Loading State */}
        {loading && (
          <div className="text-slate-300 text-center py-12">
            Loading profile...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Submit Message */}
        {submitMessage && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              submitMessage.includes("success")
                ? "bg-green-500/10 border border-green-500 text-green-300"
                : "bg-yellow-500/10 border border-yellow-500 text-yellow-300"
            }`}
          >
            {submitMessage}
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <div className="space-y-8">
            {/* Profile Display Section */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">
                Profile Information
              </h2>
              <div className="flex gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover"
                  />
                </div>
                {/* User Info */}
                <div className="flex-grow">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Username</p>
                      <p className="text-white font-semibold">
                        {user.username}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Full Name</p>
                      <p className="text-white font-semibold">
                        {user.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <p className="text-white font-semibold">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Member Since</p>
                      <p className="text-white font-semibold">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Profile Form */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">
                Update Profile
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={updateProfileForm.fullName}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={updateProfileForm.email}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
                >
                  {submitting ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">
                Change Password
              </h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={changePasswordForm.oldPass}
                    onChange={(e) =>
                      setChangePasswordForm({
                        ...changePasswordForm,
                        oldPass: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={changePasswordForm.newPass}
                    onChange={(e) =>
                      setChangePasswordForm({
                        ...changePasswordForm,
                        newPass: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={changePasswordForm.confirmPassword}
                    onChange={(e) =>
                      setChangePasswordForm({
                        ...changePasswordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
                >
                  {submitting ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>

            {/* Update Avatar Form */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">
                Update Avatar
              </h2>
              <form onSubmit={handleUpdateAvatar} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Select Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !avatarFile}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
                >
                  {submitting ? "Uploading..." : "Update Avatar"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
