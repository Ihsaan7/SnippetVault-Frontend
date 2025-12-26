import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SnippetCard from "../components/snippets/SnippetCard";
import { useSnippet } from "../context/SnippetContext";

export function PublicSnippets() {
  const navigate = useNavigate();
  const { getPublicSnippets } = useSnippet();

  const [snippets, setSnippets] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getPublicSnippets({ page, limit: 12, search, language });
        setSnippets(data?.snippets || []);
        setPagination(data?.pagination || { page: 1, totalPages: 1 });
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load public snippets");
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [page, search, language]);

  const { totalPages = 1 } = pagination || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white">Public Snippets</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search public snippets..."
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white w-full md:w-64"
            />
            <input
              type="text"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setPage(1);
              }}
              placeholder="Language"
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white w-full md:w-40"
            />
          </div>
        </div>

        {isLoading && (
          <div className="text-slate-300 text-center py-8">Loading...</div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!isLoading && !error && snippets?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No public snippets found.</p>
          </div>
        )}

        {!isLoading && snippets?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {snippets.map((s) => (
              <SnippetCard
                key={s._id}
                snippet={s}
                onEdit={() => navigate(`/public/snippets/${s._id}`)}
                editLabel="View"
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
