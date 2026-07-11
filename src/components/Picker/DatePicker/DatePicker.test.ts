import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface DatePickerEl extends HTMLElement {
  modelValue?: string | string[];
  endValue?: string;
  type?: string;
  range?: boolean;
  multiple?: boolean;
  actions?: boolean;
  showHeader?: boolean;
  header?: string;
  clearable?: boolean;
  shortcuts?: unknown[];
}

const mount = async (patch: Partial<DatePickerEl> = {}): Promise<DatePickerEl> => {
  const el = document.createElement("elf-date-picker") as DatePickerEl;
  Object.assign(el, patch);
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const changeInput = async (input: HTMLInputElement, value: string): Promise<void> => {
  input.value = value;
  input.dispatchEvent(new Event("change"));
  await tick();
};

describe("elf-date-picker", () => {
  it("range 快捷项同时更新开始和结束日期", async () => {
    const el = await mount({
      range: true,
      shortcuts: [{ label: "本周", value: "2026-06-15", endValue: "2026-06-21" }]
    });

    const onStart = vi.fn();
    const onEnd = vi.fn();
    el.addEventListener("update:modelValue", onStart as unknown as EventListener);
    el.addEventListener("update:endValue", onEnd as unknown as EventListener);
    (el.shadowRoot!.querySelector(".shortcut") as HTMLElement).click();
    await tick();

    expect((onStart.mock.calls[0]![0] as CustomEvent).detail).toBe("2026-06-15");
    expect((onEnd.mock.calls[0]![0] as CustomEvent).detail).toBe("2026-06-21");
  });

  it("multiple 模式切换日期并 emit 数组", async () => {
    const el = await mount({ multiple: true });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    await changeInput(el.shadowRoot!.querySelector(".field") as HTMLInputElement, "2026-06-18");

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["2026-06-18"]);
    expect(el.shadowRoot!.querySelector(".chip")?.textContent).toContain("2026-06-18");
  });

  it("actions 模式在确认前不提交", async () => {
    const el = await mount({ actions: true });
    const onUpdate = vi.fn();
    const onConfirm = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    el.addEventListener("confirm", onConfirm as unknown as EventListener);

    await changeInput(el.shadowRoot!.querySelector(".field") as HTMLInputElement, "2026-06-19");
    expect(onUpdate).not.toHaveBeenCalled();

    (el.shadowRoot!.querySelector(".primary-action") as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("2026-06-19");
    expect((onConfirm.mock.calls[0]![0] as CustomEvent).detail).toBe("2026-06-19");
  });

  it("cancel 会恢复到外部 modelValue", async () => {
    const el = await mount({ actions: true, modelValue: "2026-06-01" });
    const input = el.shadowRoot!.querySelector(".field") as HTMLInputElement;

    await changeInput(input, "2026-06-20");
    (el.shadowRoot!.querySelector(".text-action") as HTMLElement).click();
    await tick();

    expect(input.value).toBe("2026-06-01");
  });

  it("showHeader 与 month 类型正常渲染", async () => {
    const el = await mount({ showHeader: true, header: "选择月份", type: "month" });

    expect(el.shadowRoot!.querySelector(".header-title")?.textContent).toContain("选择月份");
    expect((el.shadowRoot!.querySelector(".field") as HTMLInputElement).type).toBe("month");
  });
});
