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
    <div className="bg-[var(--surface)] border border-[var(--border)] p-5 hover:border-[var(--accent)] hover:translate-y-[-1px]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[var(--text)] text-lg font-semibold truncate">
            {title}
          </h3>
          <p className="text-[var(--muted)] text-sm">{codeLanguage}</p>
        </div>
        {createdAt && (
          <span className="text-[var(--muted)] text-xs whitespace-nowrap">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {description && (
        <p className="text-[var(--text)]/80 mt-2 text-sm">{description}</p>
      )}

      <CodeBlock
        code={preview}
        language={codeLanguage}
        className="mt-3 bg-[var(--code-bg)] text-[var(--code-text)] border border-[var(--border)] p-3 text-xs"
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
              className="px-2 py-1 text-xs border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]/80 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 justify-end mt-3 flex-wrap">
        {typeof favoriteCount === "number" && (
          <span className="mr-auto text-xs text-[var(--muted)] self-center">
            Favorites: {favoriteCount}
          </span>
        )}

        {isPublic && (
          <button
            type="button"
            onClick={async () => {
              const url = `${window.location.origin}/public/snippets/${snippet._id}`;

              // 1) Native share (mobile + modern browsers). Requires secure context.
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: snippet.title || "Snippet",
                    text: "Check this snippet",
                    url,
                  });
                  return;
                } catch {
                  // user cancelled or unsupported -> continue to fallback
                }
              }

              // 2) WhatsApp Web fallback (works on desktop too)
              const wa = `https://wa.me/?text=${encodeURIComponent(url)}`;
              try {
                window.open(wa, "_blank", "noopener,noreferrer");
              } catch {
                // ignore
              }

              // 3) Also copy to clipboard as a reliable fallback
              try {
                await navigator.clipboard.writeText(url);
              } catch {
                // ignore
              }
            }}
            className="px-3 py-1 text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            title="Share"
          >
            Share
          </button>
        )}

        {onFavorite && (
          <button
            type="button"
            onClick={() => onFavorite(snippet)}
            className={`px-3 py-1 text-xs border transition ${
              isFavorited
                ? "bg-[var(--accent-2)] border-[var(--accent-2)] text-[var(--accent-contrast)] hover:brightness-95"
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--text)] hover:border-[var(--accent-2)]"
            }`}
          >
            {isFavorited ? "★ Favorited" : "☆ Favorite"}
          </button>
        )}

        {onEdit && (
          <button
            onClick={() => onEdit(snippet)}
            className="px-3 py-1 text-xs border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:brightness-95 active:translate-y-px"
          >
            {editLabel}
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(snippet)}
            className="px-3 py-1 text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-red-500 hover:text-red-500"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
