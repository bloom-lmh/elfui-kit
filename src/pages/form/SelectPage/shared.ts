// Select 页面共享数据
import type { SelectOption } from "../../../components/Form";

export const opts: SelectOption[] = [
  { value: "vue", label: "Vue 3" },
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "elfui", label: "ElfUI" },
  { value: "lit", label: "Lit" }
];

export const optsWithDisabled: SelectOption[] = [
  { value: "a", label: "可选 A" },
  { value: "b", label: "可选 B" },
  { value: "c", label: "禁用 C", disabled: true }
];

export const customOptions = [
  { id: "designer", name: "设计师" },
  { id: "engineer", name: "工程师" },
  { id: "pm", name: "产品经理", locked: true },
  { id: "qa", name: "测试工程师" }
];

export const optionFields = {
  value: "id",
  label: "name",
  disabled: "locked"
};

export const remoteSource: SelectOption[] = [
  { value: "beijing", label: "北京" },
  { value: "shanghai", label: "上海" },
  { value: "shenzhen", label: "深圳" },
  { value: "hangzhou", label: "杭州" },
  { value: "chengdu", label: "成都" }
];
