// elf-transfer 类型定义

export interface TransferDataItem {
  [key: string]: unknown;
}

export interface TransferFieldNames {
  key: string;
  label: string;
  disabled?: string;
}

export interface TransferProps {
  /** 数据源 */
  data: TransferDataItem[];
  /** 选中项 key 数组（v-model） */
  modelValue: string[];
  /** 左右面板标题 */
  titles: [string, string];
  /** 是否可搜索 */
  filterable: boolean;
  /** 搜索框占位文本 */
  filterPlaceholder: string;
  /** 字段别名 */
  props: TransferFieldNames;
}
