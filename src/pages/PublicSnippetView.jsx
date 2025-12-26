import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CodeBlock } from "../components/code/CodeBlock";
import { useAuth } from "../context/AuthContext";
import { useSnippet } from "../context/SnippetContext";

export function PublicSnippetView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isVerified } = useAuth();
  const { getPublicSnippetByID, forkPublicSnippet } = useSnippet();

  const [snippet, setSnippet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [forking, setForking] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getPublicSnippetByID(id);
        setSnippet(data);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load public snippet");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="skeleton h-8 w-1/2 rounded"></div>
        <div className="skeleton h-4 w-1/3 rounded"></div>
        <div className="skeleton h-64 rounded-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card p-6 border-[var(--danger)] bg-[var(--danger-muted)] text-[var(--danger)]">
          {error}
        </div>
      </div>
    );
  }

  if (!snippet) return null;

  const shareUrl = `${window.location.origin}/public/snippets/${snippet._id}`;

  const handleFork = async () => {
    if (!isVerified) {
      navigate("/login");
      return;
    }
    try {
      setForking(true);
      const fork = await forkPublicSnippet(snippet._id);
      navigate(`/dashboard/snippets/${fork._id}/edit`);
    } catch {
      // ignore
    } finally {
      setForking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/public/snippets")}
        className="btn btn-ghost text-sm -ml-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 16 16"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M10 4L6 8l4 4" />
        </svg>
        Back to explore
      </button>

      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">
              {snippet.title}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-[var(--muted)]">
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-[var(--surface-2)] text-[var(--text-secondary)]">
                {snippet.codeLanguage}
              </span>
              {snippet.owner?.username && (
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 16 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="8" cy="5" r="2.5" />
                    <path d="M3 14c0-2.5 2.5-4 5-4s5 1.5 5 4" />
                  </svg>
                  {snippet.owner.username}
                </span>
              )}
              {snippet.createdAt && (
                <span>
                  {new Date(snippet.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: snippet.title || "Snippet",
                      text: "Check this snippet",
                      url: shareUrl,
                    });
                    return;
                  } catch {
                    // ignore
                  }
                }

                try {
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                } catch {
                  // ignore
                }

                try {
                  await navigator.clipboard.writeText(shareUrl);
                } catch {
                  // ignore
                }
              }}
              className="btn btn-secondary"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 16 16"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 10l4-4M6 6h4v4M3 9v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9" />
              </svg>
              Share
            </button>

            <button
              onClick={handleFork}
              disabled={forking}
              className="btn btn-primary"
            >
              {forking ? (
                <>
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
                  Forking...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 16 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="8" cy="3" r="1.5" />
                    <circle cx="4" cy="12" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <path d="M8 4.5v4l-4 3m8-3l-4-3" />
                  </svg>
                  Fork
                </>
              )}
            </button>
          </div>
        </div>

        {snippet.description && (
          <p className="text-[var(--text-secondary)] mb-6">{snippet.description}</p>
        )}

        {snippet.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {snippet.tags.map((tag, i) => (
              <span key={`${tag}-${i}`} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <CodeBlock
          code={snippet.code}
          language={snippet.codeLanguage}
          className="bg-[var(--code-bg)] text-[var(--code-text)] border border-[var(--border)] p-4 text-sm rounded-md"
        />
      </div>
    </div>
  );
}
