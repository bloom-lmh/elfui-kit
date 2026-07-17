// elf-select — 下拉选择

import {
    defineExpose,
    defineEmits,
    defineHtml,
    defineProps,
    defineStyle,
    html,
    onMount,
    onUnmount,
    useClickOutside,
    useEffect,
    useEventListener,
    useHost,
    useHostAttr,
    useHostCssVar,
    useHostFlag,
    useRef,
} from "elfui";

import { useDisabled, useFormItem } from "../../../composables";
import { listenForExternalOverlayMotion } from "../../Common/anchored-overlay";
import { useLocaleProvider } from "../../Providers/context";
import styles from "./style.scss?inline";
import { normalizeFieldVariant } from "../../../types/field";

import type {
    SelectFieldNames,
    SelectOption,
    SelectProps,
    SelectValue,
} from "./types";

export type {
    SelectFieldNames,
    SelectOption,
    SelectProps,
    SelectSize,
    SelectVariant,
    SelectValue,
} from "./types";

const SELECT_OPEN_EVENT = "elf-select-open";

const props = defineProps<SelectProps>({
    modelValue: { type: null, default: "" },
    options: { type: Array, default: () => [] as SelectOption[] },
    props: {
        type: Object,
        default: () => ({
            value: "value",
            label: "label",
            disabled: "disabled",
            options: "options",
        }),
    },
    size: { type: String, default: "" },
    variant: { type: String, default: "filled" },
    label: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    valueKey: { type: String, default: "value" },
    clearable: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    collapseTags: { type: Boolean, default: false },
    maxCollapseTags: { type: Number, default: 1 },
    collapseTagsTooltip: { type: Boolean, default: false },
    multipleLimit: { type: Number, default: 0 },
    filterable: { type: Boolean, default: false },
    allowCreate: { type: Boolean, default: false },
    filterMethod: { type: Function, default: undefined },
    remote: { type: Boolean, default: false },
    remoteMethod: { type: Function, default: undefined },
    debounce: { type: Number, default: 300 },
    reserveKeyword: { type: Boolean, default: true },
    defaultFirstOption: { type: Boolean, default: false },
    automaticDropdown: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    loadingText: { type: String, default: "" },
    noDataText: { type: String, default: "" },
    noMatchText: { type: String, default: "" },
    valueOnClear: { type: null, default: undefined },
    emptyValues: { type: Array, default: () => [undefined, null, ""] },
    height: { type: Number, default: 240 },
    fitInputWidth: { type: Boolean, default: false },
    tabindex: { type: null, default: 0 },
    id: { type: String, default: "" },
    name: { type: String, default: "" },
});

const emit = defineEmits<{
    "update:modelValue": [value: SelectValue | SelectValue[]];
    change: [value: SelectValue | SelectValue[]];
    clear: [];
    "visible-change": [visible: boolean];
    blur: [event: FocusEvent];
    focus: [event: FocusEvent];
    "remove-tag": [value: SelectValue];
    "popup-scroll": [data: { scrollTop: number; scrollLeft: number }];
    "end-reached": [direction: "top" | "bottom"];
    search: [query: string];
}>();

const fi = useFormItem(() => props.size as string);

const isDisabled = useDisabled(() => Boolean(props.disabled));

const host = useHost();
const locale = useLocaleProvider();

const open = useRef(false);

const filterText = useRef("");

const rendered = useRef(false);

const closing = useRef(false);

const innerValue = useRef<unknown>(props.modelValue);

let remoteTimer: ReturnType<typeof setTimeout> | null = null;

const placeholderText = (): string => props.placeholder || locale.t("common.select");
const loadingText = (): string => props.loadingText || locale.t("table.loading");
const noDataText = (): string => props.noDataText || locale.t("table.empty");
const noMatchText = (): string => props.noMatchText || locale.t("field.noMatch");

useEffect(() => {
    innerValue.set(props.modelValue);
});

useEffect(() => {
    if (open.value) {
        rendered.set(true);
        closing.set(false);
    } else if (rendered.peek()) {
        closing.set(true);
        const timer = setTimeout(() => {
            rendered.set(false);
            closing.set(false);
        }, 200);
        return () => clearTimeout(timer);
    }
});

useHostFlag("data-open", () => open.value);

useHostAttr("data-state", () => fi.state);

useHostFlag("disabled", isDisabled);

useHostAttr("size", () => fi.formSize);
useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostFlag("data-has-label", () => Boolean(props.label));

