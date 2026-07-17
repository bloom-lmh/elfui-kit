// elf-tree - Material Design style tree view
//
// Features:
//   - expand/collapse, selection, checkbox cascade
//   - custom field names
//   - filtering and accordion mode

import {
  defineEmits,
  defineExpose,
  defineProps,
  defineStyle,
  html,
  useComputed,
  useRef,
  watchEffect,
  defineHtml
} from "elfui";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";

export type { TreeFieldNames, TreeNode, TreeProps } from "./types";

const SIGNATURE_SEP = "::elf-tree::";

const props = defineProps({
  data: { type: Array, default: () => [] },
  nodeKey: { type: String, default: "" },
  modelValue: { type: String, default: "" },
  currentNodeKey: { type: String, default: "" },
  defaultSelectedKey: { type: String, default: "" },
  defaultExpandedKeys: { type: Array, default: () => [] },
  defaultCheckedKeys: { type: Array, default: () => [] },
  expandedKeys: { type: Array },
  checkedKeys: { type: Array },
  props: { type: Object, default: () => ({}) },
  showCheckbox: { type: Boolean, default: false },
  checkStrictly: { type: Boolean, default: false },
  highlightCurrent: { type: Boolean, default: true },
  accordion: { type: Boolean, default: false },
  defaultExpandAll: { type: Boolean, default: false },
  expandOnClickNode: { type: Boolean, default: true },
  checkOnClickNode: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
  filterPlaceholder: { type: String, default: "" },
  emptyText: { type: String, default: "" },
  indent: { type: Number, default: 20 },
  bordered: { type: Boolean, default: false }
});

const locale = useLocaleProvider();

const emit = defineEmits([
  "update:modelValue",
  "update:expandedKeys",
  "update:checkedKeys",
  "node-click",
  "node-expand",
  "node-collapse",
  "check",
  "check-change"
]);

const allNodes = useRef<TreeViewNode[]>([]);

const visibleNodes = useRef<TreeViewNode[]>([]);

const expandedState = useRef<string[]>([]);

const checkedState = useRef<string[]>([]);

const selectedKey = useRef("");

const filterText = useRef("");

const nodeMap = useRef<Record<string, TreeViewNode>>({});

const lastExpandedSig = useRef("");

const lastCheckedSig = useRef("");

const lastSelectedSig = useRef("");

let initialized = false;

const normalizeKeys = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((key) => String(key)).filter(Boolean);
};

const signature = (value: string[]): string => value.join(SIGNATURE_SEP);

const fields = (): TreeFieldConfig => {
  const custom = (props.props || {}) as Record<string, string>;
  return {
    key: String(props.nodeKey || custom.key || "key"),
    label: custom.label || "label",
    children: custom.children || "children",
    disabled: custom.disabled || "disabled",
    isLeaf: custom.isLeaf || "isLeaf",
    icon: custom.icon || "icon"
  };
};

const childListOf = (node: Record<string, unknown>, field: string): Record<string, unknown>[] => {
  const children = node[field];
  return Array.isArray(children) ? (children as Record<string, unknown>[]) : [];
};

const keyOf = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    const field = fields();
    return String((value as Record<string, unknown>)[field.key] ?? "");
  }
  return "";
};

const findNode = (key: string): TreeViewNode | undefined => nodeMap.peek()[key];

const isDescendantOf = (node: TreeViewNode, ancestorKey: string): boolean =>
  node.key !== ancestorKey && node.path.includes(ancestorKey);

const childRowsOf = (row: TreeViewNode): TreeViewNode[] =>
  allNodes.peek().filter((node) => node.parentKey === row.key);

const descendantRowsOf = (row: TreeViewNode, includeSelf = false): TreeViewNode[] =>
  allNodes
    .peek()
    .filter(
      (node) => (includeSelf ? node.key === row.key : false) || isDescendantOf(node, row.key)
    );

const pruneKeys = (keys: string[]): string[] => {
  const map = nodeMap.peek();
  return keys.filter((key) => !!map[key]);
};

