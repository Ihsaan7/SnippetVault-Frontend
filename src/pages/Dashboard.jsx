import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnippet } from "../context/SnippetContext";

export function Dashboard() {
  const { logout, isLoading, user } = useAuth();
  const navigate = useNavigate();
  // We only navigate to the create page; form will handle the actual create call
  const { snippets } = useSnippet();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/login");
  };

  const handleSnippet = (e) => {
    e.preventDefault();
    navigate("/dashboard/create");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{user ? `Hello, ${user.username}` : "Hello!"}</p>
      <button onClick={handleLogout} disabled={isLoading}>
        {isLoading ? "Logging Out..." : "Log Out"}
      </button>
      <button onClick={handleSnippet}>New Snippet</button>
      <div>
        <p>Total snippets: {snippets?.length || 0}</p>
      </div>
    </div>
  );
}
