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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, language]);

  const { totalPages = 1 } = pagination || {};

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Public Snippets</h1>
            <p className="text-sm text-[var(--muted)]">
              Browse and fork. Share uses native share / WhatsApp / copy fallback.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search public snippets..."
              className="px-3 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] w-full md:w-64 focus:outline-none focus:border-[var(--accent)]"
            />
            <input
              type="text"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setPage(1);
              }}
              placeholder="Language"
              className="px-3 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] w-full md:w-40 focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {isLoading && (
          <div className="border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
            Loading...
          </div>
        )}

        {error && (
          <div className="border border-red-500 bg-[var(--surface)] p-4 text-red-600">
            {error}
          </div>
        )}

        {!isLoading && !error && snippets?.length === 0 && (
          <div className="border border-[var(--border)] bg-[var(--surface)] p-8">
            <p className="text-[var(--muted)]">No public snippets found.</p>
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
    </div>
  );
}
