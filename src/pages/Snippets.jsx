import { useNavigate } from "react-router-dom";
import { useSnippet } from "../context/SnippetContext";
import { useEffect, useState } from "react";
import SnippetCard from "../components/snippets/SnippetCard";

export function Snippets() {
  const { snippets, isLoading, error, getSnippets, deleteSnippet, pagination } =
    useSnippet();
  const { totalPages = 1 } = pagination || {};
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      getSnippets({ page, limit, search });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [page, limit, search]);

  const handleEdit = (snippet) => {
    navigate(`/dashboard/snippets/${snippet._id}/edit`);
  };

  const handleDelete = async (snippet) => {
    if (!window.confirm(`Delete "${snippet.title}"?`)) return;
    await deleteSnippet(snippet._id);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Your Snippets</h1>
          <div>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search snippets..."
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white w-full md:w-64"
            />
          </div>

          <button
            onClick={() => navigate("/dashboard/create")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            + New Snippet
          </button>
        </div>

        {isLoading && (
          <div className="text-slate-300 text-center py-8">
            Loading snippets...
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!isLoading && !error && snippets?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg mb-4">
              No snippets yet. Create your first one!
            </p>
            <button
              onClick={() => navigate("/dashboard/create")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Create Snippet
            </button>
          </div>
        )}

        {!isLoading && snippets?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {snippets.map((s) => (
              <SnippetCard
                key={s._id}
                snippet={s}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