useHostCssVar(
    "--_select-dropdown-height",
    () => `${Math.max(80, Number(props.height) || 240)}px`,
);

const closeDropdown = (emitChange = true): void => {
    if (!open.peek()) return;
    open.set(false);
    filterText.set("");
    if (emitChange) emit("visible-change", false);
};

const getDropdownEl = (): HTMLElement | null =>
    host.shadowRoot?.querySelector<HTMLElement>(".dropdown") ?? null;

const openDropdown = (): void => {
    if (isDisabled() || open.peek()) return;
    document.dispatchEvent(
        new CustomEvent(SELECT_OPEN_EVENT, { detail: host }),
    );
    open.set(true);
    emit("visible-change", true);
};

useClickOutside(host, () => {
    closeDropdown();
});

let cleanupOverlayMotion = (): void => {};
onMount(() => {
    cleanupOverlayMotion = listenForExternalOverlayMotion(
        () => [getDropdownEl()],
        () => closeDropdown(),
    );
});
onUnmount(() => cleanupOverlayMotion());

useEventListener<CustomEvent<HTMLElement>>(document, SELECT_OPEN_EVENT, (e) => {
    if (e.detail !== host) closeDropdown();
});

const isMulti = (): boolean => Boolean(props.multiple);

const fieldNames = (): Required<SelectFieldNames> => {
    const fields = (props.props || {}) as SelectFieldNames;
    return {
        value: fields.value || "value",
        label: fields.label || "label",
        disabled: fields.disabled || "disabled",
        options: fields.options || "options",
    };
};

const rawOptions = (): SelectOption[] =>
    Array.isArray(props.options) ? (props.options as SelectOption[]) : [];

const optionChildren = (option: SelectOption): SelectOption[] => {
    const children = option[fieldNames().options];
    return Array.isArray(children) ? (children as SelectOption[]) : [];
};

const flatOptions = (): SelectOption[] => {
    const result: SelectOption[] = [];
    const walk = (items: SelectOption[], groupDisabled = false): void => {
        for (const option of items) {
            const children = optionChildren(option);
            if (children.length > 0) {
                walk(
                    children.map((child) => ({
                        ...child,
                        disabled: groupDisabled || Boolean(child.disabled),
                    })),
                    groupDisabled || isOptionDisabled(option),
                );
            } else {
                result.push(option);
            }
        }
    };
    walk(rawOptions());
    return result;
};

const optionValue = (option: SelectOption): SelectValue =>
    (option[fieldNames().value] ??
        option.value ??
        option[fieldNames().label] ??
        option.label ??
        "") as SelectValue;

const optionLabel = (option: SelectOption): string =>
    String(
        option[fieldNames().label] ?? option.label ?? optionValue(option) ?? "",
    );

const isOptionDisabled = (option: SelectOption): boolean =>
    Boolean(option[fieldNames().disabled] ?? option.disabled);

const valueIdentity = (value: unknown): unknown => {
    if (value && typeof value === "object") {
        return (
            (value as Record<string, unknown>)[props.valueKey || "value"] ??
            value
        );
    }
    return value;
};

const sameValue = (a: unknown, b: unknown): boolean =>
    Object.is(valueIdentity(a), valueIdentity(b));

const isEmptyValue = (value: unknown): boolean =>
    (Array.isArray(props.emptyValues)
        ? props.emptyValues
        : [undefined, null, ""]
    ).some((item) => Object.is(item, value));

const valueArr = (): SelectValue[] => {
    const v = innerValue.value;
    if (isMulti() && Array.isArray(v)) return v as SelectValue[];
    return !isEmptyValue(v) ? [v as SelectValue] : [];
};

const filteredOptions = (): SelectOption[] => {
    const opts = flatOptions();
    if (!props.filterable || props.remote || !filterText.value) return opts;
    if (typeof props.filterMethod === "function") {
        return opts.filter((option) =>
            props.filterMethod?.(filterText.value, option),
        );
    }
    const q = filterText.value.toLowerCase();
    return opts.filter((o) => optionLabel(o).toLowerCase().includes(q));
};

const createdOption = (): SelectOption | null => {
    const query = filterText.value.trim();
    if (!props.allowCreate || !props.filterable || query.length === 0)
        return null;
    const exists = flatOptions().some(
        (option) => String(optionLabel(option)) === query,
    );
    return exists ? null : { label: query, value: query };
};

const viewOptions = (): SelectOption[] => {
    const created = createdOption();
    return created ? [created, ...filteredOptions()] : filteredOptions();
};

