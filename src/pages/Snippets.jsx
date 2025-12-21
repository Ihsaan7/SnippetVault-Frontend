import { useNavigate } from "react-router-dom";
import { useSnippet } from "../context/SnippetContext";
import { useEffect } from "react";
import SnippetCard from "../components/snippets/SnippetCard";

export function Snippets() {
  const { snippets, isLoading, error, getSnippets, deleteSnippet } =
    useSnippet();
  const navigate = useNavigate();

  useEffect(() => {
    getSnippets();
  }, []);

  const handleEdit = (snippet) => {
    navigate(`/dashboard/snippets/${snippet._id}/edit`);
  };

  const handleDelete = async (snippet) => {
    if (!window.confirm(`Delete "${snippet.title}"?`)) return;
    await deleteSnippet(snippet._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Your Snippets</h1>
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
      </div>
    </div>
  );
}