const rebuildVisible = (): void => {
  const rows = allNodes.peek();
  const expanded = new Set(expandedState.peek());
  const keyword = filterText.peek().trim().toLowerCase();

  if (!keyword) {
    visibleNodes.set(
      rows.filter(
        (row) => row.level === 0 || row.path.slice(0, -1).every((key) => expanded.has(key))
      )
    );
    return;
  }

  const matched = new Set<string>();
  for (const row of rows) {
    if (!row.label.toLowerCase().includes(keyword)) continue;
    for (const key of row.path) matched.add(key);
  }
  visibleNodes.set(rows.filter((row) => matched.has(row.key)));
};

const syncCascadeParents = (set: Set<string>): void => {
  if (props.checkStrictly) return;
  const rows = [...allNodes.peek()].sort((a, b) => b.level - a.level);
  for (const row of rows) {
    if (!row.hasChildren || row.disabled) continue;
    const children = childRowsOf(row).filter((child) => !child.disabled);
    if (children.length > 0 && children.every((child) => set.has(child.key))) {
      set.add(row.key);
    } else {
      set.delete(row.key);
    }
  }
};

const normalizeCheckedInput = (keys: string[], leafOnly = false): string[] => {
  const set = new Set<string>();
  const existing = pruneKeys(keys);

  for (const key of existing) {
    const row = findNode(key);
    if (!row || row.disabled) continue;
    if (leafOnly && row.hasChildren) continue;

    if (!props.checkStrictly && row.hasChildren && !leafOnly) {
      for (const item of descendantRowsOf(row, true)) {
        if (!item.disabled) set.add(item.key);
      }
    } else {
      set.add(row.key);
    }
  }

  syncCascadeParents(set);
  return Array.from(set);
};

const setExpandedKeys = (keys: string[], shouldEmit = true): void => {
  const next = Array.from(new Set(pruneKeys(keys)));
  expandedState.set(next);
  lastExpandedSig.set(signature(next));
  rebuildVisible();
  if (shouldEmit) emit("update:expandedKeys", next);
};

const commitCheckedKeys = (keys: string[], shouldEmit = true, leafOnly = false): void => {
  const next = normalizeCheckedInput(keys, leafOnly);
  checkedState.set(next);
  lastCheckedSig.set(signature(next));
  if (shouldEmit) emit("update:checkedKeys", next);
};

const setCheckedKeys = (keys: string[], leafOnly = false): void => {
  commitCheckedKeys(keys, true, leafOnly);
};

const setCheckedNodes = (nodes: Record<string, unknown>[], leafOnly = false): void => {
  setCheckedKeys(
    nodes.map((node) => keyOf(node)),
    leafOnly
  );
};

const setSelectedKey = (key: string, shouldEmit = true): void => {
  selectedKey.set(key);
  lastSelectedSig.set(key);
  if (shouldEmit) emit("update:modelValue", key);
};

const buildNodes = (): void => {
  const field = fields();
  const source = Array.isArray(props.data) ? (props.data as Record<string, unknown>[]) : [];
  const rows: TreeViewNode[] = [];
  const map: Record<string, TreeViewNode> = {};

  const walk = (
    items: Record<string, unknown>[],
    level: number,
    parentKey: string,
    parentPath: string[]
  ): void => {
    items.forEach((raw, index) => {
      const fallbackKey = [...parentPath, String(index)].join("-");
      const key = String(raw[field.key] ?? fallbackKey);
      const children = childListOf(raw, field.children);
      const row: TreeViewNode = {
        key,
        label: String(raw[field.label] ?? key),
        icon: String(raw[field.icon] ?? ""),
        level,
        disabled: Boolean(raw[field.disabled]),
        isLeaf: Boolean(raw[field.isLeaf]) || children.length === 0,
        hasChildren: children.length > 0,
        parentKey,
        path: [...parentPath, key],
        raw
      };
      rows.push(row);
      map[key] = row;
      if (children.length > 0) walk(children, level + 1, key, row.path);
    });
  };

  walk(source, 0, "", []);
  allNodes.set(rows);
  nodeMap.set(map);

  if (!initialized) {
    initialized = true;
    const controlledExpanded = normalizeKeys(props.expandedKeys);
    const controlledChecked = normalizeKeys(props.checkedKeys);
    const initialExpanded = Array.isArray(props.expandedKeys)
      ? controlledExpanded
      : props.defaultExpandAll
        ? rows.filter((row) => row.hasChildren).map((row) => row.key)
        : normalizeKeys(props.defaultExpandedKeys);
    const initialChecked = Array.isArray(props.checkedKeys)
      ? controlledChecked
      : normalizeKeys(props.defaultCheckedKeys);
    setExpandedKeys(initialExpanded, false);
    commitCheckedKeys(initialChecked, false);
    setSelectedKey(
      String(props.modelValue || props.currentNodeKey || props.defaultSelectedKey || ""),
      false
    );
  } else {
    setExpandedKeys(expandedState.peek(), false);
    commitCheckedKeys(checkedState.peek(), false);
    if (selectedKey.peek() && !map[selectedKey.peek()]) setSelectedKey("", false);
  }

  rebuildVisible();
};

