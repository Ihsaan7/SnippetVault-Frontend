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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6">
        <div className="max-w-4xl mx-auto border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6">
        <div className="max-w-3xl mx-auto border border-red-500 bg-[var(--surface)] p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!snippet) return null;

  const shareUrl = `${window.location.origin}/public/snippets/${snippet._id}`;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">{snippet.title}</h1>
            <p className="text-[var(--muted)] text-sm">
              {snippet.codeLanguage}
              {snippet.owner?.username ? ` • by ${snippet.owner.username}` : ""}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={async () => {
                // Prefer native share; fallback to WhatsApp + copy
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
              className="px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-sm hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Share
            </button>

            <button
              onClick={async () => {
                if (!isVerified) {
                  navigate("/login");
                  return;
                }
                const fork = await forkPublicSnippet(snippet._id);
                navigate(`/dashboard/snippets/${fork._id}/edit`);
              }}
              className="px-4 py-2 border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] text-sm font-semibold hover:brightness-95 active:translate-y-px"
            >
              Fork
            </button>
          </div>
        </div>

        {snippet.description && (
          <p className="text-[var(--text)]/80">{snippet.description}</p>
        )}

        <CodeBlock
          code={snippet.code}
          language={snippet.codeLanguage}
          className="bg-[var(--code-bg)] text-[var(--code-text)] border border-[var(--border)] p-4 text-sm"
        />
      </div>
    </div>
  );
}
