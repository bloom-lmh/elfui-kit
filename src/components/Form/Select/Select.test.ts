// @ts-nocheck
// elf-select 单元测试

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

interface SelectEl extends HTMLElement {
  options?: unknown;
  props?: Record<string, string>;
  modelValue?: unknown;
  multiple?: boolean;
  multipleLimit?: number;
  clearable?: boolean;
  filterable?: boolean;
  allowCreate?: boolean;
  defaultFirstOption?: boolean;
  remote?: boolean;
  debounce?: number;
  remoteMethod?: (query: string) => void;
  selectedLabel?: () => string | string[];
}

const opts = [
  { value: "vue", label: "Vue 3" },
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "elfui", label: "ElfUI" },
  { value: "lit", label: "Lit" }
];

const opts2 = [
  { value: "a", label: "可选 A" },
  { value: "b", label: "可选 B" },
  { value: "c", label: "禁用 C", disabled: true }
];

describe("elf-select", () => {
  const mount = (): SelectEl => {
    const el = document.createElement("elf-select") as SelectEl;
    document.body.appendChild(el);
    return el;
  };

  it("reflects the shared field surface contract", async () => {
    const el = mount();
    el.setAttribute("variant", "outlined");
    el.setAttribute("label", "Framework");
    await tick();

    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.hasAttribute("data-has-label")).toBe(true);
    expect(el.shadowRoot!.querySelector(".field-label")?.textContent).toBe("Framework");
  });

  it.each(["default", "underlined", "solo", "solo-filled", "solo-inverted"])(
    "reflects the shared %s field variant",
    async (variant) => {
      const el = mount();
      el.setAttribute("variant", variant);
      await tick();
      expect(el.getAttribute("variant")).toBe(variant);
    }
  );

  it("keeps internal scrolling usable and closes on external page motion", async () => {
    const el = mount();
    el.options = opts;
    await tick();
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    const dropdown = el.shadowRoot!.querySelector(".dropdown") as HTMLElement;

    dropdown.dispatchEvent(new Event("scroll", { bubbles: true, composed: true }));
    await tick();
    expect(el.hasAttribute("data-open")).toBe(true);
    document.body.dispatchEvent(new Event("wheel", { bubbles: true, composed: true }));
    await tick();
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  // ═══ 基础功能 ═══

  it("点击 trigger 展开下拉", async () => {
    const el = mount();
    el.options = opts;
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".dropdown")).toBeNull();
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".dropdown")).toBeTruthy();
    expect(el.shadowRoot!.querySelectorAll(".option").length).toBe(6);
  });

  it("选择项 emit update:modelValue", async () => {
    const el = mount();
    el.options = opts;
    await tick();
    await tick();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();
    const items = el.shadowRoot!.querySelectorAll(".option");
    (items[1] as HTMLElement).click();
    await tick();
    await tick();

    expect(onUpdate).toHaveBeenCalled();
    const detail = (onUpdate.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toBe("react");
  });

  // ═══ v-model 模拟 ═══

  it("v-model 模拟单选", async () => {
    const el = mount();
    el.options = opts;
    // 模拟 v-model: prop + event listener
    el.modelValue = "";
    await tick();
    await tick();

    let emitted: unknown = null;
    el.addEventListener("update:modelValue", (e) => {
      emitted = (e as CustomEvent).detail;
      el.modelValue = emitted;
    });

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();

    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    await tick();

    expect(emitted).toBe("vue");
    expect(el.modelValue).toBe("vue");
  });

  it("v-model 模拟多选", async () => {
    const el = mount();
    el.options = opts;
    el.multiple = true;
    el.modelValue = [];
    await tick();
    await tick();

    let lastValue: unknown = [];
    el.addEventListener("update:modelValue", (e) => {
      lastValue = (e as CustomEvent).detail;
      el.modelValue = lastValue;
    });

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();

    // 多选时下拉不关闭，可以继续选
    const items = el.shadowRoot!.querySelectorAll(".option");
    (items[0] as HTMLElement).click();
    await tick();
    expect(lastValue).toEqual(["vue"]);

    (items[1] as HTMLElement).click();
    await tick();
    expect(lastValue).toEqual(["vue", "react"]);
  });

  it("clearable 清空", async () => {
    const el = mount();
    el.options = opts;
    el.modelValue = "vue";
    el.clearable = true;
    await tick();
    await tick();

    const onClear = vi.fn();
    el.addEventListener("clear", onClear as unknown as EventListener);
    (el.shadowRoot!.querySelector(".clear") as HTMLElement).click();
    await tick();
    expect(onClear).toHaveBeenCalled();
  });

  it("disabled 时无法展开", async () => {
    const el = mount();
    el.options = opts;
    el.setAttribute("disabled", "");
    await tick();
    await tick();
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    expect(el.shadowRoot!.querySelector(".dropdown")).toBeNull();
  });

  it("filterable 模式过滤", async () => {
    const el = mount();
    el.options = opts;
    el.filterable = true;
    await tick();
    await tick();
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();
    const filterInput = el.shadowRoot!.querySelector(".filter-input") as HTMLInputElement;
    filterInput.value = "Vue";
    filterInput.dispatchEvent(new Event("input"));
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".option").length).toBe(1);
  });

  it("支持 options 的 props 字段映射", async () => {
    const el = mount();
    el.options = [{ id: "cn", name: "中文", locked: false }];
    el.props = { value: "id", label: "name", disabled: "locked" };
    await tick();
    await tick();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelector(".option") as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls[0][0] as CustomEvent).detail).toBe("cn");
    expect(el.shadowRoot!.textContent).toContain("中文");
  });

  it("multiple-limit 限制多选数量并 remove-tag 透出被移除值", async () => {
    const el = mount();
    el.options = opts;
    el.multiple = true;
    el.multipleLimit = 1;
    el.modelValue = [];
    await tick();
    await tick();

    const onUpdate = vi.fn();
    const onRemove = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    el.addEventListener("remove-tag", onRemove as unknown as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[1] as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual(["vue"]);

    (el.shadowRoot!.querySelector(".tag-remove") as HTMLElement).click();
    await tick();
    expect((onRemove.mock.calls[0][0] as CustomEvent).detail).toBe("vue");
  });

  it("allow-create + default-first-option 支持回车创建", async () => {
    const el = mount();
    el.options = opts;
    el.filterable = true;
    el.allowCreate = true;
    el.defaultFirstOption = true;
    await tick();
    await tick();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    const input = el.shadowRoot!.querySelector(".filter-input") as HTMLInputElement;
    input.value = "Qwik";
    input.dispatchEvent(new Event("input"));
    await tick();
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();

    expect((onUpdate.mock.calls[0][0] as CustomEvent).detail).toBe("Qwik");
  });

  it("remote-method 按 debounce 触发", async () => {
    const el = mount();
    const remoteMethod = vi.fn();
    el.options = opts;
    el.filterable = true;
    el.remote = true;
    el.debounce = 0;
    el.remoteMethod = remoteMethod;
    await tick();
    await tick();

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    const input = el.shadowRoot!.querySelector(".filter-input") as HTMLInputElement;
    input.value = "vue";
    input.dispatchEvent(new Event("input"));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(remoteMethod).toHaveBeenCalledWith("vue");
  });

  it("placeholder 显示", async () => {
    const el = mount();
    el.options = opts;
    el.setAttribute("placeholder", "请选择一项");
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".placeholder")?.textContent).toBe("请选择一项");
  });

  // ═══ 多实例隔离 ═══

  it("两个 Select 实例不互相干扰", async () => {
    const el1 = mount();
    el1.options = opts;
    const el2 = mount();
    el2.options = opts2;
    await tick();
    await tick();

    let v1: unknown = null;
    let v2: unknown = null;
    el1.addEventListener("update:modelValue", (e) => {
      v1 = (e as CustomEvent).detail;
      el1.modelValue = v1;
    });
    el2.addEventListener("update:modelValue", (e) => {
      v2 = (e as CustomEvent).detail;
      el2.modelValue = v2;
    });

    // 操作 el1
    (el1.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();
    (el1.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    await tick();

    expect(v1).toBe("vue");
    expect(v2).toBeNull(); // el2 不受影响

    // 操作 el2
    (el2.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();
    (el2.shadowRoot!.querySelectorAll(".option")[1] as HTMLElement).click();
    await tick();
    await tick();

    expect(v1).toBe("vue"); // el1 值不变
    expect(v2).toBe("b");
  });

  it("多选模式打开另一个实例时，前一个实例自动收起", async () => {
    const el1 = mount();
    el1.options = opts;
    el1.multiple = true;
    el1.modelValue = [];
    const el2 = mount();
    el2.options = opts2;
    el2.multiple = true;
    el2.modelValue = [];
    await tick();
    await tick();

    (el1.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();
    expect(el1.hasAttribute("data-open")).toBe(true);
    expect(el1.shadowRoot!.querySelector(".dropdown.active")).toBeTruthy();

    (el2.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();

    expect(el1.hasAttribute("data-open")).toBe(false);
    expect(el1.shadowRoot!.querySelector(".dropdown.active")).toBeNull();
    expect(el2.hasAttribute("data-open")).toBe(true);
    expect(el2.shadowRoot!.querySelector(".dropdown.active")).toBeTruthy();
  });
});
