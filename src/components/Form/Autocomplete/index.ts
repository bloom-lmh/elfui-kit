import {
    defineEmits,
    defineHtml,
    defineProps,
    defineStyle,
    html,
    useRef,
} from "elfui";

import styles from "./style.scss?inline";
import type { AutocompleteOption, AutocompleteProps } from "./types";

export type {
    AutocompleteFetchSuggestions,
    AutocompleteOption,
    AutocompleteProps,
} from "./types";

interface ViewOption {
    label: string;
    text: string;
    disabled: boolean;
    index: number;
}

const props = defineProps<AutocompleteProps>({
    modelValue: { type: String, default: "" },
    options: { type: Array, default: () => [] },
    fetchSuggestions: { type: Function, default: undefined },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    triggerOnFocus: { type: Boolean, default: true },
});

const emit = defineEmits([
    "update:modelValue",
    "input",
    "change",
    "select",
    "focus",
    "blur",
    "clear",
]);
const open = useRef(false);
const suggestions = useRef<AutocompleteOption[]>([]);

const normalize = (items: AutocompleteOption[]): ViewOption[] =>
    items.map((item, index) => ({
        label: String(item.label ?? item.value ?? ""),
        text: String(item.value ?? item.label ?? ""),
        disabled: Boolean(item.disabled),
        index,
    }));

const sourceOptions = (): AutocompleteOption[] => {
    const source = suggestions.value.length
        ? suggestions.value
        : props.options || [];
    const query = String(props.modelValue || "").toLowerCase();
    return query
        ? source.filter((item) =>
              String(item.label ?? item.value ?? "")
                  .toLowerCase()
                  .includes(query),
          )
        : source;
};

const options = (): ViewOption[] => normalize(sourceOptions());

const loadSuggestions = async (query: string): Promise<void> => {
    const fetcher = props.fetchSuggestions;
    if (!fetcher) {
        suggestions.set(props.options || []);
        return;
    }
    const result = await fetcher(query, (items) =>
        suggestions.set(items || []),
    );
    if (Array.isArray(result)) suggestions.set(result);
};

const setValue = (
    value: string,
    eventName: "input" | "change" = "input",
): void => {
    emit("update:modelValue", value);
    emit(eventName, value);
};

const onInput = (event: Event): void => {
    const value = (event.target as HTMLInputElement).value;
    setValue(value, "input");
    void loadSuggestions(value);
    open.set(true);
};

const onFocus = (event: Event): void => {
    emit("focus", event);
    if (props.triggerOnFocus) {
        void loadSuggestions(props.modelValue || "");
        open.set(true);
    }
};

const onBlur = (event: Event): void => {
    emit("blur", event);
    setTimeout(() => open.set(false), 120);
};

const selectAt = (index: number): void => {
    const option = options()[index];
    if (!option || option.disabled) return;
    setValue(option.text, "change");
    emit("select", sourceOptions()[index]);
    open.set(false);
};

const onOptionClick = (event: Event): void => {
    const index = Number((event.currentTarget as HTMLElement).dataset.index);
    if (Number.isInteger(index)) selectAt(index);
};

const clear = (): void => {
    setValue("", "change");
    emit("clear");
};

const showClear = (): boolean =>
    Boolean(props.clearable && props.modelValue && !props.disabled);

defineStyle(styles);

const Autocomplete = defineHtml<AutocompleteProps>(html`
    <div class="autocomplete" part="autocomplete">
        <input
            part="input"
            :value.prop=${props.modelValue}
            :placeholder=${props.placeholder}
            :disabled=${props.disabled}
            @input=${onInput}
            @focus=${onFocus}
            @blur=${onBlur}
        />
        <button
            v-if=${showClear()}
            class="clear"
            type="button"
            aria-label="Clear"
            @click=${clear}
        >
            x
        </button>
        <div v-if=${open.value && options().length} class="panel" part="panel">
            <button
                v-for="item in options()"
                :key="item.index"
                class="option"
                type="button"
                :data-index="item.index"
                :disabled="item.disabled"
                @mousedown=${onOptionClick}
            >
                {{ item.label }}
            </button>
        </div>
    </div>
`);

export { Autocomplete };
