// elf-cascader — 级联选择器

import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  onBeforeUnmount,
  useClickOutside,
  useEffect,
  useEventListener,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef
} from "elfui";

import { useDisabled, useFormItem } from "../../../composables";
import styles from "./style.scss?inline";
import type {
  CascaderBeforeFilter,
  CascaderChangeDetail,
  CascaderExpandTrigger,
  CascaderFilterMethod,
  CascaderFieldNames,
  CascaderModelValue,
  CascaderNodeSnapshot,
  CascaderOption,
  CascaderPathValue,
  CascaderProps,
  CascaderShowCheckedStrategy,
  CascaderValue
} from "./types";

export type {
  CascaderBeforeFilter,
  CascaderChangeDetail,
  CascaderExpandTrigger,
  CascaderFilterMethod,
  CascaderFieldNames,
  CascaderModelValue,
  CascaderMultipleValue,
  CascaderNodeSnapshot,
  CascaderOption,
  CascaderPanelProps,
  CascaderPathValue,
  CascaderProps,
  CascaderSize,
  CascaderShowCheckedStrategy,
  CascaderValue
} from "./types";

const CASCADER_OPEN_EVENT = "elf-cascader-open";

type RawOption = Record<string, unknown>;
type CheckState = "checked" | "indeterminate" | "unchecked";

interface CascaderColumn {
  key: string;
  level: number;
  parentPath: RawOption[];
  options: RawOption[];
}

interface CascaderConfig extends Required<
  Omit<CascaderFieldNames, "disabled" | "leaf" | "lazyLoad">
> {
  disabled: string | ((data: CascaderOption) => boolean);
  leaf: string | ((data: CascaderOption) => boolean);
  lazyLoad?: CascaderFieldNames["lazyLoad"];
}

const props = defineProps<CascaderProps>({
  modelValue: { type: Array, default: () => [] as CascaderPathValue },
  options: { type: Array, default: () => [] as CascaderOption[] },
  size: { type: String, default: "" },
  placeholder: { type: String, default: "请选择" },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  checkable: { type: Boolean, default: false },
  separator: { type: String, default: " / " },
  showAllLevels: { type: Boolean, default: true },
  collapseTags: { type: Boolean, default: false },
  collapseTagsTooltip: { type: Boolean, default: false },
  maxCollapseTags: { type: Number, default: 1 },
  maxCollapseTagsTooltipHeight: { type: null, default: "" },
  checkStrictly: { type: Boolean, default: false },
  emitPath: { type: Boolean, default: true },
  expandTrigger: { type: String, default: "click" },
  checkOnClickNode: { type: Boolean, default: false },
  checkOnClickLeaf: { type: Boolean, default: true },
  showPrefix: { type: Boolean, default: true },
  showCheckedStrategy: { type: String, default: "child" },
  filterable: { type: Boolean, default: false },
  filterMethod: { type: Function, default: undefined },
  beforeFilter: { type: Function, default: undefined },
  debounce: { type: Number, default: 300 },
  virtualScroll: { type: Boolean, default: false },
  itemSize: { type: Number, default: 34 },
  height: { type: Number, default: 204 },
  props: {
    type: Object,
    default: () => ({
      label: "label",
      value: "value",
      disabled: "disabled",
      children: "children",
      leaf: "leaf",
      expandTrigger: "click",
      multiple: false,
      checkStrictly: false,
      emitPath: true,
      checkOnClickNode: false,
      checkOnClickLeaf: true,
      showPrefix: true
    })
  }
});

const emit = defineEmits<{
  "update:modelValue": [value: CascaderModelValue];
  change: [detail: CascaderChangeDetail];
  "expand-change": [value: CascaderPathValue];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  clear: [];
  "visible-change": [visible: boolean];
  "remove-tag": [value: CascaderValue | CascaderPathValue];
}>();

const fi = useFormItem(() => props.size as string);
const isDisabled = useDisabled(() => Boolean(props.disabled));
const host = useHost();
const open = useRef(false);
const selectedValues = useRef<CascaderPathValue[]>([]);
const activePath = useRef<RawOption[]>([]);
const query = useRef("");
const filtering = useRef(false);
const filteredPaths = useRef<RawOption[][]>([]);

