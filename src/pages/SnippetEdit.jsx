import { useEffect, useState } from "react";
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Snippet</h1>

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
              placeholder="backend, auth, node"
            />
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

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-colors
          ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          >
            {isLoading ? "Updating..." : "Update Snippet"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/snippets")}
            className="flex-1 py-3 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
