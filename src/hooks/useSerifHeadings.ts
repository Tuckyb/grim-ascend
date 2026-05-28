import { useEffect, useState } from "react";

/**
 * Persistent toggle for serif headings.
 * Adds/removes `serif-headings` class on <body>; CSS in index.css handles the swap.
 */
const STORAGE_KEY = "grim:serif-headings";

export function useSerifHeadings() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });

  useEffect(() => {
    document.body.classList.toggle("serif-headings", enabled);
    window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  }, [enabled]);

  return [enabled, setEnabled] as const;
}
