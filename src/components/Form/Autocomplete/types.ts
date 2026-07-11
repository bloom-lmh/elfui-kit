export interface AutocompleteOption {
  value?: string;
  label?: string;
  disabled?: boolean;
}

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
}
