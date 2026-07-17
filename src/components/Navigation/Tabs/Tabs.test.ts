import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface TabsEl extends HTMLElement {
  items?: unknown[];
  modelValue?: string | number;
  defaultValue?: string | number;
  direction?: string;
  tabPosition?: string;
  type?: string;
  closable?: boolean;
  addable?: boolean;
  editable?: boolean;
  stretch?: boolean;
  beforeLeave?: (newName: string | number, oldName: string | number) => boolean | void | Promise<boolean | void>;
  tabindex?: number;
  showPanels?: boolean;
  transition?: string;
  transitionDuration?: number;
  props?: Record<string, string>;
  select?: (value: string | number) => void;
  remove?: (value: string | number) => void;
  add?: () => void;
  currentName?: () => string | number;
  scrollToActiveTab?: () => void;
  removeFocus?: () => void;
  update?: () => DOMRect | null;
  tabListRef?: HTMLElement | null;
  tabBarRef?: HTMLElement | null;
}

const baseItems = [
  { label: "概览", value: "overview", icon: "O", content: "概览内容" },
  { label: "任务", value: "tasks", badge: 4, content: "任务内容" },
  { label: "审计", value: "audit", disabled: true, content: "审计内容" }
];

const mount = async (patch: Partial<TabsEl> = {}): Promise<TabsEl> => {
  const el = document.createElement("elf-tabs") as TabsEl;
  Object.assign(el, { items: baseItems, ...patch });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const mountComposed = async (markup: string, patch: Partial<TabsEl> = {}): Promise<TabsEl> => {
  const el = document.createElement("elf-tabs") as TabsEl;
  Object.assign(el, patch);
  el.innerHTML = markup;
  document.body.appendChild(el);
  await tick();
  await tick();
  await tick();
  return el;
};

const activeText = (el: TabsEl): string =>
  el.shadowRoot!.querySelector(".tab.is-active")?.textContent?.trim() || "";

describe("elf-tabs", () => {
  it("默认激活第一个可用 tab", async () => {
    const el = await mount();

    expect(activeText(el)).toContain("概览");
  });

  it("点击 tab 更新 modelValue 并触发 change", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    el.addEventListener("change", onChange as unknown as EventListener);

    (el.shadowRoot!.querySelectorAll(".tab")[1] as HTMLElement).click();
    await tick();
    await tick();

    expect(activeText(el)).toContain("任务");
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("tasks");
    expect(onChange).toHaveBeenCalled();
  });

  it("禁用 tab 不可切换", async () => {
    const el = await mount();

    (el.shadowRoot!.querySelectorAll(".tab")[2] as HTMLElement).click();
    await tick();

    expect(activeText(el)).toContain("概览");
  });

  it("vertical + showPanels 展示当前面板", async () => {
    const el = await mount({ direction: "vertical", showPanels: true, modelValue: "tasks" });

    expect(el.shadowRoot!.querySelector(".tabs.is-vertical")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".tab-panel.is-active")?.textContent).toContain("任务内容");
  });

  it("grow + stacked 变体开启 panels 时展示首个面板内容", async () => {
    const el = await mount({ showPanels: true });
    el.setAttribute("grow", "");
    el.setAttribute("stacked", "");
    await tick();

    expect(el.shadowRoot!.querySelector(".tabs.is-grow.is-stacked")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".tab-panel.is-active")?.textContent).toContain("概览内容");
  });

  it("支持字段别名", async () => {
    const el = await mount({
      props: { label: "name", value: "key", content: "body" },
      items: [
        { name: "资料", key: "profile", body: "资料内容" },
        { name: "账单", key: "billing", body: "账单内容" }
      ],
      modelValue: "billing",
      showPanels: true
    });

    expect(activeText(el)).toContain("账单");
    expect(el.shadowRoot!.querySelector(".tab-panel.is-active")?.textContent).toContain("账单内容");
  });

  it("支持面板切换过渡和自定义时长", async () => {
    const el = await mount({
      showPanels: true,
      transition: "slide",
      transitionDuration: 260
    });

    expect(el.shadowRoot!.querySelector(".tabs.transition-slide")).toBeTruthy();
    expect(
      (el.shadowRoot!.querySelector(".tabs") as HTMLElement).style.getPropertyValue(
        "--tabs-transition-duration"
      )
    ).toBe("260ms");
    expect(el.shadowRoot!.querySelectorAll(".tab-panel")).toHaveLength(3);
  });

  it("beforeLeave can block tab switching", async () => {
    const beforeLeave = vi.fn(() => false);
    const el = await mount({ beforeLeave });

    (el.shadowRoot!.querySelectorAll(".tab")[1] as HTMLElement).click();
    await tick();

    expect(beforeLeave).toHaveBeenCalledWith("tasks", "overview");
    expect(activeText(el)).toContain("概览");
  });

  it("supports closable, addable, editable events and exposes", async () => {
    const el = await mount({ closable: true, addable: true });
    const onRemove = vi.fn();
    const onAdd = vi.fn();
    const onEdit = vi.fn();
    el.addEventListener("tab-remove", onRemove as EventListener);
    el.addEventListener("tab-add", onAdd as EventListener);
    el.addEventListener("edit", onEdit as EventListener);

    (el.shadowRoot!.querySelector(".tab-close") as HTMLElement).click();
    await tick();
    expect((onRemove.mock.calls[0]![0] as CustomEvent).detail).toBe("overview");
    expect((onEdit.mock.calls[0]![0] as CustomEvent).detail).toEqual(["overview", "remove"]);
    expect(activeText(el)).toContain("任务");

    (el.shadowRoot!.querySelector(".tab-add") as HTMLElement).click();
    await tick();
    expect(onAdd).toHaveBeenCalled();
    expect((onEdit.mock.calls[1]![0] as CustomEvent).detail).toEqual([undefined, "add"]);

    el.select!("overview");
    await tick();
    expect(el.currentName!()).toBe("overview");
  });

  it("supports tabPosition, type and stretch classes", async () => {
    const el = await mount({ tabPosition: "right", type: "border-card", stretch: true });
    const root = el.shadowRoot!.querySelector(".tabs")!;

    expect(root.className).toContain("is-right");
    expect(root.className).toContain("is-vertical");
    expect(root.className).toContain("is-border-card");
    expect(root.className).toContain("is-stretch");
  });

  it("supports numeric names and roving keyboard navigation", async () => {
    const el = await mount({
      items: [
        { label: "一", value: 1 },
        { label: "二", value: 2, disabled: true },
        { label: "三", value: 3 }
      ],
      modelValue: 1
    });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    const buttons = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".tab");

    expect(buttons[0]!.tabIndex).toBe(0);
    expect(buttons[2]!.tabIndex).toBe(-1);
    buttons[0]!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(3);
    expect(buttons[2]!.className).toContain("is-active");
    expect(buttons[2]!.tabIndex).toBe(0);
  });

  it("treats a rejected beforeLeave promise as a blocked transition", async () => {
    const el = await mount({ beforeLeave: () => Promise.reject(new Error("blocked")) });

    (el.shadowRoot!.querySelectorAll(".tab")[1] as HTMLButtonElement).click();
    await tick();
    await tick();

    expect(activeText(el)).toContain("概览");
  });

  it("supports compositional panes, rich label slots and lazy panels", async () => {
    const el = await mountComposed(`
      <elf-tab-pane label="概览" name="overview">概览面板</elf-tab-pane>
      <elf-tab-pane name="tasks" lazy>
        <span slot="label"><strong>任务</strong><small>4</small></span>
        任务面板
      </elf-tab-pane>
      <elf-tab-pane label="审计" name="audit" disabled>审计面板</elf-tab-pane>
    `, { modelValue: "overview" });
    const panes = el.querySelectorAll<HTMLElement>("elf-tab-pane");
    const labelSlot = el.shadowRoot!.querySelector<HTMLSlotElement>(".tab-label slot")!;

    expect(el.hasAttribute("data-composed")).toBe(true);
    expect(labelSlot.assignedElements()[0]!.textContent).toContain("任务4");
    expect(panes[0]!.hasAttribute("data-active")).toBe(true);
    expect(panes[1]!.shadowRoot!.querySelector(".tab-pane")).toBeNull();

    (el.shadowRoot!.querySelectorAll(".tab")[1] as HTMLButtonElement).click();
    await tick();
    await tick();

    expect(panes[1]!.hasAttribute("data-active")).toBe(true);
    const contentSlot = panes[1]!.shadowRoot!.querySelector<HTMLSlotElement>(".tab-pane slot")!;
    expect(contentSlot.assignedNodes().map((node) => node.textContent).join("")).toContain("任务面板");
  });

  it("chooses the active fallback before a controlled pane is removed synchronously", async () => {
    const el = await mountComposed(`
      <elf-tab-pane label="概览" name="overview" closable>概览面板</elf-tab-pane>
      <elf-tab-pane label="任务" name="tasks" closable>任务面板</elf-tab-pane>
      <elf-tab-pane label="临时" name="temporary" closable>临时面板</elf-tab-pane>
    `, { modelValue: "temporary", editable: true });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    el.addEventListener("tab-remove", (event) => {
      const removed = String((event as CustomEvent).detail);
      Array.from(el.querySelectorAll("elf-tab-pane"))
        .find((pane) => String((pane as HTMLElement & { name?: string }).name) === removed)
        ?.remove();
    });

    (el.shadowRoot!.querySelector(".tab.is-active .tab-close") as HTMLElement).click();
    await tick();
    await tick();

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toBe("tasks");
  });

  it("supports the add-icon slot and navigation exposes", async () => {
    const el = await mountComposed(`
      <span slot="add-icon">新增</span>
      <elf-tab-pane label="概览" name="overview">概览面板</elf-tab-pane>
      <elf-tab-pane label="任务" name="tasks">任务面板</elf-tab-pane>
    `, { modelValue: "overview", addable: true });

    expect(el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="add-icon"]')!.assignedElements()[0]!.textContent).toBe("新增");
    expect(el.tabListRef).toBe(el.shadowRoot!.querySelector(".tab-list"));
    expect(el.tabBarRef).toBe(el.shadowRoot!.querySelector(".tab-slider"));
    expect(el.update!()).toBeInstanceOf(DOMRect);

    (el.shadowRoot!.querySelector(".tab.is-active") as HTMLButtonElement).focus();
    el.removeFocus!();
    expect(el.shadowRoot!.activeElement).toBeNull();
  });

  it("renders a stable empty state", async () => {
    const el = await mount({ items: [], showPanels: true });

    expect(el.shadowRoot!.querySelectorAll(".tab")).toHaveLength(0);
    expect(el.shadowRoot!.querySelectorAll(".tab-panel")).toHaveLength(0);
    expect(el.currentName!()).toBe("");
  });
});
