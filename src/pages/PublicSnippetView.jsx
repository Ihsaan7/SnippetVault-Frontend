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
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-slate-300">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-3xl mx-auto bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!snippet) return null;

  const shareUrl = `${window.location.origin}/public/snippets/${snippet._id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{snippet.title}</h1>
            <p className="text-slate-400 text-sm">
              {snippet.codeLanguage}
              {snippet.owner?.username ? ` • by ${snippet.owner.username}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shareUrl);
                } catch {
                  // ignore
                }
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
            >
              Copy Link
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Fork
            </button>
          </div>
        </div>

        {snippet.description && (
          <p className="text-slate-200 mb-4">{snippet.description}</p>
        )}

        <CodeBlock
          code={snippet.code}
          language={snippet.codeLanguage}
          className="bg-slate-900 text-slate-200 rounded p-4 text-sm overflow-x-auto"
        />
      </div>
    </div>
  );
}
