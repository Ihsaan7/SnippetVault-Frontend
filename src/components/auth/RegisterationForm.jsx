import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function RegisterationForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const { isLoading, register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to include avatar file
    const submitData = new FormData();
    submitData.append("username", formData.username);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("fullName", formData.fullName);
    if (avatarFile) {
      submitData.append("avatar", avatarFile);
    }

    await register(submitData);

    if (!error) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="max-w-md w-full bg-[var(--surface)] border border-[var(--border)] p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">Create Account</h2>
          <p className="text-[var(--muted)] mt-2 text-sm">Join SnippetVault today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[var(--muted)] mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading} // Use local state here
              className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
              placeholder="johndoe123"
            />
          </div>

          {/* FullName Input */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-[var(--muted)] mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={isLoading} // Use local state here
              className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
              placeholder="johndoe123"
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--muted)] mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
              placeholder="john@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--muted)] mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
              placeholder="••••••••"
            />
            <p className="text-xs text-[var(--muted)] mt-1">
              Must be at least 6 characters
            </p>
          </div>

          {/* Avatar Input */}
          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-[var(--muted)] mb-1"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60 text-sm"
            />
            <p className="text-xs text-[var(--muted)] mt-1">
              Upload an image file for your profile
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="border border-red-500 bg-[var(--surface)] p-4">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 border font-semibold ${
              isLoading
                ? "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] cursor-not-allowed"
                : "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:brightness-95 active:translate-y-px"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registering...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