watchEffect(() => {
  buildNodes();
});

watchEffect(() => {
  if (!Array.isArray(props.expandedKeys)) return;
  const next = normalizeKeys(props.expandedKeys);
  const sig = signature(next);
  if (sig === lastExpandedSig.peek()) return;
  setExpandedKeys(next, false);
});

watchEffect(() => {
  if (!Array.isArray(props.checkedKeys)) return;
  const next = normalizeKeys(props.checkedKeys);
  const sig = signature(next);
  if (sig === lastCheckedSig.peek()) return;
  commitCheckedKeys(next, false);
});

watchEffect(() => {
  const next = String(props.modelValue || props.currentNodeKey || "");
  if (next === lastSelectedSig.peek()) return;
  setSelectedKey(next, false);
});

const getVisibleNodes = (): TreeViewNode[] => visibleNodes.value;

const isExpanded = (key: string): boolean => expandedState.value.includes(key);

const isSelected = (key: string): boolean => selectedKey.value === key;

const isChecked = (row: TreeViewNode): boolean => checkedState.value.includes(row.key);

const isIndeterminate = (row: TreeViewNode): boolean => {
  if (props.checkStrictly || !row.hasChildren || row.disabled) return false;
  const children = childRowsOf(row).filter((child) => !child.disabled);
  if (children.length === 0) return false;
  const checked = children.some((child) => isChecked(child));
  const partial = children.some((child) => isIndeterminate(child));
  return !isChecked(row) && (checked || partial);
};

const nodeClass = (row: TreeViewNode): Record<string, boolean> => ({
  "is-selected": Boolean(props.highlightCurrent) && isSelected(row.key),
  "is-expanded": isExpanded(row.key),
  "is-disabled": row.disabled,
  "is-leaf": row.isLeaf,
  "has-children": row.hasChildren
});

const rowStyle = (row: TreeViewNode): Record<string, string> => ({
  paddingLeft: `${row.level * (Number(props.indent) || 20)}px`
});

const commitExpand = (row: TreeViewNode, open: boolean): void => {
  if (!row.hasChildren) return;
  const current = expandedState.peek();
  let next = current.filter(
    (key) =>
      key !== row.key &&
      !(open === false && findNode(key) && isDescendantOf(findNode(key)!, row.key))
  );

  if (open) {
    if (props.accordion) {
      const siblings = new Set(
        allNodes
          .peek()
          .filter((node) => node.parentKey === row.parentKey && node.hasChildren)
          .map((node) => node.key)
      );
      next = next.filter((key) => !siblings.has(key));
    }
    next.push(row.key);
  }

  setExpandedKeys(next, true);
  emit(open ? "node-expand" : "node-collapse", row.raw, row.key, next);
};

const toggleExpand = (row: TreeViewNode): void => {
  if (!row.hasChildren) return;
  commitExpand(row, !isExpanded(row.key));
};

const expand = (key: string): void => {
  const row = findNode(String(key));
  if (row && row.hasChildren && !isExpanded(row.key)) commitExpand(row, true);
};

