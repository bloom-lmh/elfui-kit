import {
    defineEmits,
    defineExpose,
    defineHtml,
    defineProps,
    defineStyle,
    html,
    onMount,
    onUnmount,
    useEffect,
    useHost,
    useHostAttr,
    useHostFlag,
    useRef,
} from "elfui";

import { useDisabled, useFormControl, useFormItem } from "../../../composables";
import { computeAnchoredPosition, listenForExternalOverlayMotion } from "../../Common/anchored-overlay";
import styles from "./style.scss?inline";
import { normalizeFieldVariant } from "../../../types/field";
import type {
    AutocompleteOption,
    AutocompletePlacement,
    AutocompletePopperModifier,
    AutocompletePopperOptions,
    AutocompleteProps,
    AutocompleteVariant,
} from "./types";

export type {
    AutocompleteElement,
    AutocompleteExpose,
    AutocompleteFetchSuggestions,
    AutocompleteOption,
    AutocompletePlacement,
    AutocompletePopperModifier,
    AutocompletePopperOptions,
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
    label: { type: String, default: "" },
    variant: { type: String, default: "filled" },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    triggerOnFocus: { type: Boolean, default: true },
    debounce: { type: Number, default: 300 },
    highlightFirstItem: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    loadingText: { type: String, default: "Loading..." },
    placement: { type: String, default: "bottom-start" },
    popperClass: { type: String, default: "" },
    popperStyle: { type: Object, default: () => ({}) },
    popperOptions: { type: Object, default: () => ({}) },
    teleported: { type: Boolean, default: true },
    appendTo: { type: [String, Object], default: "body" },
    fitInputWidth: { type: Boolean, default: false },
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
const host = useHost();
const open = useRef(false);
const suggestions = useRef<AutocompleteOption[] | null>(null);
const activeIndex = useRef(-1);
const pending = useRef(false);
const overlayStyle = useRef<Record<string, string>>({});
const resolvedPlacement = useRef<AutocompletePlacement>("bottom-start");
let requestId = 0;
let debounceTimer: ReturnType<typeof setTimeout> | undefined;
let blurTimer: ReturnType<typeof setTimeout> | undefined;
let cleanupAnchoredOverlay = (): void => {};
let overlayFrame = 0;
let mounted = false;
const listboxId = `elf-autocomplete-${Math.random().toString(36).slice(2)}`;

const resolvePlacement = (value: unknown): AutocompletePlacement => {
    const next = String(value || "bottom-start") as AutocompletePlacement;
    return ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"].includes(next)
        ? next
        : "bottom-start";
};

const toStyleObject = (value: unknown): Record<string, string> => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
        Object.entries(value as Record<string, string | number>).map(([key, item]) => [key, String(item)]),
    );
};

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

const popperOptions = (): AutocompletePopperOptions =>
    props.popperOptions && typeof props.popperOptions === "object"
        ? props.popperOptions as AutocompletePopperOptions
        : {};

const placement = (): AutocompletePlacement => resolvePlacement(popperOptions().placement || props.placement);

const modifier = (name: string): AutocompletePopperModifier | undefined =>
    popperOptions().modifiers?.find((item) => item.name === name && item.enabled !== false);

const offset = (): [number, number] => modifier("offset")?.options?.offset || [0, 6];

const overflowPadding = (): number => Math.max(0, Number(modifier("preventOverflow")?.options?.padding) || 8);

const flipEnabled = (): boolean => modifier("flip")?.enabled !== false;

const isLoading = (): boolean => Boolean(props.loading || pending.value);

const shouldShowPanel = (): boolean => open.value && (isLoading() || options().length > 0);

const panelClass = (): unknown[] => [
    "panel",
    props.popperClass,
    `placement-${resolvedPlacement.value}`,
    { status: isLoading(), "is-teleported": props.teleported },
];

const panelStyle = (): Record<string, string> => ({
    ...toStyleObject(props.popperStyle),
    ...(props.teleported ? overlayStyle.value : {}),
});

const getPanelEl = (): HTMLElement | null => host.shadowRoot?.querySelector<HTMLElement>(".panel") || null;
const getInputEl = (): HTMLInputElement | null => host.shadowRoot?.querySelector<HTMLInputElement>("input") || null;

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
    if (blurTimer) clearTimeout(blurTimer);
    if (props.triggerOnFocus && !isDisabled()) {
        scheduleSuggestions(String(ctl.model.value || ""));
        open.set(true);
        resetActive();
    }
};