const viewOptionEntries = (): Array<{
    option: SelectOption;
    index: number;
    key: string;
}> =>
    viewOptions().map((option, index) => ({
        option,
        index,
        key: `${index}-${String(valueIdentity(optionValue(option)))}`,
    }));

const selectedOptions = (): SelectOption[] =>
    valueArr()
        .map((val) => flatOptions().find((o) => sameValue(optionValue(o), val)))
        .filter((x): x is SelectOption => Boolean(x));

const isSelected = (opt: SelectOption): boolean =>
    valueArr().some((value) => sameValue(value, optionValue(opt)));

const hasValue = (): boolean => valueArr().length > 0;

useHostFlag("data-dirty", hasValue);

const displayOpts = (): SelectOption[] => {
    const sel = selectedOptions();
    if (!props.collapseTags) return sel;
    return sel.slice(0, Math.max(1, Number(props.maxCollapseTags) || 1));
};

const displayOptionEntries = (): Array<{
    option: SelectOption;
    index: number;
    key: string;
}> =>
    displayOpts().map((option, index) => ({
        option,
        index,
        key: `${index}-${String(valueIdentity(optionValue(option)))}`,
    }));

const toggleOpen = (e: Event): void => {
    e.stopPropagation();
    if (isDisabled()) return;
    const next = !open.value;
    if (next) openDropdown();
    else closeDropdown();
};

const toggleDropdown = (visible?: boolean): void => {
    if (visible === true) {
        openDropdown();
        return;
    }
    if (visible === false) {
        closeDropdown();
        return;
    }
    if (open.peek()) closeDropdown();
    else openDropdown();
};

const selectOption = (opt: SelectOption, e?: Event): void => {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    if (isOptionDisabled(opt)) return;
    const value = optionValue(opt);
    if (isMulti()) {
        const arr = valueArr();
        const idx = arr.findIndex((item) => sameValue(item, value));
        let next: SelectValue[];
        if (idx >= 0) {
            next = arr.filter((_, i) => i !== idx);
        } else {
            if (
                Number(props.multipleLimit) > 0 &&
                arr.length >= Number(props.multipleLimit)
            )
                return;
            next = [...arr, value];
        }
        innerValue.set(next); // 更新本地副本，防 mutate
        emit("update:modelValue", next);
        emit("change", next);
        if (!props.reserveKeyword) filterText.set("");
    } else {
        innerValue.set(value);
        emit("update:modelValue", value);
        emit("change", value);
        closeDropdown();
    }
};

const removeTag = (opt: SelectOption): void => {
    if (!isMulti()) return;
    const removed = optionValue(opt);
    const arr = valueArr().filter((x) => !sameValue(x, removed));
    innerValue.set(arr);
    emit("update:modelValue", arr);
    emit("change", arr);
    emit("remove-tag", removed);
};

const clear = (): void => {
    const configured = props.valueOnClear;
    const next =
        typeof configured === "function"
            ? configured()
            : configured !== undefined
              ? configured
              : isMulti()
                ? []
                : "";
    innerValue.set(next);
    emit("update:modelValue", next);
    emit("change", next);
    emit("clear");
};

const onFilterInput = (e: Event): void => {
    filterText.set((e.target as HTMLInputElement).value);
    if (!open.value) openDropdown();
    if (props.remote) {
        if (remoteTimer) clearTimeout(remoteTimer);
        remoteTimer = setTimeout(
            () => {
                props.remoteMethod?.(filterText.value);
                emit("search", filterText.value);
            },
            Math.max(0, Number(props.debounce) || 0),
        );
    }
};

const onDropdownClick = (event: Event): void => {
    event.stopPropagation();
    const target = event.target as HTMLElement | null;
    const optionEl = target?.closest?.(".option") as HTMLElement | null;
    const index = Number(optionEl?.dataset.index ?? -1);
    const option = viewOptions()[index];
    if (option) selectOption(option, event);
};

const onRemoveTagClick = (event: Event): void => {
    event.stopPropagation();
    const target = event.target as HTMLElement | null;
    const button = target?.closest?.(".tag-remove") as HTMLElement | null;
    const index = Number(button?.dataset.index ?? -1);
    const option = displayOpts()[index];
    if (option) removeTag(option);
};

const onClearClick = (event: Event): void => {
    event.stopPropagation();
    clear();
};

const displayLabel = (): string => {
    return selectedOptions().map(optionLabel).join("，");
};

