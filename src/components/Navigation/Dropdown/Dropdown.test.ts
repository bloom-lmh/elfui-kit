import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../index");
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface DropdownEl extends HTMLElement {
  items?: unknown[];
  label?: string;
  trigger?: string;
  triggerKeys?: string[];
  type?: string;
  buttonProps?: Record<string, unknown>;
  showTimeout?: number;
  hideTimeout?: number;
  popperClass?: string;
  popperStyle?: Record<string, string>;
  persistent?: boolean;
  closeOnClickOutside?: boolean;
  hideOnClick?: boolean;
  handleOpen?: () => void;
  handleClose?: () => void;
}

const items = [
  { label: "编辑", command: "edit", icon: "E" },
  { label: "归档", command: "archive", disabled: true },
  { label: "更多", command: "more", children: [{ label: "复制", command: "copy" }] }
];

const mount = async (patch: Partial<DropdownEl> = {}): Promise<DropdownEl> => {
  const el = document.createElement("elf-dropdown") as DropdownEl;
  Object.assign(el, { items, label: "操作", ...patch });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-dropdown", () => {
  it("click trigger 打开菜单", async () => {
    const el = await mount();

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();

    expect(el.hasAttribute("data-open")).toBe(true);
    expect(el.shadowRoot!.querySelector(".menu.is-open")).toBeTruthy();
  });

  it("点击菜单项触发 command 并关闭", async () => {
    const el = await mount();
    const onCommand = vi.fn();
    el.addEventListener("command", onCommand as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelector(".item") as HTMLElement).click();
    await tick();

    expect((onCommand.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      command: "edit",
      item: expect.objectContaining({ label: "编辑", command: "edit" })
    });
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  it("选择后触发器显示当前选中项", async () => {
    const el = await mount();

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelector(".item") as HTMLElement).click();
    await tick();

    expect(el.shadowRoot!.querySelector(".trigger")?.textContent).toContain("编辑");
    expect(el.shadowRoot!.querySelector(".item.is-selected")?.textContent).toContain("编辑");
  });

  it("hideOnClick=false 时选择后保持展开", async () => {
    const el = await mount({ hideOnClick: false });

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelector(".item") as HTMLElement).click();
    await tick();

    expect(el.hasAttribute("data-open")).toBe(true);
  });

  it("hover trigger 可以打开", async () => {
    const el = await mount({ trigger: "hover", showTimeout: 0 });

    el.shadowRoot!.querySelector(".dropdown")!.dispatchEvent(new MouseEvent("mouseenter"));
    await tick();

    expect(el.hasAttribute("data-open")).toBe(true);
  });

  it("hover 离开时延迟关闭，允许鼠标移入菜单", async () => {
    vi.useFakeTimers();
    const el = await mount({ trigger: "hover", showTimeout: 0 });
    const root = el.shadowRoot!.querySelector(".dropdown")!;

    root.dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    expect(el.hasAttribute("data-open")).toBe(true);

    root.dispatchEvent(new MouseEvent("mouseleave"));
    await vi.advanceTimersByTimeAsync(120);
    await tick();
    expect(el.hasAttribute("data-open")).toBe(true);

    root.dispatchEvent(new MouseEvent("mouseenter"));
    await vi.advanceTimersByTimeAsync(220);
    await tick();
    expect(el.hasAttribute("data-open")).toBe(true);

    root.dispatchEvent(new MouseEvent("mouseleave"));
    await vi.advanceTimersByTimeAsync(220);
    await tick();
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  it("嵌套子菜单项可以触发 command", async () => {
    const el = await mount();
    const onCommand = vi.fn();
    el.addEventListener("command", onCommand as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelector(".sub-menu .item") as HTMLElement).click();
    await tick();

    expect((onCommand.mock.calls[0]![0] as CustomEvent).detail.command).toBe("copy");
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  it("打开另一个 Dropdown 时会收起前一个实例", async () => {
    const first = await mount({ label: "第一个" });
    const second = await mount({ label: "第二个" });

    (first.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    expect(first.hasAttribute("data-open")).toBe(true);

    (second.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();

    expect(first.hasAttribute("data-open")).toBe(false);
    expect(first.shadowRoot!.querySelector(".menu.is-open")).toBeNull();
    expect(second.hasAttribute("data-open")).toBe(true);
    expect(second.shadowRoot!.querySelector(".menu.is-open")).toBeTruthy();
  });

  it("supports handleOpen, handleClose and trigger keys", async () => {
    const el = await mount({ triggerKeys: ["ArrowDown"] });

    el.handleOpen!();
    await tick();
    expect(el.hasAttribute("data-open")).toBe(true);

    el.handleClose!();
    await tick();
    expect(el.hasAttribute("data-open")).toBe(false);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
    );
    await tick();
    expect(el.hasAttribute("data-open")).toBe(true);
  });

  it("supports popper class/style, button props and non-persistent panel", async () => {
    const el = await mount({
      type: "primary",
      buttonProps: { class: "extra-trigger", style: { width: "120px" } },
      popperClass: "extra-menu",
      popperStyle: { width: "220px" },
      persistent: false
    });

    expect(el.shadowRoot!.querySelector(".menu")).toBeNull();
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();

    const trigger = el.shadowRoot!.querySelector(".trigger") as HTMLElement;
    const menu = el.shadowRoot!.querySelector(".menu") as HTMLElement;
    expect(trigger.className).toContain("is-primary");
    expect(trigger.className).toContain("extra-trigger");
    expect(trigger.getAttribute("style")).toContain("width: 120px");
    expect(menu.className).toContain("extra-menu");
    expect(menu.getAttribute("style")).toContain("width: 220px");
  });

  it("close-on-click-outside=false keeps panel open", async () => {
    const el = await mount({ closeOnClickOutside: false });

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    document.body.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await tick();

    expect(el.hasAttribute("data-open")).toBe(true);
  });
});
