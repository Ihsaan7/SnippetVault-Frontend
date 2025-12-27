import { useNavigate } from "react-router-dom";
import { useSnippet } from "../context/SnippetContext";
import { useEffect, useRef, useState } from "react";
import SnippetCard from "../components/snippets/SnippetCard";

function DateField({ value, onChange, title, placeholder }) {
  const ref = useRef(null);

  return (
    <div className="relative w-full sm:w-40">
      <input
        ref={ref}
        type="date"
        value={value}
        onChange={onChange}
        title={title}
        lang="en-CA"
        className="input pr-8"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => ref.current?.showPicker?.()}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
        title="Open calendar"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 16 16"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="2" y="3" width="12" height="11" rx="1" />
          <path d="M2 6h12M5 1v3M11 1v3" />
        </svg>
      </button>
    </div>
  );
}

export function Snippets() {
  const {
    snippets,
    isLoading,
    error,
    getSnippets,
    deleteSnippet,
    pagination,
    getAllTags,
    toggleFavorite,
  } = useSnippet();
  const { totalPages = 1 } = pagination || {};
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [language, setLanguage] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const tags = await getAllTags();
      setAvailableTags(tags);

      try {
        const raw = localStorage.getItem("snippet_search_history");
        const parsed = raw ? JSON.parse(raw) : [];
        setSearchHistory(Array.isArray(parsed) ? parsed : []);
      } catch {
        setSearchHistory([]);
      }
    })();
  }, []);

  const pushSearchHistory = (term) => {
    const cleaned = String(term || "").trim();
    if (!cleaned) return;

    try {
      const next = [
        cleaned,
        ...searchHistory.filter((s) => String(s).trim() !== cleaned),
      ].slice(0, 8);
      setSearchHistory(next);
      localStorage.setItem("snippet_search_history", JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getSnippets({ page, limit, search, tags: selectedTags, language, from, to });
      pushSearchHistory(search);
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [page, limit, search, selectedTags, language, from, to]);

  const handleEdit = (snippet) => {
    navigate(`/dashboard/snippets/${snippet._id}/edit`);
  };

  const handleDelete = async (snippet) => {
    if (!window.confirm(`Delete "${snippet.title}"?`)) return;
    await deleteSnippet(snippet._id);
  };

  const handleFavorite = async (snippet) => {
    try {
      await toggleFavorite(snippet._id);
    } catch {
      // fallback: do nothing
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setLanguage("");
    setFrom("");
    setTo("");
    setSelectedTags([]);
    setPage(1);
  };

  const hasFilters = search || language || from || to || selectedTags.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">Snippets</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Manage and organize your code snippets.
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

      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <datalist id="snippet-search-history">
              {searchHistory.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
                fill="none"
                viewBox="0 0 16 16"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="7" cy="7" r="5" />
                <path d="M11 11l3 3" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                list="snippet-search-history"
                placeholder="Search snippets..."
                className="input pl-9"
              />
            </div>
          </div>
          <input
            type="text"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setPage(1);
            }}
            placeholder="Language"
            className="input w-full sm:w-32"
          />
          <DateField
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
            title="From"
            placeholder="From"
          />
          <DateField
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
            title="To"
            placeholder="To"
          />
          {hasFilters && (
            <button onClick={clearFilters} className="btn btn-ghost text-sm">
              Clear filters
            </button>
          )}
        </div>

        {availableTags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="flex flex-wrap gap-2">
              {availableTags.map((t) => {
                const active = selectedTags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`tag tag-interactive ${active ? "tag-active" : ""}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            {selectedTags.length > 0 && (
              <p className="mt-2 text-xs text-[var(--muted)]">
                Filtering by: {selectedTags.join(", ")}
              </p>
            )}
          </div>
        )}
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
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text)]">No snippets found</h3>
          <p className="text-[var(--muted)] mt-1">
            {hasFilters
              ? "Try adjusting your filters"
              : "Create your first snippet to get started"}
          </p>
          <button
            onClick={() => navigate("/dashboard/create")}
            className="btn btn-primary mt-4"
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
              onTagLongPress={toggleTag}
              onFavorite={handleFavorite}
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
          <div className="flex items-center gap-1">
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`btn ${
                    page === pageNum ? "btn-primary" : "btn-ghost"
                  } w-9 h-9 p-0`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
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
