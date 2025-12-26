import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const { isLoading, error, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);

    if (!error) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="max-w-md w-full bg-[var(--surface)] border border-[var(--border)] p-8">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identifier Input */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-[var(--muted)] mb-1"
            >
              Username or Email
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
              placeholder="Enter username or email"
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
              disabled={isLoading}
              className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
              placeholder="••••••••"
            />
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
            {isLoading ? "Logging In..." : "Login"}
          </button>
          <p className="text-sm text-[var(--muted)]">
            New user? Create an account.
          </p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full py-3 px-4 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
