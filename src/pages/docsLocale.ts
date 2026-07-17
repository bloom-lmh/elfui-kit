import { useLocaleProvider } from "../components/Providers/context";

export type DocsMessage = Readonly<{ zh: string; en: string }>;
export type DocsMessages<Key extends string> = Readonly<Record<Key, DocsMessage>>;

/**
 * Creates a Provider-backed translator for documentation copy.
 * Keep each page's copy next to that page while sharing locale detection here.
 */
export const createDocsTranslator = <Key extends string>(messages: DocsMessages<Key>) => {
  const locale = useLocaleProvider();
  const isEnglish = (): boolean => locale.name.toLowerCase().startsWith("en");

  return (key: Key): string => {
    const message = messages[key];
    return isEnglish() ? message.en : message.zh;
  };
};