let filterTimer: ReturnType<typeof setTimeout> | null = null;
let filterRequest = 0;

const config = (): CascaderConfig => {
  const o = (props.props || {}) as CascaderFieldNames;
  const topExpandTrigger = String(props.expandTrigger || "") as CascaderExpandTrigger;
  const propExpandTrigger = String(o.expandTrigger || "") as CascaderExpandTrigger;
  return {
    label: o.label || "label",
    value: o.value || "value",
    disabled: o.disabled || "disabled",
    children: o.children || "children",
    leaf: o.leaf || "leaf",
    expandTrigger:
      topExpandTrigger === "hover" || topExpandTrigger === "click"
        ? topExpandTrigger
        : propExpandTrigger === "hover"
          ? "hover"
          : "click",
    multiple: Boolean(props.multiple || props.checkable || o.multiple),
    checkStrictly: Boolean(props.checkStrictly || o.checkStrictly),
    emitPath: props.emitPath !== false && o.emitPath !== false,
    lazy: Boolean(o.lazy),
    hoverThreshold: Number(o.hoverThreshold ?? 500),
    checkOnClickNode: Boolean(props.checkOnClickNode || o.checkOnClickNode),
    checkOnClickLeaf: props.checkOnClickLeaf !== false && o.checkOnClickLeaf !== false,
    showPrefix: props.showPrefix !== false && o.showPrefix !== false,
    lazyLoad: o.lazyLoad
  };
};

const fieldNames = (): Required<Pick<CascaderFieldNames, "label" | "value" | "children">> => {
  const c = config();
  return {
    label: c.label,
    value: c.value,
    children: c.children
  };
};

const isMultiple = (): boolean => config().multiple;

const isCheckStrictly = (): boolean => config().checkStrictly;

const shouldEmitPath = (): boolean => config().emitPath;

const showPrefix = (): boolean => isMultiple() && config().showPrefix;

const showCheckedStrategy = (): CascaderShowCheckedStrategy =>
  props.showCheckedStrategy === "parent" ? "parent" : "child";

const normalizePathValue = (value: unknown): CascaderPathValue => {
  if (!Array.isArray(value)) return value == null || value === "" ? [] : [value as CascaderValue];
  return (value as unknown[])
    .filter((item) => item != null && item !== "")
    .map((item) => item as CascaderValue);
};

const toValuePaths = (value: unknown): CascaderPathValue[] => {
  if (!shouldEmitPath()) {
    const values = Array.isArray(value) ? value : value == null || value === "" ? [] : [value];
    return values
      .map((item) => findPathByValue(item as CascaderValue))
      .filter((path) => path.length > 0)
      .map(pathValues);
  }
  if (!Array.isArray(value)) {
    const path = normalizePathValue(value);
    return path.length > 0 ? [path] : [];
  }
  if (value.length === 0) return [];
  if (Array.isArray(value[0])) {
    return (value as unknown[]).map(normalizePathValue).filter((path) => path.length > 0);
  }
  const path = normalizePathValue(value);
  return path.length > 0 ? [path] : [];
};

const rawOptions = (): RawOption[] =>
  Array.isArray(props.options) ? (props.options as RawOption[]) : [];

const optionLabel = (option: RawOption): string => {
  const fields = fieldNames();
  return String(option[fields.label] ?? option[fields.value] ?? "");
};

const optionValue = (option: RawOption): CascaderValue => {
  const fields = fieldNames();
  return (option[fields.value] ?? option[fields.label] ?? "") as CascaderValue;
};

const optionDisabled = (option: RawOption): boolean => {
  const disabled = config().disabled;
  if (typeof disabled === "function") return disabled(option as CascaderOption);
  return Boolean(option[disabled]);
};

const optionChildren = (option: RawOption): RawOption[] => {
  const fields = fieldNames();
  const children = option[fields.children];
  return Array.isArray(children) ? (children as RawOption[]) : [];
};

const optionLeaf = (option: RawOption): boolean => {
  const leaf = config().leaf;
  if (typeof leaf === "function") return leaf(option as CascaderOption);
  if (leaf in option) return Boolean(option[leaf]);
  return optionChildren(option).length === 0;
};

