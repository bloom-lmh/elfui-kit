export interface TreeNode {
  key?: string | number;
  label?: string;
  disabled?: boolean;
  children?: TreeNode[];
  isLeaf?: boolean;
  icon?: string;
  [key: string]: unknown;
}

export interface TreeFieldNames {
  key?: string;
  label?: string;
  children?: string;
  disabled?: string;
  isLeaf?: string;
  icon?: string;
}

export interface TreeProps {
  data: TreeNode[];
  nodeKey: string;
  modelValue: string;
  currentNodeKey: string;
  defaultSelectedKey: string;
  defaultExpandedKeys: string[];
  defaultCheckedKeys: string[];
  expandedKeys?: string[];
  checkedKeys?: string[];
  props: TreeFieldNames;
  showCheckbox: boolean;
  checkStrictly: boolean;
  highlightCurrent: boolean;
  accordion: boolean;
  defaultExpandAll: boolean;
  expandOnClickNode: boolean;
  checkOnClickNode: boolean;
  filterable: boolean;
  filterPlaceholder: string;
  emptyText: string;
  indent: number;
  bordered: boolean;
}
