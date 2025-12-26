import { useEffect, useState } from "react";
import hljs from "highlight.js";
import { useNavigate, useParams } from "react-router-dom";
import { useSnippet } from "../context/SnippetContext";

export default function SnippetEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSnippetByID, updateSnippet, isLoading, error } = useSnippet();

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    codeLanguage: "javascript",
    tags: "",
    description: "",
    isPublic: false,
  });
  const [languageManuallySet, setLanguageManuallySet] = useState(false);

  useEffect(() => {
    const loadSnippet = async () => {
      const snippet = await getSnippetByID(id);
      if (snippet) {
        setFormData({
          title: snippet.title || "",
          code: snippet.code || "",
          codeLanguage: snippet.codeLanguage || "javascript",
          tags: Array.isArray(snippet.tags) ? snippet.tags.join(", ") : "",
          description: snippet.description || "",
          isPublic: snippet.isPublic || false,
        });
      }
    };
    loadSnippet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: tagsArray,
    };

    await updateSnippet(id, payload);
    navigate("/dashboard/snippets");
  };

  return (
    <div className="max-w-3xl mx-auto border border-[var(--border)] bg-[var(--surface)] p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Snippet</h1>

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

          {/* Tags Input */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
              placeholder="backend, auth, node"
            />
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

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-3 px-4 border font-semibold ${
              isLoading
                ? "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] cursor-not-allowed"
                : "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:brightness-95 active:translate-y-px"
            }`}
          >
            {isLoading ? "Updating..." : "Update Snippet"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/snippets")}
            className="flex-1 py-3 px-4 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
