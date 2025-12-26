import { useState, useEffect } from "react";
import hljs from "highlight.js";
import { useSnippet } from "../../context/SnippetContext";

export function SnippetForm({ onSuccess, initialValues }) {
  const [formData, setFormData] = useState({
    title: initialValues?.title || "",
    code: initialValues?.code || "",
    codeLanguage: initialValues?.codeLanguage || "javascript",
    description: initialValues?.description || "",
    isPublic: initialValues?.isPublic || false,
  });
  const [languageManuallySet, setLanguageManuallySet] = useState(false);
  const [tags, setTags] = useState(initialValues?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const { isLoading, error, createSnippet } = useSnippet();

  useEffect(() => {
    if (initialValues?.tags?.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTags([
        ...new Set(initialValues.tags.map((t) => t.toLowerCase().trim())),
      ]);
    }
  }, [initialValues]);

  const sanitizeTag = (t) => t.toLowerCase().trim();
  const addTag = (raw) => {
    const tag = sanitizeTag(raw);
    if (!tag) return;
    if (tags.includes(tag)) return;
    if (tags.length >= 10) return; // max 10 tags
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
    <div className="max-w-3xl mx-auto border border-[var(--border)] bg-[var(--surface)] p-6">
      <h1 className="text-2xl font-semibold mb-6">Create Snippet</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-[var(--muted)] mb-1"
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
            className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
            placeholder="e.g., Express Middleware Template"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Input */}
          <div>
            <label
              htmlFor="codeLanguage"
              className="block text-sm font-medium text-[var(--muted)] mb-1"
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
              className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
              placeholder="javascript"
            />
          </div>

          {/* Tags Input (chips) */}
          <div>
            <label className="block text-sm font-medium text-[var(--muted)] mb-1">
              Tags
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKeyDown}
              onBlur={onTagBlur}
              disabled={isLoading}
              placeholder="Type a tag and press Enter"
              className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] px-3 py-1 text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-[var(--muted)] hover:text-[var(--accent)]"
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Up to 10 tags. Press Enter to add.
            </p>
          </div>
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[var(--muted)] mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
            placeholder="Briefly describe what this snippet does..."
          />
        </div>

        {/* Code Input */}
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-[var(--muted)] mb-1"
          >
            Code
          </label>
          <textarea
            id="code"
            name="code"
            required
            rows="10"
            value={formData.code}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] font-mono text-sm disabled:opacity-60"
            placeholder="Paste your code here..."
          />
        </div>

        {/* Public Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            disabled={isLoading}
            className="h-4 w-4 border border-[var(--border)] bg-[var(--surface)] cursor-pointer"
          />
          <label htmlFor="isPublic" className="text-sm text-[var(--muted)] cursor-pointer">
            Make this snippet public
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="border border-red-500 bg-[var(--surface)] p-4">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 border font-semibold ${
            isLoading
              ? "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] cursor-not-allowed"
              : "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:brightness-95 active:translate-y-px"
          }`}
        >
          {isLoading ? "Creating..." : "Create Snippet"}
        </button>
      </form>
    </div>
  );
}
