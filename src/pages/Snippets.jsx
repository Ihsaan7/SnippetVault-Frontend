import { useNavigate } from "react-router-dom";
import { useSnippet } from "../context/SnippetContext";
import { useEffect, useRef, useState } from "react";
import SnippetCard from "../components/snippets/SnippetCard";

function DateField({ value, onChange, title }) {
  const ref = useRef(null);

  return (
    <div className="flex items-stretch border border-[var(--border)] bg-[var(--surface)] focus-within:border-[var(--accent)]">
      <input
        ref={ref}
        type="date"
        value={value}
        onChange={onChange}
        title={title}
        lang="en-CA"
        className="px-3 py-2 bg-transparent text-[var(--text)] text-sm focus:outline-none appearance-none"
      />
      <button
        type="button"
        onClick={() => ref.current?.showPicker?.()}
        className="px-3 border-l border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--accent)]"
        title="Open calendar"
      >
        Pick
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
    // initial load: fetch tags + load search history
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // fallback: do nothing (error is logged in context)
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Snippets</h1>
          <p className="text-sm text-[var(--muted)]">
            Tip: click code to copy. Hold a tag to filter.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <datalist id="snippet-search-history">
            {searchHistory.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            list="snippet-search-history"
            placeholder="Search title, tags, code..."
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

          <DateField
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
            title="From"
          />
          <DateField
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
            title="To"
          />
        </div>
      </div>

      {/* Tag Filters */}
      {availableTags.length > 0 && (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="flex flex-wrap gap-2">
            {availableTags.map((t) => {
              const active = selectedTags.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  className={`px-3 py-1 text-xs border ${
                    active
                      ? "bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-contrast)]"
                      : "bg-[var(--surface)] border-[var(--border)] text-[var(--text)]/80 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  }`}
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

      {isLoading && (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
          Loading snippets...
        </div>
      )}

      {error && (
        <div className="border border-red-500 bg-[var(--surface)] p-4 text-red-600">
          {error}
        </div>
      )}

      {!isLoading && !error && snippets?.length === 0 && (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-8">
          <p className="text-[var(--muted)]">No snippets yet.</p>
          <button
            onClick={() => navigate("/dashboard/create")}
            className="mt-4 px-4 py-2 border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:brightness-95 active:translate-y-px"
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
