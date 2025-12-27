import { useState, useEffect } from "react";
import axios from "../utils/axios.js";

export function Profile() {
  const [user, setUser] = useState({
    avatar: "",
    fullName: "",
    email: "",
    username: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updateProfileForm, setUpdateProfileForm] = useState({
    fullName: "",
    email: "",
  });

  const [changePasswordForm, setChangePasswordForm] = useState({
    oldPass: "",
    newPass: "",
    confirmPassword: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

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

  const showMessage = (type, text) => {
    setSubmitMessage({ type, text });
    setTimeout(() => setSubmitMessage({ type: "", text: "" }), 4000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!updateProfileForm.fullName.trim() && !updateProfileForm.email.trim()) {
      showMessage("error", "Please provide at least one field to update");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.patch("/auth/update-profile", {
        fullName: updateProfileForm.fullName,
        email: updateProfileForm.email,
      });
      setUser(response.data.data);
      showMessage("success", "Profile updated successfully!");
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      !changePasswordForm.oldPass ||
      !changePasswordForm.newPass ||
      !changePasswordForm.confirmPassword
    ) {
      showMessage("error", "All password fields are required");
      return;
    }

    if (changePasswordForm.newPass !== changePasswordForm.confirmPassword) {
      showMessage("error", "New passwords do not match");
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
      showMessage("success", "Password changed successfully!");
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to change password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();

    if (!avatarFile) {
      showMessage("error", "Please select an avatar image");
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
      setAvatarPreview(null);
      showMessage("success", "Avatar updated successfully!");
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to update avatar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text)]">Profile</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      {loading && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="skeleton h-20 w-20 rounded-full mb-4"></div>
            <div className="skeleton h-5 w-1/3 rounded mb-2"></div>
            <div className="skeleton h-4 w-1/2 rounded"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="card p-4 border-[var(--danger)] bg-[var(--danger-muted)] text-[var(--danger)]">
          {error}
        </div>
      )}

      {submitMessage.text && (
        <div
          className={`card p-4 ${
            submitMessage.type === "success"
              ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
              : "border-[var(--danger)] bg-[var(--danger-muted)] text-[var(--danger)]"
          } fade-in`}
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {submitMessage.type === "success" ? (
                <path d="M3 8l3 3 7-7" />
              ) : (
                <path d="M4 4l8 8M12 4L4 12" />
              )}
            </svg>
            {submitMessage.text}
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
              Profile Information
            </h2>
            <div className="flex gap-6 flex-wrap">
              <div className="flex-shrink-0">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-20 h-20 rounded-full border-2 border-[var(--border)] object-cover"
                />
              </div>
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[var(--muted)]">Username</p>
                  <p className="font-medium text-[var(--text)]">@{user.username}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">Full Name</p>
                  <p className="font-medium text-[var(--text)]">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">Email</p>
                  <p className="font-medium text-[var(--text)]">{user.email}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">Member Since</p>
                  <p className="font-medium text-[var(--text)]">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
              Update Profile
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
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
                  className="input"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
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
                  className="input"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
              Update Avatar
            </h2>
            <form onSubmit={handleUpdateAvatar} className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="relative cursor-pointer group">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:border-[var(--accent)]">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-6 h-6 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M12 4v16m-8-8h16" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={submitting}
                  />
                </label>
                <div className="text-sm">
                  <p className="text-[var(--text)]">
                    {avatarFile ? avatarFile.name : "Choose a new avatar"}
                  </p>
                  <p className="text-[var(--muted)]">JPG, PNG, GIF up to 5MB</p>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting || !avatarFile}
                className="btn btn-primary"
              >
                {submitting ? "Uploading..." : "Update Avatar"}
              </button>
            </form>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
              Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
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
                  className="input"
                  placeholder="Enter current password"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
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
                    className="input"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    Confirm Password
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
                    className="input"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
