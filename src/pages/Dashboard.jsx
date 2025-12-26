import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnippet } from "../context/SnippetContext";

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { snippets, getSnippetStats } = useSnippet();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getSnippetStats();
        setStats(data);
      } catch {
        // ignore - dashboard should still render
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const StatCard = ({ label, value, suffix, action, actionLabel, variant }) => (
    <div className="card p-5 flex flex-col">
      <p className="text-sm text-[var(--muted)] font-medium">{label}</p>
      <p className="text-3xl font-semibold text-[var(--text)] mt-1">
        {loading ? (
          <span className="skeleton inline-block w-16 h-8"></span>
        ) : (
          <>
            {value}
            {suffix && (
              <span className="text-sm font-normal text-[var(--muted)] ml-1">
                {suffix}
              </span>
            )}
          </>
        )}
      </p>
      {action && (
        <button
          onClick={action}
          className={`mt-4 btn ${variant === "primary" ? "btn-primary" : "btn-secondary"}`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">
            {user?.fullName ? `Welcome back, ${user.fullName.split(" ")[0]}` : "Dashboard"}
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Here's an overview of your snippet collection.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/create")}
          className="btn btn-primary"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M8 3v10M3 8h10" />
          </svg>
          New Snippet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          label="Total Snippets"
          value={stats?.totalSnippets ?? snippets?.length ?? 0}
          action={() => navigate("/dashboard/snippets")}
          actionLabel="View all snippets"
        />
        <StatCard
          label="Code Characters"
          value={stats?.storageUsage?.total || 0}
          suffix="chars"
          action={() => navigate("/dashboard/create")}
          actionLabel="Create snippet"
          variant="primary"
        />
      </div>

      <div className="card p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)]">
              Top Languages
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Your most used programming languages
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/dashboard/favorites")}
              className="btn btn-secondary text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 16 16"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M8 2l1.5 4.5H14l-3.5 3 1.5 4.5L8 11l-4 3 1.5-4.5L2 6.5h4.5L8 2z" />
              </svg>
              Favorites
            </button>
            <button
              onClick={() => navigate("/public/snippets")}
              className="btn btn-secondary text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 16 16"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="8" cy="8" r="6" />
                <path d="M2 8h12M8 2c-2 2-2.5 4-2.5 6s.5 4 2.5 6c2-2 2.5-4 2.5-6S10 4 8 2z" />
              </svg>
              Explore
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-md"></div>
            ))}
          </div>
        ) : (stats?.mostUsedLanguages?.length || 0) > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.mostUsedLanguages.slice(0, 8).map((l, i) => (
              <div
                key={l.language}
                className="card-hover bg-[var(--surface-2)] p-4 rounded-md border border-transparent hover:border-[var(--border)] cursor-pointer transition-all"
                onClick={() => navigate(`/dashboard/snippets?language=${l.language}`)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: [
                        "var(--accent)",
                        "#f1e05a",
                        "#3572A5",
                        "#e34c26",
                        "#563d7c",
                        "#b07219",
                        "#4F5D95",
                        "#00ADD8",
                      ][i % 8],
                    }}
                  ></span>
                  <div className="text-sm font-medium text-[var(--text)] truncate">
                    {l.language || "unknown"}
                  </div>
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  {l.count} {l.count === 1 ? "snippet" : "snippets"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[var(--muted)]">No snippets yet</p>
            <button
              onClick={() => navigate("/dashboard/create")}
              className="btn btn-primary mt-3"
            >
              Create your first snippet
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 16 16"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="8" cy="8" r="6" />
          <path d="M8 5v3l2 2" />
        </svg>
        Tip: Click any code block to copy it to your clipboard.
      </div>
    </div>
  );
}
