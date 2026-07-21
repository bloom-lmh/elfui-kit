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
  variant?: string;
  label?: string;
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
    (el.shadowRoot!.querySelector(".field-trigger") as HTMLButtonElement).click();
    await tick();
    await tick();
    (el.shadowRoot!.querySelector('[data-clock-value="10"]') as HTMLButtonElement).click();
    await tick();
    (el.shadowRoot!.querySelector('[data-clock-value="45"]') as HTMLButtonElement).click();
    await tick();

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toBe("10:45");
    (el.shadowRoot!.querySelector(".clear") as HTMLElement).click();
    expect(onClear).toHaveBeenCalled();
  });

  it("modelValue 回显到时间触发器", async () => {
    const el = document.createElement("elf-time-picker") as TimePickerEl;
    el.modelValue = "09:30";
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".field-value")?.textContent).toContain("09:30");
  });

  it("switches from the hour dial to a fresh minute dial without reusing stale clock nodes", async () => {
    const el = document.createElement("elf-time-picker") as TimePickerEl;
    el.modelValue = "09:30";
    document.body.appendChild(el);
    await tick();

    (el.shadowRoot!.querySelector(".field-trigger") as HTMLButtonElement).click();
    await tick();
    const hourButtons = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".clock-number");
    expect(Array.from(hourButtons, (button) => button.textContent?.trim())).toEqual([
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
    ]);

    hourButtons[9]!.click();
    await tick();
    const minuteButtons = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".clock-number");
    expect(Array.from(minuteButtons, (button) => button.textContent?.trim())).toEqual([
      "00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"
    ]);
    expect(minuteButtons[6]!.getAttribute("aria-pressed")).toBe("true");
    expect(minuteButtons[6]!.style.getPropertyValue("--clock-angle")).toBe("180deg");

    const digitalParts = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".digital-part");
    expect(digitalParts[1]!.classList.contains("is-active")).toBe(true);
    digitalParts[0]!.click();
    await tick();
    expect(el.shadowRoot!.querySelector(".digital-part.is-active")?.textContent?.trim()).toBe("10");
  });

  it("keeps a configured label floated when an empty value also renders a placeholder", async () => {
    const el = document.createElement("elf-time-picker") as TimePickerEl;
    el.label = "开始时间";
    document.body.appendChild(el);
    await tick();

    const trigger = el.shadowRoot!.querySelector(".field-trigger") as HTMLButtonElement;
    expect(trigger.classList.contains("has-label")).toBe(true);
    expect(el.shadowRoot!.querySelector(".field-label")?.textContent).toBe("开始时间");
    expect(el.shadowRoot!.querySelector(".field-value")?.classList.contains("is-placeholder")).toBe(true);
  });

  it("supports keyboard five-minute adjustment without opening the panel", async () => {
    const el = document.createElement("elf-time-picker") as TimePickerEl;
    el.modelValue = "09:30";
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    document.body.appendChild(el);
    await tick();

    const trigger = el.shadowRoot!.querySelector(".field-trigger") as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toBe("09:35");
    expect(el.shadowRoot!.querySelector(".panel")).toBeNull();
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

    const fields = el.shadowRoot!.querySelectorAll(".field-value");
    expect(fields[0]?.textContent).toContain("09:00");
    expect(fields[1]?.textContent).toContain("18:00");

    (el.shadowRoot!.querySelectorAll(".field-trigger")[1] as HTMLButtonElement).click();
    await tick();
    await tick();
    (el.shadowRoot!.querySelector('[data-clock-value="7"]') as HTMLButtonElement).click();
    await tick();
    (el.shadowRoot!.querySelector('[data-clock-value="0"]') as HTMLButtonElement).click();
    await tick();

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual(["09:00", "19:00"]);
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

    const trigger = el.shadowRoot!.querySelector(".field-trigger") as HTMLButtonElement;
    trigger.dispatchEvent(new FocusEvent("focus"));
    trigger.dispatchEvent(new FocusEvent("blur"));
    trigger.click();
    await tick();
    trigger.click();
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

    (el.shadowRoot!.querySelector(".field-trigger") as HTMLButtonElement).click();
    await tick();
    (el.shadowRoot!.querySelector(".shortcut") as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["09:00", "18:00"]);
  });

  it("范围快捷项可以重复切换并清空", async () => {
    const el = document.createElement("elf-time-picker") as TimePickerEl;
    el.isRange = true;
    el.modelValue = ["09:00", "18:00"];
    el.clearable = true;
    el.shortcuts = [
      { label: "工作日", value: "09:00", endValue: "18:00" },
      { label: "晚上", value: "19:00", endValue: "22:00" }
    ];
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    document.body.appendChild(el);
    await tick();
    await tick();

    (el.shadowRoot!.querySelector(".field-trigger") as HTMLButtonElement).click();
    await tick();
    const buttons = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".shortcut");
    buttons[1]!.click();
    await tick();
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual(["19:00", "22:00"]);

    (el.shadowRoot!.querySelector(".clear") as HTMLButtonElement).click();
    await tick();
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual(["", ""]);
    expect(Array.from(el.shadowRoot!.querySelectorAll(".field-value"), (field) => field.textContent?.trim())).toEqual([
      "开始时间",
      "结束时间"
    ]);

    buttons[0]!.click();
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual(["09:00", "18:00"]);
  });

  it("uses the shared surface and closes only on outside interaction or external scroll", async () => {
    const el = document.createElement("elf-time-picker") as TimePickerEl;
    el.variant = "outlined";
    el.label = "Start time";
    document.body.appendChild(el);
    await tick();
    (el.shadowRoot!.querySelector(".field-trigger") as HTMLButtonElement).click();
    await tick();
    const panel = el.shadowRoot!.querySelector(".panel") as HTMLElement;

    panel.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    expect(el.shadowRoot!.querySelector(".panel")).not.toBeNull();
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    await tick();
    expect(el.shadowRoot!.querySelector(".panel")).toBeNull();

    (el.shadowRoot!.querySelector(".field-trigger") as HTMLButtonElement).click();
    await tick();
    window.dispatchEvent(new Event("scroll"));
    await tick();
    expect(el.shadowRoot!.querySelector(".panel")).toBeNull();
    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.shadowRoot!.querySelector(".field-label")?.textContent).toBe("Start time");
  });

  it.each(["default", "underlined", "solo", "solo-filled", "solo-inverted"])(
    "reflects the shared %s field variant",
    async (variant) => {
      const el = document.createElement("elf-time-picker") as TimePickerEl;
      el.variant = variant;
      document.body.appendChild(el);
      await tick();
      expect(el.getAttribute("variant")).toBe(variant);
    }
  );
});