const sameValue = (a: unknown, b: unknown): boolean => Object.is(a, b);

const samePathValue = (a: CascaderPathValue, b: CascaderPathValue): boolean =>
  a.length === b.length && a.every((value, index) => sameValue(value, b[index]));

const pathValues = (path: RawOption[]): CascaderPathValue => path.map(optionValue);

const pathLabels = (path: RawOption[]): string[] => path.map(optionLabel);

const findPathByValues = (
  values: CascaderPathValue,
  options = rawOptions(),
  level = 0,
  path: RawOption[] = []
): RawOption[] => {
  if (level >= values.length) return path;
  for (const option of options) {
    if (!sameValue(optionValue(option), values[level])) continue;
    const nextPath = [...path, option];
    if (level === values.length - 1) return nextPath;
    return findPathByValues(values, optionChildren(option), level + 1, nextPath);
  }
  return [];
};

const findPathByValue = (
  value: CascaderValue,
  options = rawOptions(),
  path: RawOption[] = []
): RawOption[] => {
  for (const option of options) {
    const nextPath = [...path, option];
    if (sameValue(optionValue(option), value)) return nextPath;
    const childPath = findPathByValue(value, optionChildren(option), nextPath);
    if (childPath.length > 0) return childPath;
  }
  return [];
};

const selectedPaths = (): RawOption[][] =>
  selectedValues.value.map((value) => findPathByValues(value)).filter((path) => path.length > 0);

const selectedPath = (): RawOption[] => selectedPaths()[0] ?? [];

const hasValue = (): boolean => selectedValues.value.length > 0;

const isPathAncestor = (ancestor: CascaderPathValue, child: CascaderPathValue): boolean =>
  ancestor.length < child.length &&
  ancestor.every((value, index) => sameValue(value, child[index]));

const collectCheckedParentPaths = (
  options = rawOptions(),
  parentPath: RawOption[] = []
): RawOption[][] => {
  const result: RawOption[][] = [];
  for (const option of options) {
    const path = [...parentPath, option];
    const children = optionChildren(option);
    const leaves = collectLeafValuePaths(path);
    if (children.length > 0 && leaves.length > 0 && leaves.every((leaf) => isPathSelected(leaf))) {
      result.push(path);
    } else if (children.length > 0) {
      result.push(...collectCheckedParentPaths(children, path));
    }
  }
  return result;
};

const displaySelectedPaths = (): RawOption[][] => {
  const selected = selectedPaths();
  if (!isMultiple() || showCheckedStrategy() !== "parent") return selected;
  const parentPaths = collectCheckedParentPaths();
  const parentValues = parentPaths.map(pathValues);
  const rest = selected.filter((path) => {
    const value = pathValues(path);
    return !parentValues.some((parent) => isPathAncestor(parent, value));
  });
  return [...parentPaths, ...rest];
};

const displayPathLabel = (path: RawOption[]): string => {
  if (!props.showAllLevels) return optionLabel(path[path.length - 1] ?? {});
  return pathLabels(path).join(String(props.separator || " / "));
};

const displayLabel = (): string => {
  const separator = String(props.separator || " / ");
  const paths = displaySelectedPaths();
  const labels = paths.map(displayPathLabel);
  if (
    isMultiple() &&
    props.collapseTags &&
    labels.length > Math.max(1, Number(props.maxCollapseTags) || 1)
  ) {
    const count = Math.max(1, Number(props.maxCollapseTags) || 1);
    return `${labels.slice(0, count).join("、")} +${labels.length - count}`;
  }
  if (paths.length > 0) {
    return labels.join("、");
  }
  return selectedValues.value.map((path) => path.map(String).join(separator)).join("、");
};

const modelValueFromPaths = (paths: CascaderPathValue[]): CascaderModelValue => {
  if (shouldEmitPath()) {
    if (isMultiple()) return paths;
    return paths[0] ?? [];
  }
  const values = paths
    .map((path) => path[path.length - 1])
    .filter((value): value is CascaderValue => value !== undefined);
  if (isMultiple()) return values;
  return values[0] ?? "";
};

