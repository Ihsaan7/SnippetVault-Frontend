import { useRef } from "react";
import { CodeBlock } from "../code/CodeBlock";

export default function SnippetCard({
  snippet,
  onEdit,
  onDelete,
  onTagLongPress,
  onFavorite,
  editLabel = "Edit",
}) {
  const longPressTimeout = useRef(null);
  const longPressedRef = useRef(false);
  if (!snippet) return null;

  const {
    title,
    codeLanguage,
    tags = [],
    description = "",
    code = "",
    createdAt,
    isPublic,
    isFavorited,
    favoriteCount,
  } = snippet;

  const tagList = Array.isArray(tags) ? tags : [];
  const preview = (code || "").split("\n").slice(0, 8).join("\n");

  const startLongPress = (t) => {
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    longPressedRef.current = false;
    longPressTimeout.current = setTimeout(() => {
      longPressedRef.current = true;
      onTagLongPress?.(t);
    }, 600); // hold ~600ms to trigger filter
  };

  const cancelLongPress = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

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

      <CodeBlock
        code={preview}
        language={codeLanguage}
        className="mt-3 bg-slate-900 text-slate-200 rounded p-3 text-xs overflow-x-auto"
      />

      {tagList.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tagList.map((t, i) => (
            <button
              key={`${t}-${i}`}
              type="button"
              onMouseDown={() => startLongPress(t)}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
              onTouchStart={() => startLongPress(t)}
              onTouchEnd={cancelLongPress}
              title="Hold to filter by tag"
              aria-label={`Tag ${t}: hold to filter`}
              className="px-2 py-1 text-xs rounded border transition cursor-pointer bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 justify-end mt-3 flex-wrap">
        {typeof favoriteCount === "number" && (
          <span className="mr-auto text-xs text-slate-400 self-center">
            Favorites: {favoriteCount}
          </span>
        )}

        {isPublic && (
          <button
            type="button"
            onClick={async () => {
              const url = `${window.location.origin}/public/snippets/${snippet._id}`;
              try {
                await navigator.clipboard.writeText(url);
              } catch {
                // fallback: still open the link in a new tab
                window.open(url, "_blank", "noopener,noreferrer");
              }
            }}
            className="px-3 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-white transition"
            title="Copy public link"
          >
            Share
          </button>
        )}

        {onFavorite && (
          <button
            type="button"
            onClick={() => onFavorite(snippet)}
            className={`px-3 py-1 text-xs rounded transition ${
              isFavorited
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : "bg-slate-700 hover:bg-slate-600 text-white"
            }`}
          >
            {isFavorited ? "★ Favorited" : "☆ Favorite"}
          </button>
        )}

        {onEdit && (
          <button
            onClick={() => onEdit(snippet)}
            className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            {editLabel}
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