const collapse = (key: string): void => {
  const row = findNode(String(key));
  if (row && row.hasChildren && isExpanded(row.key)) commitExpand(row, false);
};

const toggle = (key: string): void => {
  const row = findNode(String(key));
  if (row) toggleExpand(row);
};

const toggleCheck = (row: TreeViewNode): void => {
  if (row.disabled) return;
  const checked = new Set(checkedState.peek());
  const shouldCheck = !checked.has(row.key);

  if (props.checkStrictly) {
    if (shouldCheck) checked.add(row.key);
    else checked.delete(row.key);
  } else {
    const affected = descendantRowsOf(row, true).filter((node) => !node.disabled);
    for (const node of affected) {
      if (shouldCheck) checked.add(node.key);
      else checked.delete(node.key);
    }
    syncCascadeParents(checked);
  }

  const next = Array.from(checked);
  checkedState.set(next);
  lastCheckedSig.set(signature(next));
  emit("update:checkedKeys", next);
  emit("check", row.raw, next);
  emit("check-change", row.raw, shouldCheck, next);
};

const setChecked = (target: unknown, checked: boolean, deep = true): void => {
  const row = findNode(keyOf(target));
  if (!row || row.disabled) return;

  const set = new Set(checkedState.peek());
  const affected =
    !props.checkStrictly && deep
      ? descendantRowsOf(row, true).filter((node) => !node.disabled)
      : [row];

  for (const node of affected) {
    if (checked) set.add(node.key);
    else set.delete(node.key);
  }
  syncCascadeParents(set);

  const next = Array.from(set);
  checkedState.set(next);
  lastCheckedSig.set(signature(next));
  emit("update:checkedKeys", next);
  emit("check", row.raw, next);
  emit("check-change", row.raw, checked, next);
};

const check = (key: string): void => {
  setChecked(key, true, true);
};

const uncheck = (key: string): void => {
  setChecked(key, false, true);
};

const getCheckedKeys = (leafOnly = false): string[] =>
  checkedState.peek().filter((key) => {
    const row = findNode(key);
    return row && (!leafOnly || row.isLeaf);
  });

const getHalfCheckedKeys = (): string[] =>
  allNodes
    .peek()
    .filter((row) => isIndeterminate(row))
    .map((row) => row.key);

const getCheckedNodes = (
  leafOnly = false,
  includeHalfChecked = false
): Record<string, unknown>[] => {
  const keys = new Set(getCheckedKeys(leafOnly));
  if (includeHalfChecked) {
    for (const key of getHalfCheckedKeys()) {
      const row = findNode(key);
      if (row && (!leafOnly || row.isLeaf)) keys.add(key);
    }
  }
  return Array.from(keys)
    .map((key) => findNode(key)?.raw)
    .filter((node): node is Record<string, unknown> => !!node);
};

const getHalfCheckedNodes = (): Record<string, unknown>[] =>
  getHalfCheckedKeys()
    .map((key) => findNode(key)?.raw)
    .filter((node): node is Record<string, unknown> => !!node);

const getExpandedKeys = (): string[] => [...expandedState.peek()];

const getCurrentKey = (): string => selectedKey.peek();

const getCurrentNode = (): Record<string, unknown> | undefined =>
  selectedKey.peek() ? findNode(selectedKey.peek())?.raw : undefined;

const setCurrentKey = (key: string | number | null = ""): void => {
  const next = key == null ? "" : String(key);
  if (next && !findNode(next)) return;
  setSelectedKey(next, true);
};

const setCurrentNode = (node: Record<string, unknown> | null): void => {
  setCurrentKey(node ? keyOf(node) : null);
};

const getNode = (target: unknown): Record<string, unknown> | undefined => {
  const row = findNode(keyOf(target));
  return row?.raw;
};

const select = (key: string): void => {
  const row = findNode(String(key));
  if (!row || row.disabled) return;
  setSelectedKey(row.key, true);
  emit("node-click", row.raw, row.key, row);
};

