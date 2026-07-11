import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

type PopConfirmEl = HTMLElement & {
  content?: string;
  visible?: boolean;
  trigger?: string;
  placement?: string;
  show?: () => void;
  hide?: () => void;
  toggle?: () => void;
  isVisible?: () => boolean;
};

const mount = async (patch: Partial<PopConfirmEl> = {}): Promise<PopConfirmEl> => {
  const el = document.createElement("elf-pop-confirm") as PopConfirmEl;
  Object.assign(el, { title: "确认删除？", content: "删除后不可恢复", ...patch });
  el.innerHTML = "<button>删除</button>";
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const openByClick = async (el: PopConfirmEl): Promise<void> => {
  (el.shadowRoot!.querySelector(".pop-confirm") as HTMLElement).click();
  await tick();
  await tick();
};

describe("elf-pop-confirm", () => {
  it("click 触发打开，确认后触发事件并关闭", async () => {
    const el = await mount();
    const onConfirm = vi.fn();
    const onUpdate = vi.fn();
    el.addEventListener("confirm", onConfirm);
    el.addEventListener("update:visible", onUpdate as EventListener);

    await openByClick(el);
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeTruthy();
    expect(el.hasAttribute("data-open")).toBe(true);

    (el.shadowRoot!.querySelector(".pop-confirm-action.primary") as HTMLElement).click();
    await tick();

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toBe(false);
    await wait(150);
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeNull();
  });

  it("支持受控 visible", async () => {
    const el = await mount({ visible: false });

    el.visible = true;
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeTruthy();

    el.visible = false;
    await tick();
    await wait(150);
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeNull();
  });

  it("点击外部和 ESC 可关闭", async () => {
    const el = await mount();

    el.show!();
    await tick();
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeTruthy();

    document.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await tick();
    await wait(150);
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeNull();

    el.show!();
    await tick();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    await wait(150);
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeNull();
  });

  it("focus trap 覆盖 shadowRoot 内可聚焦动作", async () => {
    const el = await mount();
    el.show!();
    await tick();
    await tick();

    const actions = Array.from(
      el.shadowRoot!.querySelectorAll<HTMLElement>(".pop-confirm-actions button")
    );
    expect(actions).toHaveLength(2);
    actions[1]!.focus();
    el.shadowRoot!.querySelector(".pop-confirm-popover")!.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true })
    );
    await tick();

    expect(el.shadowRoot!.activeElement).toBe(actions[0]);
  });
});