const onBlur = (event: FocusEvent): void => {
    ctl.dispatchBlur(event);
    if (blurTimer) clearTimeout(blurTimer);
    blurTimer = setTimeout(() => {
        blurTimer = undefined;
        open.set(false);
    }, 120);
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

const updateOverlayPosition = (): void => {
    if (!props.teleported || typeof window === "undefined") {
        overlayStyle.set({});
        resolvedPlacement.set(placement());
        return;
    }
    const input = getInputEl();
    const panel = getPanelEl();
    if (!input || !panel) return;

    const anchorRect = input.getBoundingClientRect();
    if (anchorRect.width === 0 && anchorRect.height === 0) {
        resolvedPlacement.set(placement());
        return;
    }
    const panelRect = panel.getBoundingClientRect();
    const visualViewport = window.visualViewport;
    const width = props.fitInputWidth
        ? anchorRect.width
        : Math.max(anchorRect.width, panelRect.width || panel.offsetWidth || 240);
    const next = computeAnchoredPosition(
        anchorRect,
        { width, height: panelRect.height || panel.offsetHeight || 0 },
        {
            width: visualViewport?.width || window.innerWidth,
            height: visualViewport?.height || window.innerHeight,
            offsetLeft: visualViewport?.offsetLeft || 0,
            offsetTop: visualViewport?.offsetTop || 0,
        },
        {
            placement: placement(),
            offset: offset(),
            padding: overflowPadding(),
            flip: flipEnabled(),
        },
    );
    resolvedPlacement.set(next.placement);
    overlayStyle.set({
        position: "fixed",
        left: `${Math.round(next.left * 100) / 100}px`,
        top: `${Math.round(next.top * 100) / 100}px`,
        right: "auto",
        bottom: "auto",
        margin: "0",
        width: props.fitInputWidth ? `${Math.round(width * 100) / 100}px` : "auto",
        minWidth: `${Math.round(anchorRect.width * 100) / 100}px`,
    });
};

const requestOverlayUpdate = (): void => {
    if (typeof window === "undefined") return;
    if (overlayFrame) cancelAnimationFrame(overlayFrame);
    overlayFrame = requestAnimationFrame(() => {
        overlayFrame = 0;
        updateOverlayPosition();
    });
};

const syncTopLayer = (): void => {
    const panel = getPanelEl() as (HTMLElement & {
        showPopover?: () => void;
        hidePopover?: () => void;
    }) | null;
    if (!panel) return;
    try {
        if (props.teleported && shouldShowPanel()) panel.showPopover?.();
        else panel.hidePopover?.();
    } catch {
        // Disconnecting or rapidly replacing a conditional panel may change its popover state first.
    }
    if (shouldShowPanel()) requestOverlayUpdate();
};

const connectAnchoredOverlay = (): void => {
    cleanupAnchoredOverlay();
    if (!props.teleported || typeof window === "undefined") return;

    const input = getInputEl();
    const panel = getPanelEl();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(requestOverlayUpdate) : undefined;
    if (input) observer?.observe(input);
    if (panel) observer?.observe(panel);

    const cleanupOverlayMotion = listenForExternalOverlayMotion(() => [panel], close);

    window.addEventListener("resize", requestOverlayUpdate, { passive: true });
    window.visualViewport?.addEventListener("resize", requestOverlayUpdate, { passive: true });

    cleanupAnchoredOverlay = () => {
        observer?.disconnect();
        cleanupOverlayMotion();
        window.removeEventListener("resize", requestOverlayUpdate);
        window.visualViewport?.removeEventListener("resize", requestOverlayUpdate);
    };
    syncTopLayer();
    requestOverlayUpdate();
};

const close = (): void => {
    open.set(false);
    activeIndex.set(-1);
};

useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostAttr("data-state", () => fi.state);
useHostFlag("disabled", isDisabled);
useHostFlag("data-open", () => open.value);
useHostFlag("data-dirty", () => Boolean(ctl.model.value));
useHostFlag("data-has-label", () => Boolean(props.label));

useEffect(() => {
    void open.value;
    void pending.value;
    void props.loading;
    void props.teleported;
    void props.placement;
    void props.popperOptions;
    void props.fitInputWidth;
    if (mounted) queueMicrotask(() => {
        syncTopLayer();
        connectAnchoredOverlay();
    });
});

onMount(() => {
    mounted = true;
    connectAnchoredOverlay();
});

onUnmount(() => {
    mounted = false;
    requestId += 1;
    if (debounceTimer) clearTimeout(debounceTimer);
    if (blurTimer) clearTimeout(blurTimer);
    cleanupAnchoredOverlay();
    if (overlayFrame) cancelAnimationFrame(overlayFrame);
});

defineExpose({ close });

defineStyle(styles);

const Autocomplete = defineHtml<AutocompleteProps>(html`
    <div
        class="autocomplete"
        part="autocomplete"
        :class=${[
            `placement-${placement()}`,
            { loading: isLoading() },
        ]}
        :data-state=${fi.state || null}
    >
        <span v-if=${props.label} class="field-label">${props.label}</span>
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
            v-if=${shouldShowPanel()}
            ref="panelEl"
            :id=${isLoading() ? null : listboxId}
            :class=${panelClass()}
            :style=${panelStyle()}
            part="panel"
            :popover=${props.teleported ? "manual" : undefined}
            :data-append-to=${typeof props.appendTo === "string" ? props.appendTo : "element"}
            :role=${isLoading() ? "status" : "listbox"}
        >
            <slot v-if=${isLoading()} name="loading">${props.loadingText}</slot>
            <template v-else>
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
            </template>
        </div>
    </div>
`);

export { Autocomplete };
