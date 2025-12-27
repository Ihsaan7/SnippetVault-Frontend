import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SnippetCard from "../components/snippets/SnippetCard";
import { useSnippet } from "../context/SnippetContext";

export function Favorites() {
  const navigate = useNavigate();
  const {
    snippets,
    isLoading,
    error,
    pagination,
    getFavoriteSnippets,
    toggleFavorite,
  } = useSnippet();

  const { totalPages = 1 } = pagination || {};
  const [page, setPage] = useState(1);

  useEffect(() => {
    getFavoriteSnippets({ page, limit: 10 });
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">Favorites</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Your saved snippets for quick access.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/snippets")}
          className="btn btn-secondary w-full sm:w-auto"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M10 4L6 8l4 4" />
          </svg>
          Back to Snippets
        </button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="skeleton h-5 w-3/4 rounded"></div>
              <div className="skeleton h-4 w-1/2 rounded"></div>
              <div className="skeleton h-24 rounded"></div>
              <div className="flex gap-2">
                <div className="skeleton h-6 w-16 rounded-full"></div>
                <div className="skeleton h-6 w-16 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="card p-4 border-[var(--danger)] bg-[var(--danger-muted)] text-[var(--danger)]">
          {error}
        </div>
      )}

      {!isLoading && !error && snippets?.length === 0 && (
        <div className="card p-12 text-center">
          <div className="inline-flex w-16 h-16 rounded-full bg-[var(--surface-2)] items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-[var(--muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 3l2.5 7.5H22l-6 4.5 2.5 7.5L12 18l-6.5 4.5 2.5-7.5-6-4.5h7.5L12 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text)]">No favorites yet</h3>
          <p className="text-[var(--muted)] mt-1">
            Save snippets to find them quickly later.
          </p>
          <button
            onClick={() => navigate("/dashboard/snippets")}
            className="btn btn-primary mt-4"
          >
            Browse Snippets
          </button>
        </div>
      )}

      {!isLoading && snippets?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {snippets.map((s) => (
            <SnippetCard
              key={s._id}
              snippet={s}
              onFavorite={() => toggleFavorite(s._id)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
            className="btn btn-secondary"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M10 4L6 8l4 4" />
            </svg>
            Previous
          </button>
          <span className="text-sm text-[var(--muted)] px-4">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() =>
              setPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))
            }
            disabled={isLoading || (totalPages && page >= totalPages)}
            className="btn btn-secondary"
          >
            Next
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 4l4 4-4 4" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
