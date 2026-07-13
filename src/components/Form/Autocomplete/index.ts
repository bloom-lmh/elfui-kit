import { defineEmits, defineHtml, defineProps, defineStyle, html, useRef, useTemplateRef } from "elfui";

import { useDisabled, useFormControl, useFormItem } from "../../../composables";
import styles from "./style.scss?inline";
import type { AutocompleteOption, AutocompleteProps } from "./types";

export type {
    AutocompleteFetchSuggestions,
    AutocompleteOption,
    AutocompletePlacement,
    AutocompleteProps,
} from "./types";

interface ViewOption {
    key: string;
    label: string;
    text: string;
    disabled: boolean;
    index: number;
    raw: AutocompleteOption;
}

const props = defineProps<AutocompleteProps>({
    modelValue: { type: String, default: "" },
    options: { type: Array, default: () => [] },
    fetchSuggestions: { type: Function, default: undefined },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    triggerOnFocus: { type: Boolean, default: true },
    debounce: { type: Number, default: 300 },
    highlightFirstItem: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    loadingText: { type: String, default: "Loading..." },
    placement: { type: String, default: "bottom-start" },
    id: { type: String, default: "" },
    name: { type: String, default: "" },
    ariaLabel: { type: String, default: "" },
    validateEvent: { type: Boolean, default: true },
});

const emit = defineEmits<{
    "update:modelValue": [value: string];
    input: [value: string];
    change: [value: string];
    select: [option: AutocompleteOption];
    focus: [event: FocusEvent];
    blur: [event: FocusEvent];
    clear: [];
}>();

const ctl = useFormControl<string>(props, emit, {
    triggers: props.validateEvent === false ? { input: false, change: false, blur: false } : undefined,
});
const fi = useFormItem(() => "");
const isDisabled = useDisabled(() => Boolean(props.disabled));
const inputRef = useTemplateRef<HTMLInputElement>("inputEl");
const open = useRef(false);
const suggestions = useRef<AutocompleteOption[] | null>(null);
const activeIndex = useRef(-1);
const pending = useRef(false);
let requestId = 0;
let debounceTimer: ReturnType<typeof setTimeout> | undefined;
const listboxId = `elf-autocomplete-${Math.random().toString(36).slice(2)}`;

const normalize = (items: AutocompleteOption[]): ViewOption[] =>
    items.map((item, index) => ({
        key: `${index}-${String(item.value ?? item.label ?? "")}`,
        label: String(item.label ?? item.value ?? ""),
        text: String(item.value ?? item.label ?? ""),
        disabled: Boolean(item.disabled),
        index,
        raw: item,
    }));

const sourceOptions = (): AutocompleteOption[] => {
    const source = suggestions.value ?? props.options ?? [];
    const query = String(ctl.model.value || "").toLowerCase();
    return query
        ? source.filter((item) =>
              String(item.label ?? item.value ?? "")
                  .toLowerCase()
                  .includes(query),
          )
        : source;
};

const options = (): ViewOption[] => normalize(sourceOptions());

const resetActive = (): void => {
    const firstEnabled = options().findIndex((option) => !option.disabled);
    activeIndex.set(props.highlightFirstItem ? firstEnabled : -1);
};

const loadSuggestions = async (query: string): Promise<void> => {
    const fetcher = props.fetchSuggestions;
    if (!fetcher) {
        suggestions.set(null);
        resetActive();
        return;
    }
    const currentRequest = ++requestId;
    pending.set(true);
    suggestions.set([]);
    try {
        const result = await fetcher(query, (items) => {
            if (currentRequest !== requestId) return;
            suggestions.set(items || []);
            resetActive();
        });
        if (currentRequest === requestId && Array.isArray(result)) {
            suggestions.set(result);
            resetActive();
        }
    } finally {
        if (currentRequest === requestId) pending.set(false);
    }
};

const scheduleSuggestions = (query: string): void => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const delay = Math.max(0, Number(props.debounce) || 0);
    if (!props.fetchSuggestions || delay === 0) {
        void loadSuggestions(query);
        return;
    }
    debounceTimer = setTimeout(() => {
        debounceTimer = undefined;
        void loadSuggestions(query);
    }, delay);
};

const setValue = (value: string, eventName: "input" | "change" = "input"): void => {
    if (eventName === "input") {
        ctl.dispatchInput(value);
        return;
    }
    ctl.setValue(value);
    ctl.dispatchChange(value);
};

