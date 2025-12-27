import { useState } from "react";
import hljs from "highlight.js";
import { useSnippet } from "../../context/SnippetContext";

const normalizeTags = (raw) => {
  const arr = Array.isArray(raw) ? raw : [];
  return [...new Set(arr.map((t) => String(t).toLowerCase().trim()).filter(Boolean))];
};

export function SnippetForm({ onSuccess, initialValues }) {
  const [formData, setFormData] = useState({
    title: initialValues?.title || "",
    code: initialValues?.code || "",
    codeLanguage: initialValues?.codeLanguage || "javascript",
    description: initialValues?.description || "",
    isPublic: initialValues?.isPublic || false,
  });
  const [languageManuallySet, setLanguageManuallySet] = useState(false);
  const [tags, setTags] = useState(() => normalizeTags(initialValues?.tags));
  const [tagInput, setTagInput] = useState("");
  const { isLoading, error, createSnippet } = useSnippet();

  const sanitizeTag = (t) => t.toLowerCase().trim();
  const addTag = (raw) => {
    const tag = sanitizeTag(raw);
    if (!tag) return;
    if (tags.includes(tag)) return;
    if (tags.length >= 10) return;
    setTags((prev) => [...prev, tag]);
  };
  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };
  const onTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    }
  };
  const onTagBlur = () => {
    if (tagInput.trim()) {
      addTag(tagInput);
      setTagInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tags,
    };

    await createSnippet(payload);
    if (onSuccess) onSuccess();
  };

  const detectLanguage = (code) => {
    const text = String(code || "");
    if (!text.trim()) return null;
    try {
      const result = hljs.highlightAuto(text);
      return result.language || null;
    } catch {
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "codeLanguage") {
      setLanguageManuallySet(true);
    }

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "code" && !languageManuallySet) {
        const detected = detectLanguage(value);
        if (detected) next.codeLanguage = detected;
      }

      return next;
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text)]">
          Create Snippet
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Add a new code snippet to your collection.
        </p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[var(--text)] mb-1.5"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              disabled={isLoading}
              className="input"
              placeholder="e.g., Express Middleware Template"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="codeLanguage"
                className="block text-sm font-medium text-[var(--text)] mb-1.5"
              >
                Language
              </label>
              <input
                type="text"
                id="codeLanguage"
                name="codeLanguage"
                required
                value={formData.codeLanguage}
                onChange={handleChange}
                disabled={isLoading}
                className="input"
                placeholder="javascript"
              />
              <p className="mt-1 text-xs text-[var(--muted)]">
                Auto-detected from code
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Tags
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={onTagKeyDown}
                onBlur={onTagBlur}
                disabled={isLoading}
                placeholder="Press Enter to add"
                className="input"
              />
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span key={tag} className="tag group">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1.5 text-[var(--accent)] hover:text-[var(--danger)] transition-colors"
                        aria-label={`Remove ${tag}`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 12 12"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 3l6 6M9 3L3 9" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-[var(--muted)]">
                Up to 10 tags
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[var(--text)] mb-1.5"
            >
              Description
              <span className="text-[var(--muted)] font-normal ml-1">
                (optional)
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
              className="input resize-none"
              placeholder="Briefly describe what this snippet does..."
            />
          </div>

          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-[var(--text)] mb-1.5"
            >
              Code
            </label>
            <textarea
              id="code"
              name="code"
              required
              rows="12"
              value={formData.code}
              onChange={handleChange}
              disabled={isLoading}
              className="input font-mono text-sm resize-none"
              placeholder="Paste your code here..."
            />
          </div>

          <div className="flex items-center gap-3 py-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                disabled={isLoading}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[var(--border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent)]"></div>
            </label>
            <label htmlFor="isPublic" className="text-sm text-[var(--text)] cursor-pointer">
              Make this snippet public
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-[var(--danger-muted)] border border-[var(--danger)] text-sm text-[var(--danger)]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-2.5"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-25"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-75"
                  />
                </svg>
                Creating...
              </span>
            ) : (
              "Create Snippet"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
