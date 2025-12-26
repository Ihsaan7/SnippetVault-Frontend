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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Favorites</h1>
          <p className="text-sm text-[var(--muted)]">
            Your saved snippets. Click code to copy.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/snippets")}
          className="px-3 py-2 border border-[var(--border)] bg-[var(--surface)] text-sm hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Back to Snippets
        </button>
      </div>

      {isLoading && (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
          Loading favorites...
        </div>
      )}

      {error && (
        <div className="border border-red-500 bg-[var(--surface)] p-4 text-red-600">
          {error}
        </div>
      )}

      {!isLoading && !error && snippets?.length === 0 && (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-8">
          <p className="text-[var(--muted)]">No favorites yet.</p>
          <button
            onClick={() => navigate("/dashboard/snippets")}
            className="mt-4 px-4 py-2 border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:brightness-95 active:translate-y-px"
          >
            Browse your snippets
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

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || isLoading}
          className="px-3 py-2 border border-[var(--border)] bg-[var(--surface)] text-sm disabled:opacity-50 hover:border-[var(--accent)]"
        >
          Prev
        </button>
        <span className="text-[var(--muted)] text-sm">
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() =>
            setPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))
          }
          disabled={isLoading || (totalPages && page >= totalPages)}
          className="px-3 py-2 border border-[var(--border)] bg-[var(--surface)] text-sm disabled:opacity-50 hover:border-[var(--accent)]"
        >
          Next
        </button>
      </div>
    </div>
  );
}