const detailFromPaths = (paths: CascaderPathValue[]): CascaderChangeDetail => {
  const optionPaths = paths.map((value) => findPathByValues(value));
  if (isMultiple()) {
    return {
      value: modelValueFromPaths(paths),
      path: optionPaths.map(pathLabels),
      selected: optionPaths as CascaderOption[][],
      multiple: true
    };
  }
  const first = optionPaths[0] ?? [];
  return {
    value: modelValueFromPaths(paths),
    path: pathLabels(first),
    selected: first as CascaderOption[],
    multiple: false
  };
};

const clearPendingFilter = (): void => {
  if (filterTimer) clearTimeout(filterTimer);
  filterTimer = null;
};

const clearFilter = (): void => {
  clearPendingFilter();
  filterRequest += 1;
  query.set("");
  filtering.set(false);
  filteredPaths.set([]);
};

const isSearchMode = (): boolean => Boolean(props.filterable && query.value.trim());

const isSearchTarget = (path: RawOption[]): boolean => {
  const option = path[path.length - 1];
  if (!option || optionDisabled(option)) return false;
  return optionLeaf(option) || isCheckStrictly() || props.checkable || config().checkOnClickNode;
};

const defaultFilter = (node: CascaderNodeSnapshot, keyword: string): boolean =>
  node.pathLabels.join(" / ").toLocaleLowerCase().includes(keyword.toLocaleLowerCase());

const matchesFilter = (node: CascaderNodeSnapshot, keyword: string): boolean => {
  try {
    return Boolean(((props.filterMethod as CascaderFilterMethod | undefined) ?? defaultFilter)(node, keyword));
  } catch {
    return false;
  }
};

const collectFilterResults = (keyword: string): RawOption[][] => {
  const result: RawOption[][] = [];
  const visit = (options: RawOption[], parentPath: RawOption[] = []): void => {
    options.forEach((option) => {
      const path = [...parentPath, option];
      const snapshot = nodeSnapshot(path);
      if (snapshot && isSearchTarget(path) && matchesFilter(snapshot, keyword)) result.push(path);
      visit(optionChildren(option), path);
    });
  };
  visit(rawOptions());
  return result;
};

const runFilter = async (keyword: string, request: number): Promise<void> => {
  const beforeFilter = props.beforeFilter as CascaderBeforeFilter | undefined;
  try {
    const allowed = beforeFilter ? await beforeFilter(keyword) : true;
    if (request !== filterRequest) return;
    const nextAllowed = allowed !== false;
    filteredPaths.set(nextAllowed ? collectFilterResults(keyword) : []);
  } catch {
    if (request !== filterRequest) return;
    filteredPaths.set([]);
  } finally {
    if (request === filterRequest) filtering.set(false);
  }
};

const scheduleFilter = (): void => {
  clearPendingFilter();
  const keyword = query.value.trim();
  const request = ++filterRequest;
  if (!keyword) {
    filtering.set(false);
    filteredPaths.set([]);
    return;
  }
  filtering.set(true);
  filterTimer = setTimeout(() => {
    filterTimer = null;
    void runFilter(keyword, request);
  }, Math.max(0, Number(props.debounce) || 0));
};

const emitChange = (paths: CascaderPathValue[]): void => {
  emit("update:modelValue", modelValueFromPaths(paths));
  emit("change", detailFromPaths(paths));
};

const closeDropdown = (): void => {
  if (!open.peek()) return;
  open.set(false);
  clearFilter();
  emit("visible-change", false);
};

const openDropdown = (): void => {
  if (isDisabled() || open.peek()) return;
  document.dispatchEvent(new CustomEvent(CASCADER_OPEN_EVENT, { detail: host }));
  activePath.set(selectedPath());
  open.set(true);
  emit("visible-change", true);
};

const toggleOpen = (event: Event): void => {
  event.stopPropagation();
  if (open.peek()) closeDropdown();
  else openDropdown();
};

const optionPath = (option: RawOption, column: CascaderColumn): RawOption[] => [
  ...column.parentPath,
  option
];

const valuePathKey = (path: CascaderPathValue): string => JSON.stringify(path);

