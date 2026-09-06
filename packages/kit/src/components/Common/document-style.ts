import { globalStyle, onMounted, onUnmounted } from "@elfui/core";

interface DocumentStyleEntry {
  css: string;
  users: number;
  dispose: () => void;
}

const documentStyles = new Map<string, DocumentStyleEntry>();

/**
 * Retain one document-level style block without touching `document` during module import.
 * Teleported component content uses this because Shadow DOM styles cannot reach `body`.
 */
export const retainDocumentStyle = (id: string, css: string): (() => void) => {
  if (typeof document === "undefined") return () => {};

  let entry = documentStyles.get(id);
  if (!entry) {
    entry = {
      css,
      users: 0,
      dispose: globalStyle(css, { id }),
    };
    documentStyles.set(id, entry);
  } else if (entry.css !== css) {
    entry.dispose();
    entry.css = css;
    entry.dispose = globalStyle(css, { id });
  }

  entry.users += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    const active = documentStyles.get(id);
    if (!active) return;
    active.users -= 1;
    if (active.users > 0) return;
    active.dispose();
    documentStyles.delete(id);
  };
};

/** Register a shared document-level style for the lifetime of a component instance. */
export const useDocumentStyle = (id: string, css: string): void => {
  let release = (): void => {};
  onMounted(() => {
    release = retainDocumentStyle(id, css);
  });
  onUnmounted(() => release());
};
