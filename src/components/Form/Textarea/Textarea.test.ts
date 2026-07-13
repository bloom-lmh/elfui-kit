// @ts-nocheck
// elf-textarea 单元测试

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const flush = (): Promise<void> =>
  Promise.resolve()
    .then(() => Promise.resolve())
    .then(() => Promise.resolve());

type TextareaHost = HTMLElement & {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  rows?: number;
  showCount?: boolean;
  maxlength?: number;
  autosize?: boolean | { minRows?: number; maxRows?: number };
};

describe("elf-textarea", () => {
  const mount = (): TextareaHost => {
    const el = document.createElement("elf-textarea") as TextareaHost;
    document.body.appendChild(el);
    return el;
  };

  it("渲染 textarea 元素", async () => {
    const el = mount();
    await flush();
    expect(el.shadowRoot!.querySelector("textarea")).toBeTruthy();
  });

  it("v-model — input 事件 emit update:modelValue", async () => {
    const el = mount();
    await flush();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const ta = el.shadowRoot!.querySelector("textarea")!;
    ta.value = "hello world";
    ta.dispatchEvent(new Event("input"));
    await flush();

    expect(onUpdate).toHaveBeenCalled();
    const detail = (onUpdate.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toBe("hello world");
  });

  it("rows 属性", async () => {
    const el = mount();
    el.rows = 5;
    await flush();
    const ta = el.shadowRoot!.querySelector("textarea")!;
    expect(Number(ta.rows)).toBe(5);
  });

  it("autosize 会根据输入内容调整高度", async () => {
    const el = mount();
    el.autosize = { minRows: 2, maxRows: 6 };
    await flush();
    const ta = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;
    Object.defineProperty(ta, "scrollHeight", { configurable: true, value: 96 });
    ta.value = "第一行\n第二行\n第三行\n第四行";
    ta.dispatchEvent(new Event("input"));
    await flush();

    expect(ta.style.height).toBe("96px");
    expect(el.hasAttribute("autosize")).toBe(true);
  });

  it("placeholder", async () => {
    const el = mount();
    el.placeholder = "请输入内容";
    await flush();
    const ta = el.shadowRoot!.querySelector("textarea")!;
    expect(ta.placeholder).toBe("请输入内容");
  });

  it("disabled prop 设置后 textarea disabled", async () => {
    const el = mount();
    await flush();
    el.disabled = true;
    await flush();
    const ta = el.shadowRoot!.querySelector("textarea")!;
    // disabled attribute 存在即禁用
    expect(ta.hasAttribute("disabled") || ta.disabled).toBe(true);
  });

  it("readonly", async () => {
    const el = mount();
    await flush();
    el.readonly = true;
    await flush();
    const ta = el.shadowRoot!.querySelector("textarea")!;
    expect(ta.readOnly).toBe(true);
  });

  it("showCount 显示字符数", async () => {
    const el = mount();
    el.showCount = true;
    el.modelValue = "abc";
    await flush();
    const count = el.shadowRoot!.querySelector(".count");
    expect(count?.textContent).toContain("3");
  });

  it("showCount + maxlength 同时显示", async () => {
    const el = mount();
    el.showCount = true;
    el.maxlength = 10;
    el.modelValue = "hi";
    await flush();
    const count = el.shadowRoot!.querySelector(".count");
    expect(count?.textContent).toContain("2/10");
  });

  it("focus / blur 事件", async () => {
    const el = mount();
    await flush();

    const onFocus = vi.fn();
    const onBlur = vi.fn();
    el.addEventListener("focus", onFocus as unknown as EventListener);
    el.addEventListener("blur", onBlur as unknown as EventListener);

    const ta = el.shadowRoot!.querySelector("textarea")!;
    ta.dispatchEvent(new FocusEvent("focus"));
    ta.dispatchEvent(new FocusEvent("blur"));

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("size 反射到 host", async () => {
    const el = mount();
    el.setAttribute("size", "lg");
    await flush();
    expect(el.getAttribute("size")).toBe("lg");
  });
});
