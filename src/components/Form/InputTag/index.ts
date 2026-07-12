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
    emit("update:modelValue", next);
    emit(eventName, next);
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
    if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        add();
    } else if (event.key === "Backspace" && !text.value && value.value.length) {
        removeAt(value.value.length - 1);
    }
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
        <span v-for="tag in tags()" :key="tag.index" class="tag" part="tag">
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
        />
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