const optionPathKey = (option: RawOption, column: CascaderColumn): string =>
  valuePathKey(pathValues(optionPath(option, column)));

const findPathByKey = (
  key: string,
  options = rawOptions(),
  path: RawOption[] = []
): RawOption[] => {
  for (const option of options) {
    const nextPath = [...path, option];
    if (valuePathKey(pathValues(nextPath)) === key) return nextPath;
    const childPath = findPathByKey(key, optionChildren(option), nextPath);
    if (childPath.length > 0) return childPath;
  }
  return [];
};

const collectLeafValuePaths = (path: RawOption[]): CascaderPathValue[] => {
  const current = path[path.length - 1];
  if (!current || optionDisabled(current)) return [];
  const children = optionChildren(current).filter((item) => !optionDisabled(item));
  if (children.length === 0 || optionLeaf(current) || isCheckStrictly()) return [pathValues(path)];
  return children.flatMap((child) => collectLeafValuePaths([...path, child]));
};

const setSinglePath = (path: RawOption[]): void => {
  const next = [pathValues(path)];
  selectedValues.set(next);
  activePath.set(path);
  emitChange(next);
  closeDropdown();
};

const setMultiplePath = (path: RawOption[]): void => {
  const leaves = collectLeafValuePaths(path);
  if (leaves.length === 0) return;
  const current = selectedValues.peek();
  const allSelected = leaves.every((leaf) => current.some((item) => samePathValue(item, leaf)));
  const next = allSelected
    ? current.filter((item) => !leaves.some((leaf) => samePathValue(item, leaf)))
    : [...current, ...leaves.filter((leaf) => !current.some((item) => samePathValue(item, leaf)))];
  selectedValues.set(next);
  activePath.set(path);
  emitChange(next);
};

const toggleStrictPath = (path: RawOption[]): void => {
  const value = pathValues(path);
  const current = selectedValues.peek();
  const selected = current.some((item) => samePathValue(item, value));
  const next = selected
    ? current.filter((item) => !samePathValue(item, value))
    : [...current, value];
  selectedValues.set(next);
  activePath.set(path);
  emitChange(next);
};

const emitExpand = (path: RawOption[]): void => {
  emit("expand-change", pathValues(path));
};

const onOptionPathClick = (path: RawOption[], event?: Event): void => {
  event?.preventDefault();
  event?.stopPropagation();
  const option = path[path.length - 1];
  if (!option) return;
  if (optionDisabled(option)) return;
  activePath.set(path);
  const hasChildren = optionChildren(option).length > 0;
  if (hasChildren) emitExpand(path);
  if (isMultiple()) {
    if (isCheckStrictly()) {
      if (config().checkOnClickNode || (!hasChildren && config().checkOnClickLeaf)) {
        toggleStrictPath(path);
      }
      return;
    }
    if (props.checkable || config().checkOnClickNode || !hasChildren) setMultiplePath(path);
    return;
  }
  if (hasChildren && !isCheckStrictly()) return;
  setSinglePath(path);
};

const onOptionHover = (event: Event): void => {
  if (config().expandTrigger !== "hover") return;
  const key = (event.currentTarget as HTMLElement | null)?.dataset.pathKey;
  if (!key) return;
  const path = findPathByKey(key);
  const option = path[path.length - 1];
  if (!option || optionDisabled(option)) return;
  if (optionChildren(option).length === 0) return;
  activePath.set(path);
  emitExpand(path);
};

const onColumnsClick = (event: Event): void => {
  const target = event.target as HTMLElement | null;
  const optionButton = target?.closest?.(".option") as HTMLElement | null;
  const key = optionButton?.dataset.pathKey;
  if (!key) return;
  const path = findPathByKey(key);
  if (path.length > 0) onOptionPathClick(path, event);
};

const stopClick = (event: Event): void => {
  event.stopPropagation();
};

const clear = (event?: Event): void => {
  event?.preventDefault();
  event?.stopPropagation();
  selectedValues.set([]);
  activePath.set([]);
  emit("update:modelValue", []);
  emit("change", { value: [], path: [], selected: [], multiple: isMultiple() });
  emit("clear");
};

