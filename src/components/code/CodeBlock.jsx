import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useMemo } from "react";

export function CodeBlock({ code = "", language = "", className = "" }) {
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
    <pre className={className}>
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
