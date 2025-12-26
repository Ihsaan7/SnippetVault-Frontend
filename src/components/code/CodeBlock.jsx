import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useMemo, useState } from "react";

const copyText = async (text) => {
  const value = String(text || "");

  // Prefer async clipboard API (requires secure context in most browsers)
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  // Fallback for non-secure contexts
  const ta = document.createElement("textarea");
  ta.value = value;
  ta.setAttribute("readonly", "");
  ta.style.position = "absolute";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
};

export function CodeBlock({
  code = "",
  language = "",
  className = "",
  copyOnClick = true,
  wrap = true,
}) {
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    const text = String(code || "");
    if (!text.trim()) return "";

    try {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(text, { language }).value;
      }
      return hljs.highlightAuto(text).value;
    } catch {
      return hljs.highlightAuto(text).value;
    }
  }, [code, language]);

  return (
    <div className="relative">
      <pre
        className={`${className} ${
          wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre overflow-x-auto"
        } ${copyOnClick ? "cursor-copy" : ""}`}
        title={copyOnClick ? "Click to copy" : undefined}
        onClick={
          copyOnClick
            ? async () => {
                try {
                  await copyText(code);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 900);
                } catch {
                  // ignore
                }
              }
            : undefined
        }
      >
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>

      {copyOnClick && (
        <div
          className={`pointer-events-none absolute top-2 right-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[10px] px-2 py-1 ${
            copied ? "opacity-100" : "opacity-0"
          }`}
        >
          Copied
        </div>
      )}
    </div>
  );
}