const onFilterInput = (event: Event): void => {
  const input = event.currentTarget as HTMLInputElement | null;
  query.set(input?.value ?? "");
  if (!open.peek()) openDropdown();
  scheduleFilter();
};

const onFilterKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "Escape") return;
  event.preventDefault();
  closeDropdown();
};

const onFilterResultsClick = (event: Event): void => {
  const target = event.target as HTMLElement | null;
  const option = target?.closest?.(".filter-option") as HTMLElement | null;
  const key = option?.dataset.pathKey;
  if (!key) return;
  const path = findPathByKey(key);
  if (path.length > 0) onOptionPathClick(path, event);
};

const isActive = (option: RawOption, column: CascaderColumn): boolean =>
  sameValue(optionValue(activePath.value[column.level] ?? {}), optionValue(option));

const isPathSelected = (value: CascaderPathValue): boolean =>
  selectedValues.value.some((item) => samePathValue(item, value));

const checkState = (option: RawOption, column: CascaderColumn): CheckState => {
  const leaves = collectLeafValuePaths(optionPath(option, column));
  if (leaves.length === 0) return "unchecked";
  const checkedCount = leaves.filter(isPathSelected).length;
  if (checkedCount === leaves.length) return "checked";
  return checkedCount > 0 ? "indeterminate" : "unchecked";
};

const isSelected = (option: RawOption, column: CascaderColumn): boolean => {
  if (isMultiple()) return checkState(option, column) === "checked";
  const path = selectedPath();
  return sameValue(optionValue(path[column.level] ?? {}), optionValue(option));
};

const isIndeterminate = (option: RawOption, column: CascaderColumn): boolean =>
  isMultiple() && checkState(option, column) === "indeterminate";

const checkboxClass = (option: RawOption, column: CascaderColumn): Record<string, boolean> => ({
  "is-checked": isSelected(option, column),
  "is-indeterminate": isIndeterminate(option, column)
});

const ariaChecked = (option: RawOption, column: CascaderColumn): string | null => {
  if (!showPrefix()) return null;
  const state = checkState(option, column);
  if (state === "checked") return "true";
  if (state === "indeterminate") return "mixed";
  return "false";
};

const showClear = (): boolean => Boolean(props.clearable && hasValue() && !isDisabled());

const columns = (): CascaderColumn[] => {
  const path = open.value && activePath.value.length > 0 ? activePath.value : selectedPath();
  const result: CascaderColumn[] = [
    { key: "root", level: 0, parentPath: [], options: rawOptions() }
  ];
  for (let level = 0; level < path.length; level += 1) {
    const children = optionChildren(path[level]!);
    if (children.length === 0) break;
    const parentPath = path.slice(0, level + 1);
    result.push({
      key: String(optionValue(path[level]!)),
      level: level + 1,
      parentPath,
      options: children
    });
  }
  return result;
};

const optionKey = (option: RawOption, level: number): string =>
  `${level}-${String(optionValue(option))}`;

const optionClass = (option: RawOption, column: CascaderColumn): Record<string, boolean> => ({
  "is-active": isActive(option, column),
  "is-selected": isSelected(option, column),
  "is-indeterminate": isIndeterminate(option, column),
  "is-disabled": optionDisabled(option),
  "has-children": optionChildren(option).length > 0
});

const nodeSnapshot = (path: RawOption[]): CascaderNodeSnapshot | null => {
  const option = path[path.length - 1];
  if (!option) return null;
  const values = pathValues(path);
  return {
    value: optionValue(option),
    label: optionLabel(option),
    level: path.length,
    data: option as CascaderOption,
    pathValues: values,
    pathLabels: pathLabels(path),
    checked: isPathSelected(values),
    isLeaf: optionLeaf(option)
  };
};

const getCheckedNodes = (leafOnly = false): CascaderNodeSnapshot[] =>
  selectedPaths()
    .filter((path) => !leafOnly || optionLeaf(path[path.length - 1] ?? {}))
    .map(nodeSnapshot)
    .filter((node): node is CascaderNodeSnapshot => Boolean(node));

