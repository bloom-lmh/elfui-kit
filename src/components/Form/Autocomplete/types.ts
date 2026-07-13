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
  id: string;
  name: string;
  ariaLabel: string;
  validateEvent: boolean;
}
