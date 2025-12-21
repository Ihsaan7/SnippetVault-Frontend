export default function SnippetCard({ snippet, onEdit, onDelete }) {
  if (!snippet) return null;

  const {
    title,
    codeLanguage,
    tags = [],
    description = "",
    code = "",
    createdAt,
  } = snippet;

  const tagList = Array.isArray(tags) ? tags : [];
  const preview = (code || "").split("\n").slice(0, 8).join("\n");

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          <p className="text-slate-400 text-sm">{codeLanguage}</p>
        </div>
        {createdAt && (
          <span className="text-slate-500 text-xs">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {description && (
        <p className="text-slate-300 mt-2 text-sm">{description}</p>
      )}

      <pre className="mt-3 bg-slate-900 text-slate-200 rounded p-3 text-xs overflow-x-auto">
        <code>{preview}</code>
      </pre>

      {tagList.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tagList.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-300 border border-slate-600"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 justify-end mt-3">
        {onEdit && (
          <button
            onClick={() => onEdit(snippet)}
            className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(snippet)}
            className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