const togglePopperVisible = (visible?: boolean): void => {
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

const onTriggerFocus = (event: FocusEvent): void => emit("focus", event);

const onTriggerBlur = (event: FocusEvent): void => emit("blur", event);

useEffect(() => {
  const next = toValuePaths(props.modelValue);
  selectedValues.set(isMultiple() ? next : next.slice(0, 1));
  if (!open.peek()) activePath.set(findPathByValues(next[0] ?? []));
});

useClickOutside(host, closeDropdown);
onBeforeUnmount(clearPendingFilter);
useEventListener<CustomEvent<HTMLElement>>(document, CASCADER_OPEN_EVENT, (event) => {
  if (event.detail !== host) closeDropdown();
});
useHostFlag("data-open", () => open.value);
useHostAttr("data-state", () => fi.state);
useHostFlag("disabled", isDisabled);
useHostAttr("size", () => fi.formSize);

defineExpose({
  clear,
  open: openDropdown,
  close: closeDropdown,
  togglePopperVisible,
  getCheckedNodes,
  presentText: displayLabel
});
defineStyle(styles);

const Cascader = defineHtml<CascaderProps>(html`
  <div
    class="trigger"
    part="trigger"
    :tabindex=${props.filterable ? undefined : 0}
    role="combobox"
    :aria-expanded=${open.value ? "true" : "false"}
    @click=${toggleOpen}
    @focus=${onTriggerFocus}
    @blur=${onTriggerBlur}
  >
    <input
      v-if=${props.filterable}
      class="filter-input"
      type="text"
      autocomplete="off"
      :value=${query.value}
      :placeholder=${hasValue() ? displayLabel() : props.placeholder}
      :aria-label=${props.placeholder}
      @click=${stopClick}
      @input=${onFilterInput}
      @keydown=${onFilterKeydown}
      @focus=${onTriggerFocus}
      @blur=${onTriggerBlur}
    />
    <span v-else-if=${!hasValue()} class="placeholder">${props.placeholder}</span>
    <span v-else class="value">${displayLabel()}</span>
    <span class="suffix" part="suffix">
      <button v-if=${showClear()} type="button" class="clear" aria-label="清空" @click=${clear}>
        ×
      </button>
      <span v-else class="arrow" aria-hidden="true">▼</span>
    </span>
  </div>
  <div
    v-if=${open.value && !isDisabled()}
    class="dropdown"
    part="dropdown"
    role="menu"
    @click=${stopClick}
  >
    <div v-if=${isSearchMode()} class="filter-results" role="listbox" @click=${onFilterResultsClick}>
      <div v-if=${filtering.value} class="empty" aria-live="polite">Searching…</div>
      <template v-else>
        <button
          v-for="path in filteredPaths.value"
          :key="valuePathKey(pathValues(path))"
          class="filter-option"
          type="button"
          role="option"
          :data-path-key="valuePathKey(pathValues(path))"
          :aria-selected="isPathSelected(pathValues(path)) ? 'true' : 'false'"
        >
          {{ displayPathLabel(path) }}
        </button>
        <slot v-if="filteredPaths.value.length === 0" name="empty"><div class="empty">No matching data</div></slot>
      </template>
    </div>
    <div v-else-if=${rawOptions().length === 0} class="empty">暂无数据</div>
    <div v-else class="columns" @click=${onColumnsClick}>
      <div v-for="column in columns()" :key="column.key" class="column">
        <button
          v-for="option in column.options"
          :key="optionKey(option, column.level)"
          :data-path-key="optionPathKey(option, column)"
          type="button"
          :class="['option', optionClass(option, column)]"
          :disabled="optionDisabled(option)"
          :role=${showPrefix() ? "menuitemcheckbox" : "menuitem"}
          :aria-checked="ariaChecked(option, column)"
          @pointerenter=${onOptionHover}
        >
          <span
            v-if=${showPrefix()}
            class="option-checkbox"
            :class="checkboxClass(option, column)"
          >
            <span class="checkbox-mark"></span>
          </span>
          <span class="option-label">{{ optionLabel(option) }}</span>
          <span v-if="optionChildren(option).length > 0" class="option-arrow">›</span>
          <span v-else-if="isSelected(option, column) && !props.checkable" class="check">✓</span>
        </button>
      </div>
    </div>
  </div>
`);

export { Cascader };
