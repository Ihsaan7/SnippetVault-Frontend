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
    <div className="border">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="border">
          <div>
            <label htmlFor="identifier">Username or Email</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="border">{error}</div>}
          <button className="border" type="submit" disabled={isLoading}>
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
