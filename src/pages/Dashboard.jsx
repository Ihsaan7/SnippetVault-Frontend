import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnippet } from "../context/SnippetContext";

export function Dashboard() {
  const { user } = useAuth();
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

  const handleSnippetCreate = () => {
    navigate("/dashboard/create");
  };

  const handleSnippet = () => {
    navigate("/dashboard/snippets");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {user?.username ? `Dashboard — ${user.username}` : "Dashboard"}
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Clean UI, sharp edges, theme-aware.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-xs text-[var(--muted)]">Your snippets</p>
          <p className="text-2xl font-semibold">
            {stats?.totalSnippets ?? snippets?.length ?? 0}
          </p>
          <button
            onClick={handleSnippet}
            className="mt-4 px-3 py-2 border border-[var(--border)] bg-[var(--surface)] text-sm hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            View snippets
          </button>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-xs text-[var(--muted)]">Storage usage</p>
          <p className="text-2xl font-semibold">
            {stats?.storageUsage?.total || 0}
            <span className="text-sm text-[var(--muted)]"> chars</span>
          </p>
          <button
            onClick={handleSnippetCreate}
            className="mt-4 px-3 py-2 border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] text-sm font-semibold hover:brightness-95 active:translate-y-px"
          >
            Create snippet
          </button>
        </div>
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold">Top languages</h2>
            <p className="text-sm text-[var(--muted)]">
              Based on your saved snippets.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/dashboard/favorites")}
              className="px-3 py-2 border border-[var(--border)] bg-[var(--surface)] text-sm hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Favorites
            </button>
            <button
              onClick={() => navigate("/public/snippets")}
              className="px-3 py-2 border border-[var(--border)] bg-[var(--surface)] text-sm hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Browse public
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {(stats?.mostUsedLanguages || []).slice(0, 8).map((l) => (
            <div
              key={l.language}
              className="border border-[var(--border)] bg-[var(--surface-2)] p-3"
            >
              <div className="text-sm font-semibold">{l.language || "unknown"}</div>
              <div className="text-xs text-[var(--muted)]">{l.count} snippets</div>
            </div>
          ))}

          {!stats?.mostUsedLanguages?.length && (
            <div className="text-sm text-[var(--muted)]">No stats yet.</div>
          )}
        </div>
      </div>

      <div className="text-xs text-[var(--muted)]">
        Theme + palette can be changed from the sidebar. (Auto follows browser.)
      </div>
    </div>
  );
}
