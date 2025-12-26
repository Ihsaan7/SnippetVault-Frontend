import { useRef, useState } from "react";
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
  const [isHovered, setIsHovered] = useState(false);

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
  const preview = (code || "").split("\n").slice(0, 6).join("\n");

  const startLongPress = (t) => {
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    longPressedRef.current = false;
    longPressTimeout.current = setTimeout(() => {
      longPressedRef.current = true;
      onTagLongPress?.(t);
    }, 600);
  };

  const cancelLongPress = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

  return (
    <div
      className="card card-hover p-5 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[var(--text)] font-semibold truncate leading-tight">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-[var(--surface-2)] text-[var(--text-secondary)]">
              {codeLanguage}
            </span>
            {isPublic && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 16 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="8" cy="8" r="6" />
                  <path d="M2 8h12M8 2c-2 2-2.5 4-2.5 6s.5 4 2.5 6c2-2 2.5-4 2.5-6S10 4 8 2z" />
                </svg>
                Public
              </span>
            )}
          </div>
        </div>
        {createdAt && (
          <span className="text-[var(--muted)] text-xs whitespace-nowrap">
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>

      {description && (
        <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-2">
          {description}
        </p>
      )}

      <div className="flex-1">
        <CodeBlock
          code={preview}
          language={codeLanguage}
          className="bg-[var(--code-bg)] text-[var(--code-text)] border border-[var(--border)] p-3 text-xs rounded-md"
        />
      </div>

      {tagList.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tagList.slice(0, 4).map((t, i) => (
            <button
              key={`${t}-${i}`}
              type="button"
              onMouseDown={() => startLongPress(t)}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
              onTouchStart={() => startLongPress(t)}
              onTouchEnd={cancelLongPress}
              title="Hold to filter by tag"
              className="tag tag-interactive"
            >
              {t}
            </button>
          ))}
          {tagList.length > 4 && (
            <span className="text-xs text-[var(--muted)] self-center">
              +{tagList.length - 4}
            </span>
          )}
        </div>
      )}

      <div
        className={`flex items-center gap-2 mt-4 pt-3 border-t border-[var(--border)] transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-70"
        }`}
      >
        {typeof favoriteCount === "number" && (
          <span className="flex items-center gap-1 text-xs text-[var(--muted)] mr-auto">
            <svg
              className="w-3.5 h-3.5"
              fill={isFavorited ? "currentColor" : "none"}
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M8 2l1.5 4.5H14l-3.5 3 1.5 4.5L8 11l-4 3 1.5-4.5L2 6.5h4.5L8 2z" />
            </svg>
            {favoriteCount}
          </span>
        )}

        {isPublic && (
          <button
            type="button"
            onClick={async () => {
              const url = `${window.location.origin}/public/snippets/${snippet._id}`;
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: snippet.title || "Snippet",
                    text: "Check this snippet",
                    url,
                  });
                  return;
                } catch {
                  // continue to fallback
                }
              }
              try {
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(url)}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              } catch {
                // ignore
              }
              try {
                await navigator.clipboard.writeText(url);
              } catch {
                // ignore
              }
            }}
            className="btn btn-ghost text-xs px-2 py-1"
            title="Share"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 10l4-4M6 6h4v4M3 9v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9" />
            </svg>
            Share
          </button>
        )}

        {onFavorite && (
          <button
            type="button"
            onClick={() => onFavorite(snippet)}
            className={`btn text-xs px-2 py-1 ${
              isFavorited
                ? "btn-primary"
                : "btn-secondary"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill={isFavorited ? "currentColor" : "none"}
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M8 2l1.5 4.5H14l-3.5 3 1.5 4.5L8 11l-4 3 1.5-4.5L2 6.5h4.5L8 2z" />
            </svg>
            {isFavorited ? "Saved" : "Save"}
          </button>
        )}

        {onEdit && (
          <button
            onClick={() => onEdit(snippet)}
            className="btn btn-primary text-xs px-2 py-1"
          >
            {editLabel}
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(snippet)}
            className="btn btn-outline-danger text-xs px-2 py-1"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
