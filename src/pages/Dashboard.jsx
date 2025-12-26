import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnippet } from "../context/SnippetContext";

export function Dashboard() {
  const { logout, isLoading, user } = useAuth();
  const navigate = useNavigate();
  // We only navigate to the create page; form will handle the actual create call
  const { snippets, getSnippetStats } = useSnippet();

  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSnippetStats();
        setStats(data);
      } catch {
        // ignore - dashboard should still render
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/login");
  };

  const handleSnippetCreate = (e) => {
    e.preventDefault();
    navigate("/dashboard/create");
  };

  const handleSnippet = (e) => {
    e.preventDefault();
    navigate("/dashboard/snippets");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{user ? `Hello, ${user.username}` : "Hello!"}</p>
      <button onClick={handleLogout} disabled={isLoading}>
        {isLoading ? "Logging Out..." : "Log Out"}
      </button>
      <button onClick={handleSnippet}>Show all snippets</button>
      <button onClick={handleSnippetCreate}>New Snippet</button>
      <button onClick={() => navigate("/dashboard/favorites")}>Favorites</button>
      <button onClick={() => navigate("/public/snippets")}>Browse public</button>

      <div>
        <p>Total snippets (loaded): {snippets?.length || 0}</p>
        {stats && (
          <div>
            <p>Total snippets: {stats.totalSnippets}</p>
            <p>Storage usage: {stats.storageUsage?.total || 0} chars</p>
            {Array.isArray(stats.mostUsedLanguages) && stats.mostUsedLanguages.length > 0 && (
              <div>
                <p>Most used languages:</p>
                <ul>
                  {stats.mostUsedLanguages.map((l) => (
                    <li key={l.language}>
                      {l.language}: {l.count}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
