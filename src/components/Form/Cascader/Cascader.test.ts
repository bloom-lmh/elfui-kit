import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { CascaderOption } from "./types";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const flushFilter = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await tick();
  await tick();
};

interface CascaderEl extends HTMLElement {
  modelValue?: unknown[] | unknown[][];
  options?: CascaderOption[];
  clearable?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  checkable?: boolean;
  filterable?: boolean;
  debounce?: number;
  filterMethod?: (node: { label: string }, keyword: string) => boolean;
  beforeFilter?: (keyword: string) => boolean | Promise<boolean>;
  props?: Record<string, unknown>;
  clear?: () => void;
}

interface CascaderPanelEl extends HTMLElement {
  modelValue?: unknown[] | unknown[][];
  options?: CascaderOption[];
  multiple?: boolean;
  checkable?: boolean;
  props?: Record<string, unknown>;
  getCheckedNodes?: (leafOnly?: boolean) => unknown[];
  clearCheckedNodes?: () => void;
}

const options: CascaderOption[] = [
  {
    label: "浙江",
    value: "zhejiang",
    children: [
      { label: "杭州", value: "hangzhou" },
      { label: "宁波", value: "ningbo" }
    ]
  },
  {
    label: "江苏",
    value: "jiangsu",
    children: [{ label: "南京", value: "nanjing", disabled: true }]
  }
];

const mount = async (patch: Partial<CascaderEl> = {}): Promise<CascaderEl> => {
  const el = document.createElement("elf-cascader") as CascaderEl;
  Object.assign(el, { options, ...patch });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const mountPanel = async (patch: Partial<CascaderPanelEl> = {}): Promise<CascaderPanelEl> => {
  const el = document.createElement("elf-cascader-panel") as CascaderPanelEl;
  Object.assign(el, { options, ...patch });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-cascader", () => {
  it("点击 trigger 展开根级选项", async () => {
    const el = await mount();

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();

    expect(el.hasAttribute("data-open")).toBe(true);
    expect(el.shadowRoot!.querySelectorAll(".column")).toHaveLength(1);
    expect(el.shadowRoot!.textContent).toContain("浙江");
  });

  it("选择叶子节点触发 update:modelValue 和 change", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    el.addEventListener("change", onChange as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".column")).toHaveLength(2);

    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[0] as HTMLElement
    ).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["zhejiang", "hangzhou"]);
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail.path).toEqual(["浙江", "杭州"]);
    expect(el.hasAttribute("data-open")).toBe(false);
    expect(el.shadowRoot!.querySelector(".value")?.textContent).toContain("浙江 / 杭州");
  });

  it("传入 modelValue 时回显完整路径", async () => {
    const el = await mount({ modelValue: ["zhejiang", "ningbo"] });

    expect(el.shadowRoot!.querySelector(".value")?.textContent).toContain("浙江 / 宁波");
  });

  it("禁用选项不可选择", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[1] as HTMLElement).click();
    await tick();
    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[0] as HTMLElement
    ).click();
    await tick();

    expect(onUpdate).not.toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector(".option.is-disabled")).toBeTruthy();
  });

  it("clearable 可以清空值", async () => {
    const el = await mount({ modelValue: ["zhejiang", "hangzhou"], clearable: true });
    const onClear = vi.fn();
    const onUpdate = vi.fn();
    el.addEventListener("clear", onClear);
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelector(".clear") as HTMLElement).click();
    await tick();

    expect(onClear).toHaveBeenCalledTimes(1);
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual([]);
    expect(el.shadowRoot!.querySelector(".placeholder")).toBeTruthy();
  });

  it("multiple 多选叶子节点时输出二维路径数组", async () => {
    const el = await mount({ multiple: true });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[0] as HTMLElement
    ).click();
    await tick();
    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[1] as HTMLElement
    ).click();
    await tick();

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual([
      ["zhejiang", "hangzhou"],
      ["zhejiang", "ningbo"]
    ]);
    expect(el.hasAttribute("data-open")).toBe(true);
    expect(el.shadowRoot!.querySelector(".value")?.textContent).toContain("浙江 / 杭州");
    expect(el.shadowRoot!.querySelector(".value")?.textContent).toContain("浙江 / 宁波");
  });

  it("支持 Element Plus props.multiple 写法并默认展示复选框", async () => {
    const el = await mount({ props: { multiple: true } });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[0] as HTMLElement
    ).click();
    await tick();

    expect(el.shadowRoot!.querySelector(".option-checkbox")).toBeTruthy();
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual([
      ["zhejiang", "hangzhou"]
    ]);
  });

  it("props.emitPath=false 时对外输出末级值", async () => {
    const el = await mount({ props: { emitPath: false } });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[1] as HTMLElement
    ).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("ningbo");
  });

  it("checkable 点击父项会勾选子叶子并支持半选态", async () => {
    const el = await mount({ checkable: true });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual([
      ["zhejiang", "hangzhou"],
      ["zhejiang", "ningbo"]
    ]);
    expect(el.shadowRoot!.querySelector(".option-checkbox.is-checked")).toBeTruthy();

    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[0] as HTMLElement
    ).click();
    await tick();

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual([
      ["zhejiang", "ningbo"]
    ]);
    expect(el.shadowRoot!.querySelector(".option-checkbox.is-indeterminate")).toBeTruthy();
  });

  it("cascader-panel 独立面板支持选择和暴露已选节点", async () => {
    const el = await mountPanel();
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".column")).toHaveLength(2);

    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[0] as HTMLElement
    ).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["zhejiang", "hangzhou"]);
    expect(el.getCheckedNodes?.()[0]).toMatchObject({
      label: "杭州",
      pathLabels: ["浙江", "杭州"]
    });
  });

  it("cascader-panel 多选面板支持清空已选节点", async () => {
    const el = await mountPanel({ multiple: true, modelValue: [["zhejiang", "hangzhou"]] });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    expect(el.shadowRoot!.querySelector(".option-checkbox.is-checked")).toBeTruthy();
    el.clearCheckedNodes?.();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual([]);
    expect(el.getCheckedNodes?.()).toEqual([]);
  });

  it("filters selectable paths and selects the matching result", async () => {
    const el = await mount({ filterable: true, debounce: 0 });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".filter-input")!;
    input.value = "杭州";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await flushFilter();

    const results = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".filter-option");
    expect(results).toHaveLength(1);
    expect(results[0].textContent).toContain("杭州");
    results[0].click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["zhejiang", "hangzhou"]);
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  it("honors custom and asynchronous pre-filter hooks", async () => {
    const beforeFilter = vi.fn(async (keyword: string) => keyword !== "blocked");
    const filterMethod = vi.fn((node: { label: string }, keyword: string) => node.label === "宁波" && keyword === "city");
    const el = await mount({ filterable: true, debounce: 0, beforeFilter, filterMethod });
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".filter-input")!;

    input.value = "blocked";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await flushFilter();
    expect(beforeFilter).toHaveBeenCalledWith("blocked");
    expect(el.shadowRoot!.querySelectorAll(".filter-option")).toHaveLength(0);

    input.value = "city";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await flushFilter();
    expect(filterMethod).toHaveBeenCalled();
    expect(el.shadowRoot!.querySelectorAll(".filter-option")).toHaveLength(1);
    expect(el.shadowRoot!.querySelector(".filter-option")?.textContent).toContain("宁波");
  });
});