const onInput = (event: Event): void => {
    const value = (event.target as HTMLInputElement).value;
    // A remote result belongs to the previous query until the new request resolves.
    // Clearing it here prevents stale labels from being paired with the new query.
    if (props.fetchSuggestions) suggestions.set([]);
    setValue(value, "input");
    scheduleSuggestions(value);
    open.set(true);
    resetActive();
};

const onFocus = (event: Event): void => {
    ctl.dispatchFocus(event);
    if (props.triggerOnFocus && !isDisabled()) {
        scheduleSuggestions(String(ctl.model.value || ""));
        open.set(true);
        resetActive();
    }
};

const onBlur = (event: FocusEvent): void => {
    ctl.dispatchBlur(event);
    setTimeout(() => open.set(false), 120);
};

const selectAt = (index: number): void => {
    // Capture the rendered option before updating the model. Updating the model
    // immediately changes the filtered list, so looking it up afterwards can select
    // a different item at the same index.
    const option = options()[index];
    if (!option || option.disabled) return;
    setValue(option.text, "change");
    emit("select", option.raw);
    open.set(false);
    activeIndex.set(-1);
};

const onOptionClick = (event: Event): void => {
    const index = Number((event.currentTarget as HTMLElement).dataset.index);
    if (Number.isInteger(index)) selectAt(index);
};

const clear = (): void => {
    if (isDisabled()) return;
    setValue("", "change");
    emit("clear");
};

const showClear = (): boolean => Boolean(props.clearable && ctl.model.value && !isDisabled());

const moveActive = (step: 1 | -1): void => {
    const items = options();
    if (!items.length) return;
    let index = activeIndex.value;
    for (let attempt = 0; attempt < items.length; attempt += 1) {
        index = (index + step + items.length) % items.length;
        if (!items[index].disabled) {
            activeIndex.set(index);
            return;
        }
    }
};

const onKeydown = (event: KeyboardEvent): void => {
    if (isDisabled()) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!open.value) {
            open.set(true);
            scheduleSuggestions(String(ctl.model.value || ""));
            resetActive();
        }
        moveActive(event.key === "ArrowDown" ? 1 : -1);
        return;
    }
    if (event.key === "Enter" && open.value && activeIndex.value >= 0) {
        event.preventDefault();
        selectAt(activeIndex.value);
        return;
    }
    if (event.key === "Escape") {
        open.set(false);
        activeIndex.set(-1);
    }
};

const onOptionMouseenter = (event: Event): void => {
    const index = Number((event.currentTarget as HTMLElement).dataset.index);
    if (Number.isInteger(index) && !options()[index]?.disabled) activeIndex.set(index);
};

defineStyle(styles);

const Autocomplete = defineHtml<AutocompleteProps>(html`
    <div
        class="autocomplete"
        part="autocomplete"
        :class=${[
            `placement-${props.placement as AutocompletePlacement}`,
            { loading: Boolean(props.loading || pending.value) },
        ]}
        :data-state=${fi.state || null}
    >
        <input
            ref="inputEl"
            part="input"
            :id=${props.id || null}
            :name=${props.name || null}
            :value.prop=${ctl.model.value}
            :placeholder=${props.placeholder}
            :disabled=${isDisabled()}
            :aria-label=${props.ariaLabel || null}
            role="combobox"
            aria-autocomplete="list"
            :aria-expanded=${open.value ? "true" : "false"}
            :aria-controls=${listboxId}
            :aria-activedescendant=${activeIndex.value >= 0 ? `${listboxId}-option-${activeIndex.value}` : null}
            @input=${onInput}
            @focus=${onFocus}
            @blur=${onBlur}
            @keydown=${onKeydown}
        />
        <button v-if=${showClear()} class="clear" type="button" aria-label="Clear" @click=${clear}>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8"></path></svg>
        </button>
        <div
            v-if=${open.value && Boolean(props.loading || pending.value)}
            class="panel status"
            part="panel"
            role="status"
        >
            <slot name="loading">${props.loadingText}</slot>
        </div>
        <div v-else-if=${open.value && options().length} :id=${listboxId} class="panel" part="panel" role="listbox">
            <button
                v-for="item in options()"
                :key="item.key"
                :id="\`${listboxId}-option-\${item.index}\`"
                class="option"
                type="button"
                :data-index="item.index"
                :disabled="item.disabled"
                role="option"
                :aria-selected="activeIndex.value === item.index ? 'true' : 'false'"
                :class="{ active: activeIndex.value === item.index }"
                @mousedown=${onOptionClick}
                @mouseenter=${onOptionMouseenter}
            >
                <slot :item="item">{{ item.label }}</slot>
            </button>
        </div>
    </div>
`);

export { Autocomplete };