const collapsedCount = (): number => {
    const selected = selectedOptions();
    const count = Math.max(1, Number(props.maxCollapseTags) || 1);
    return props.collapseTags && selected.length > count
        ? selected.length - count
        : 0;
};

const showClear = (): boolean => {
    return Boolean(props.clearable && hasValue() && !isDisabled());
};

const showFilter = (): boolean => {
    return Boolean(props.filterable && open.value);
};

const stopClick = (event: Event): void => event.stopPropagation();

const onTriggerFocus = (event: FocusEvent): void => {
    emit("focus", event);
    if (props.automaticDropdown) openDropdown();
};

const onTriggerBlur = (event: FocusEvent): void => {
    emit("blur", event);
};

const onTriggerKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" && props.defaultFirstOption && showFilter()) {
        const first = viewOptions().find((option) => !isOptionDisabled(option));
        if (first) selectOption(first, event);
        return;
    }
    if (event.key === "Escape") closeDropdown();
    if ((event.key === "Enter" || event.key === "ArrowDown") && !open.peek()) {
        event.preventDefault();
        openDropdown();
    }
};

const onDropdownScroll = (event: Event): void => {
    const target = event.currentTarget as HTMLElement;
    emit("popup-scroll", {
        scrollTop: target.scrollTop,
        scrollLeft: target.scrollLeft,
    });
    if (target.scrollTop <= 0) emit("end-reached", "top");
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 1) {
        emit("end-reached", "bottom");
    }
};

const selectedLabel = (): string | string[] =>
    isMulti() ? selectedOptions().map(optionLabel) : displayLabel();

defineExpose({
    open: openDropdown,
    close: closeDropdown,
    toggle: toggleDropdown,
    selectedLabel,
});

defineStyle(styles);

const Select = defineHtml(html`
    <div
        class="trigger"
        part="trigger"
        :tabindex=${props.tabindex}
        role="combobox"
        :aria-expanded=${open.value ? "true" : "false"}
        @click=${toggleOpen}
        @focus=${onTriggerFocus}
        @blur=${onTriggerBlur}
        @keydown=${onTriggerKeydown}
    >
        <span v-if=${props.label} class="field-label">${props.label}</span>
        <slot name="prefix"></slot>
        <span v-if=${!hasValue() && !showFilter()} class="placeholder"
            >${placeholderText()}</span
        >
        <template v-if=${isMulti()}>
            <span
                v-for="entry in displayOptionEntries()"
                :key="entry.key"
                class="tag"
                part="tag"
            >
                {{ optionLabel(entry.option) }}
                <button
                    type="button"
                    class="tag-remove"
                    :data-index="String(entry.index)"
                    @click=${onRemoveTagClick}
                >
                    ×
                </button>
            </span>
            <span v-if=${collapsedCount() > 0} class="collapse-tag"
                >+${collapsedCount()}</span
            >
        </template>
        <span v-else-if=${hasValue() && !showFilter()} class="value"
            >${displayLabel()}</span
        >
        <input
            v-if=${showFilter()}
            class="filter-input"
            :id=${props.id || null}
            :name=${props.name || null}
            :value=${filterText.value}
            @input=${onFilterInput}
            @click=${stopClick}
        />
        <span class="suffix" part="suffix">
            <button
                v-if=${showClear()}
                type="button"
                class="clear"
                @click=${onClearClick}
            >
                ×
            </button>
            <span v-else class="arrow">▼</span>
        </span>
    </div>
    <div
        v-if=${rendered.value && !isDisabled()}
        :class=${[
            "dropdown",
            {
                active: open.value && !closing.value,
                closing: closing.value,
                "fit-input-width": props.fitInputWidth,
            },
        ]}
        part="dropdown"
        @click=${onDropdownClick}
        @scroll=${onDropdownScroll}
    >
        <div v-if=${props.loading} class="status">
            <slot name="loading">${loadingText()}</slot>
        </div>
        <div v-else-if=${viewOptions().length === 0} class="status">
            <slot name="empty"
                >${filterText.value
                    ? noMatchText()
                    : noDataText()}</slot
            >
        </div>
        <div
            v-for="entry in viewOptionEntries()"
            :key="entry.key"
            :data-index="String(entry.index)"
            :class="[
          'option',
          { selected: isSelected(entry.option), disabled: isOptionDisabled(entry.option) }
        ]"
        >
            <span>
                <slot name="label">{{ optionLabel(entry.option) }}</slot>
            </span>
            <span v-if="isSelected(entry.option)" class="check">✓</span>
        </div>
        <slot name="footer"></slot>
    </div>
`);

export { Select };
