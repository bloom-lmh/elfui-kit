export interface AutocompleteOption {
  value?: string;
  label?: string;
  disabled?: boolean;
}

export type AutocompletePlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end";

export type AutocompleteFetchSuggestions = (
  query: string,
  callback: (items: AutocompleteOption[]) => void
) => void | Promise<AutocompleteOption[]>;

export interface AutocompletePopperModifier {
  name: string;
  enabled?: boolean;
  options?: {
    offset?: [number, number];
    padding?: number;
    [key: string]: unknown;
  };
}

export interface AutocompletePopperOptions {
  placement?: AutocompletePlacement;
  modifiers?: AutocompletePopperModifier[];
  [key: string]: unknown;
}

export interface AutocompleteProps {
  modelValue: string;
  options: AutocompleteOption[];
  fetchSuggestions?: AutocompleteFetchSuggestions;
  placeholder: string;
  disabled: boolean;
  clearable: boolean;
  triggerOnFocus: boolean;
  debounce: number;
  highlightFirstItem: boolean;
  loading: boolean;
  loadingText: string;
  placement: AutocompletePlacement;
  popperClass: string;
  popperStyle: Record<string, string | number>;
  popperOptions: AutocompletePopperOptions;
  teleported: boolean;
  appendTo: string | HTMLElement;
  fitInputWidth: boolean;
  id: string;
  name: string;
  ariaLabel: string;
  validateEvent: boolean;
}

export interface AutocompleteExpose {
  close: () => void;
}

export type AutocompleteElement = HTMLElement & AutocompleteExpose & Partial<AutocompleteProps>;
