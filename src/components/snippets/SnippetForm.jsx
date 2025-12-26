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
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Create Snippet</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
            placeholder="e.g., Express Middleware Template"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Input */}
          <div>
            <label
              htmlFor="codeLanguage"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
              placeholder="javascript"
            />
          </div>

          {/* Tags Input (chips) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-700 hover:text-blue-900"
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Up to 10 tags. Press Enter to add.
            </p>
          </div>
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
            placeholder="Briefly describe what this snippet does..."
          />
        </div>

        {/* Code Input */}
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm disabled:bg-gray-100"
            placeholder="Paste your code here..."
          />
        </div>

        {/* Public Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            disabled={isLoading}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <label
            htmlFor="isPublic"
            className="ml-2 block text-sm text-gray-700 cursor-pointer"
          >
            Make this snippet public
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-colors
          ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Creating..." : "Create Snippet"}
        </button>
      </form>
    </div>
  );
}