const onNodeClick = (row: TreeViewNode): void => {
  if (row.disabled) return;
  select(row.key);
  if (props.checkOnClickNode && props.showCheckbox) toggleCheck(row);
  if (props.expandOnClickNode && row.hasChildren) toggleExpand(row);
};

const onNodeKeydown = (row: TreeViewNode, event: KeyboardEvent): void => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onNodeClick(row);
    return;
  }
  if (event.key === "ArrowRight" && row.hasChildren && !isExpanded(row.key)) {
    event.preventDefault();
    expand(row.key);
    return;
  }
  if (event.key === "ArrowLeft" && row.hasChildren && isExpanded(row.key)) {
    event.preventDefault();
    collapse(row.key);
  }
};

const onFilterInput = (event: Event): void => {
  filterText.set((event.target as HTMLInputElement).value);
  rebuildVisible();
};

const filter = (keyword: string): void => {
  filterText.set(keyword);
  rebuildVisible();
};

defineExpose({
  expand,
  collapse,
  toggle,
  select,
  check,
  uncheck,
  setChecked,
  setCheckedKeys,
  setCheckedNodes,
  getCheckedKeys,
  getCheckedNodes,
  getHalfCheckedKeys,
  getHalfCheckedNodes,
  setExpandedKeys,
  getExpandedKeys,
  setCurrentKey,
  setCurrentNode,
  getCurrentKey,
  getCurrentNode,
  getNode,
  filter
});

defineStyle(styles);

const rootClass = useComputed(() => (props.bordered ? "tree is-bordered" : "tree"));

const Tree = defineHtml(html`
  <div :class=${rootClass} role="tree" :aria-multiselectable=${props.showCheckbox ? "true" : "false"}>
    <div class="tree-filter" v-if=${props.filterable}>
      <input
        type="search"
        :value=${filterText}
        :placeholder=${props.filterPlaceholder || locale.t("tree.search")}
        @input="onFilterInput($event)"
      />
    </div>

    <div class="tree-body">
      <div v-if=${getVisibleNodes().length === 0} class="tree-empty">
        ${props.emptyText || locale.t("table.empty")}
      </div>

      <div
        v-for="row in getVisibleNodes()"
        :key="row.key"
        class="tree-node"
        :class="nodeClass(row)"
        :style="rowStyle(row)"
        role="treeitem"
        :aria-level="row.level + 1"
        :aria-expanded="row.hasChildren ? (isExpanded(row.key) ? 'true' : 'false') : null"
        :aria-selected="isSelected(row.key) ? 'true' : 'false'"
      >
        <button
          class="tree-switch"
          :class="{ 'is-expanded': isExpanded(row.key) }"
          type="button"
          :disabled="!row.hasChildren"
          :title=${locale.t(isExpanded(row.key) ? "common.collapse" : "common.expand")}
          @click.stop="toggleExpand(row)"
        >
          <span v-if="row.hasChildren" class="switch-icon"></span>
        </button>

        <button
          v-if=${props.showCheckbox}
          class="tree-checkbox"
          type="button"
          :class="{ 'is-checked': isChecked(row), 'is-indeterminate': isIndeterminate(row) }"
          :disabled="row.disabled"
          :aria-checked="isIndeterminate(row) ? 'mixed' : isChecked(row) ? 'true' : 'false'"
          @click.stop="toggleCheck(row)"
        >
          <span class="checkbox-mark"></span>
        </button>

        <div
          class="tree-content"
          tabindex="0"
          @click="onNodeClick(row)"
          @keydown="onNodeKeydown(row, $event)"
        >
          <span v-if="row.icon" class="tree-icon">{{ row.icon }}</span>
          <span class="tree-label">{{ row.label }}</span>
        </div>
      </div>
    </div>
  </div>
`);

interface TreeViewNode {
  key: string;
  label: string;
  icon: string;
  level: number;
  disabled: boolean;
  isLeaf: boolean;
  hasChildren: boolean;
  parentKey: string;
  path: string[];
  raw: Record<string, unknown>;
}

type TreeFieldConfig = {
  key: string;
  label: string;
  children: string;
  disabled: string;
  isLeaf: string;
  icon: string;
};

export { Tree };
