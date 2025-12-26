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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white">Favorites</h1>
          <button
            onClick={() => navigate("/dashboard/snippets")}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
          >
            Back to Snippets
          </button>
        </div>

        {isLoading && (
          <div className="text-slate-300 text-center py-8">
            Loading favorites...
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!isLoading && !error && snippets?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg mb-4">No favorites yet.</p>
            <button
              onClick={() => navigate("/dashboard/snippets")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
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

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
            className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-slate-300 text-sm">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() =>
              setPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))
            }
            disabled={isLoading || (totalPages && page >= totalPages)}
            className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
