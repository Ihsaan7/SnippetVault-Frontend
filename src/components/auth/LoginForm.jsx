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
      <div className="w-full max-w-sm fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-[var(--accent)] items-center justify-center mb-4">
            <span className="text-lg font-bold text-white">SV</span>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">
            Sign in to SnippetVault
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Welcome back! Enter your credentials.
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-[var(--text)] mb-1.5"
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
                className="input"
                placeholder="Enter username or email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--text)] mb-1.5"
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
                className="input"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-[var(--danger-muted)] border border-[var(--danger)] text-sm text-[var(--danger)]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-2.5"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-25"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-75"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 card p-4 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            New to SnippetVault?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[var(--link)] hover:text-[var(--link-hover)] font-medium hover:underline"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
