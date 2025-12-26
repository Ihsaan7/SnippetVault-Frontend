import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useMemo, useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

const copyText = async (text) => {
  const value = String(text || "");

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

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
  const { isDark } = useTheme();

  useEffect(() => {
    const loadTheme = async () => {
      if (isDark) {
        await import("highlight.js/styles/github-dark.css");
      } else {
        await import("highlight.js/styles/github.css");
      }
    };
    loadTheme();
  }, [isDark]);

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
    <div className="relative group">
      <pre
        className={`${className} ${
          wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre overflow-x-auto"
        } ${copyOnClick ? "cursor-pointer" : ""}`}
        title={copyOnClick ? "Click to copy" : undefined}
        onClick={
          copyOnClick
            ? async () => {
                try {
                  await copyText(code);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1500);
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
          className={`absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
            copied
              ? "bg-[var(--accent)] text-white opacity-100 scale-100"
              : "bg-[var(--surface-2)] text-[var(--muted)] opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
          }`}
        >
          {copied ? (
            <>
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 16 16"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 8l3 3 7-7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 16 16"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="5" y="5" width="8" height="10" rx="1" />
                <path d="M3 11V3a1 1 0 0 1 1-1h6" />
              </svg>
              Copy
            </>
          )}
        </div>
      )}
    </div>
  );
}
