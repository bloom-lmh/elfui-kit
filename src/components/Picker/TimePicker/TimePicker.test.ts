import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface TimePickerEl extends HTMLElement {
  modelValue?: string | [string, string];
  clearable?: boolean;
  isRange?: boolean;
  shortcuts?: Array<{ label: string; value: string; endValue?: string }>;
}

describe("elf-time-picker", () => {
  it("输入时间触发更新，清空触发 clear", async () => {
    const el = document.createElement("elf-time-picker") as TimePickerEl;
    el.modelValue = "09:30";
    el.clearable = true;
    document.body.appendChild(el);
    await tick();
    await tick();

    const onUpdate = vi.fn();
    const onClear = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    el.addEventListener("clear", onClear as unknown as EventListener);
    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "10:45";
    input.dispatchEvent(new Event("input"));
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("10:45");
    (el.shadowRoot!.querySelector(".clear") as HTMLElement).click();
    expect(onClear).toHaveBeenCalled();
  });

  it("modelValue 回显到原生 time 输入", async () => {
    const el = document.createElement("elf-time-picker") as TimePickerEl;
    el.modelValue = "09:30";
    document.body.appendChild(el);
    await tick();
    await tick();

    expect((el.shadowRoot!.querySelector("input") as HTMLInputElement).value).toBe("09:30");
  });

  it("isRange 支持数组 v-model 并输出数组", async () => {
    const el = document.createElement("elf-time-picker") as TimePickerEl;
    el.isRange = true;
    el.modelValue = ["09:00", "18:00"];
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    document.body.appendChild(el);
    await tick();
    await tick();

    const inputs = el.shadowRoot!.querySelectorAll("input");
    expect((inputs[0] as HTMLInputElement).value).toBe("09:00");
    expect((inputs[1] as HTMLInputElement).value).toBe("18:00");

    (inputs[1] as HTMLInputElement).value = "19:00";
    inputs[1]!.dispatchEvent(new Event("input"));
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["09:00", "19:00"]);
  });

  it("focus / blur 会触发 visible-change", async () => {
    const el = document.createElement("elf-time-picker") as TimePickerEl;
    const onVisible = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    el.addEventListener("visible-change", onVisible as unknown as EventListener);
    el.addEventListener("focus", onFocus as unknown as EventListener);
    el.addEventListener("blur", onBlur as unknown as EventListener);
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    input.dispatchEvent(new FocusEvent("blur"));
    await tick();

    expect((onVisible.mock.calls[0]![0] as CustomEvent).detail).toBe(true);
    expect((onVisible.mock.calls[1]![0] as CustomEvent).detail).toBe(false);
    expect(onFocus).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });

  it("快捷项使用事件代理并支持范围值", async () => {
    const el = document.createElement("elf-time-picker") as TimePickerEl;
    el.isRange = true;
    el.shortcuts = [{ label: "工作日", value: "09:00", endValue: "18:00" }];
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    document.body.appendChild(el);
    await tick();
    await tick();

    (el.shadowRoot!.querySelector(".shortcut") as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["09:00", "18:00"]);
  });
});
