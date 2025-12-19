import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Dashboard() {
  const { logout, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault;
    await logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>I am Dashboard</h1>
      <p>{user ? `Hello, ${user.username}` : "Hello!"}</p>
      <button onClick={handleLogout} disabled={isLoading}>
        {isLoading ? "Logging Out..." : "Log Out"}
      </button>
    </div>
  );
}
