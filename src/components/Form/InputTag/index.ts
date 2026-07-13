import {
    defineEmits,
    defineHtml,
    defineProps,
    defineStyle,
    html,
    useHostAttr,
    useHostFlag,
    useRef,
    watchEffect,
} from "elfui";

import { useFormControl } from "../../../composables";
import styles from "./style.scss?inline";
import type { InputTagProps, InputTagSize } from "./types";

export type { InputTagProps, InputTagSize } from "./types";

interface TagItem {
    label: string;
    index: number;
}

const props = defineProps<InputTagProps>({
    modelValue: { type: Array, default: () => [] },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    max: { type: Number, default: undefined },
    size: { type: String, default: "" },
    trigger: { type: String, default: "enter" },
    tagType: { type: String, default: "" },
    tagEffect: { type: String, default: "light" },
    draggable: { type: Boolean, default: false },
    validateEvent: { type: Boolean, default: true },
});

const emit = defineEmits([
    "update:modelValue",
    "change",
    "input",
    "add-tag",
    "remove-tag",
    "clear",
]);

const value = useRef<string[]>([]);
const text = useRef("");
const ctl = useFormControl<string[]>(props, emit, {
    triggers: props.validateEvent === false ? { input: false, change: false, blur: false } : undefined,
});

const normalize = (source: unknown): string[] =>
    Array.isArray(source)
        ? source.map((item) => String(item)).filter(Boolean)
        : [];

watchEffect(() => {
    value.set(normalize(props.modelValue));
});

const tags = (): TagItem[] =>
    value.value.map((label, index) => ({ label, index }));
const isLimitReached = (): boolean =>
    Number(props.max) > 0 && value.value.length >= Number(props.max);

const commit = (
    next: string[],
    eventName: "change" | "input" = "change",
): void => {
    value.set(next);
    if (eventName === "input") ctl.dispatchInput(next);
    else {
        ctl.setValue(next);
        ctl.dispatchChange(next);
    }
};

const add = (): void => {
    const label = text.value.trim();
    if (!label || props.disabled || props.readonly || isLimitReached()) return;
    const next = [...value.value, label];
    text.set("");
    commit(next);
    emit("add-tag", label);
};

const removeAt = (index: number): void => {
    if (props.disabled || props.readonly) return;
    const removed = value.value[index];
    const next = value.value.filter((_, i) => i !== index);
    commit(next);
    emit("remove-tag", removed);
};

const clear = (): void => {
    if (props.disabled || props.readonly) return;
    text.set("");
    commit([]);
    emit("clear");
};

const onInput = (event: Event): void => {
    text.set((event.target as HTMLInputElement).value);
};

const onKeydown = (event: KeyboardEvent): void => {
    if (props.trigger === "enter" && (event.key === "Enter" || event.key === ",")) {
        event.preventDefault();
        add();
    } else if (event.key === "Backspace" && !text.value && value.value.length) {
        removeAt(value.value.length - 1);
    }
};

const onBlur = (event: Event): void => {
    if (props.trigger === "blur") add();
    ctl.dispatchBlur(event);
};

const onRemoveClick = (event: Event): void => {
    const index = Number(
        (event.target as HTMLElement | null)
            ?.closest("[data-index]")
            ?.getAttribute("data-index"),
    );
    if (Number.isInteger(index)) removeAt(index);
};

const showClear = (): boolean =>
    Boolean(
        props.clearable &&
        value.value.length &&
        !props.disabled &&
        !props.readonly,
    );

const normalizedSize = (): InputTagSize => {
    const size = String(props.size || "") as InputTagSize;
    return size === "sm" || size === "lg" ? size : "";
};

useHostAttr("size", normalizedSize);
useHostFlag("disabled", () => Boolean(props.disabled));

defineStyle(styles);

const InputTag = defineHtml<InputTagProps>(html`
    <div class="input-tag" part="wrapper" @click=${onRemoveClick}>
        <slot name="prefix"></slot>
        <span v-for="tag in tags()" :key="tag.index" class="tag" :class=${[() => props.tagType, () => `is-${props.tagEffect}`]} :draggable=${props.draggable} part="tag">
            {{ tag.label }}
            <button
                v-if=${!props.disabled && !props.readonly}
                class="remove"
                type="button"
                :data-index="tag.index"
                aria-label="Remove tag"
            >
                x
            </button>
        </span>
        <input
            part="input"
            :value.prop=${text.value}
            :placeholder=${value.value.length ? "" : props.placeholder}
            :disabled=${props.disabled || isLimitReached()}
            :readonly=${props.readonly}
            @input=${onInput}
            @keydown=${onKeydown}
            @blur=${onBlur}
        />
        <slot name="suffix"></slot>
        <button
            v-if=${showClear()}
            class="clear"
            type="button"
            aria-label="Clear tags"
            @click=${clear}
        >
            x
        </button>
    </div>
`);

export { InputTag };
