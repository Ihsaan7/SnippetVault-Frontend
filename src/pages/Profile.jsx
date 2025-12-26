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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-[var(--muted)]">Account details and security.</p>
        </div>
      </div>

      {loading && (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
          Loading profile...
        </div>
      )}

      {error && (
        <div className="border border-red-500 bg-[var(--surface)] p-4 text-red-600">
          {error}
        </div>
      )}

      {submitMessage && (
        <div
          className={`border p-4 ${
            submitMessage.includes("success")
              ? "border-[var(--accent-2)] bg-[var(--surface)] text-[var(--text)]"
              : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
          }`}
        >
          {submitMessage}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <div className="flex gap-6 flex-wrap">
              <div className="flex-shrink-0">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 border border-[var(--border)] object-cover"
                />
              </div>
              <div className="flex-grow">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[var(--muted)] text-sm">Username</p>
                    <p className="text-[var(--text)] font-semibold">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)] text-sm">Full Name</p>
                    <p className="text-[var(--text)] font-semibold">{user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)] text-sm">Email</p>
                    <p className="text-[var(--text)] font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)] text-sm">Member Since</p>
                    <p className="text-[var(--text)] font-semibold">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
            <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[var(--muted)] text-sm font-medium mb-2">
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
                  className="w-full px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-[var(--muted)] text-sm font-medium mb-2">
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
                  className="w-full px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold disabled:opacity-50 hover:brightness-95 active:translate-y-px"
              >
                {submitting ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-[var(--muted)] text-sm font-medium mb-2">
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
                  className="w-full px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-[var(--muted)] text-sm font-medium mb-2">
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
                  className="w-full px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-[var(--muted)] text-sm font-medium mb-2">
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
                  className="w-full px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold disabled:opacity-50 hover:brightness-95 active:translate-y-px"
              >
                {submitting ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
            <h2 className="text-lg font-semibold mb-4">Update Avatar</h2>
            <form onSubmit={handleUpdateAvatar} className="space-y-4">
              <div>
                <label className="block text-[var(--muted)] text-sm font-medium mb-2">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm file:mr-4 file:py-2 file:px-4 file:border file:border-[var(--border)] file:bg-[var(--surface-2)] file:text-[var(--text)] hover:file:border-[var(--accent)]"
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !avatarFile}
                className="w-full px-4 py-2 border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold disabled:opacity-50 hover:brightness-95 active:translate-y-px"
              >
                {submitting ? "Uploading..." : "Update Avatar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
