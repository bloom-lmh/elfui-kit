// elf-tooltip 测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 20));
const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

interface TooltipEl extends HTMLElement {
  content?: string;
  placement?: string;
  disabled?: boolean;
  trigger?: string;
  showAfter?: number;
  hideAfter?: number;
  effect?: string;
  visible?: boolean;
  show?: () => void;
  hide?: () => void;
}

describe("elf-tooltip", () => {
  it("默认隐藏，Hover 模式下 mouseenter 显示，mouseleave 隐藏", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "提示信息";
    el.innerHTML = "<button id='btn'>按钮</button>";
    document.body.appendChild(el);
    await tick();

    // 默认不渲染气泡
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();

    // 模拟 mouseenter 触发
    const container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    container.dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    await tick();

    const tooltip = el.shadowRoot!.querySelector(".tooltip-content");
    expect(tooltip).toBeTruthy();
    expect(tooltip!.textContent).toContain("提示信息");
    expect(tooltip!.className).toContain("active");

    // 模拟 mouseleave 触发
    container.dispatchEvent(new MouseEvent("mouseleave"));
    await tick();
    await tick();

    // 处于 closing 状态
    expect(tooltip!.className).toContain("closing");

    // 等待 150ms 优雅淡出延迟
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("Focus 模式下 focusin 显示，focusout 隐藏", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "Focus 提示";
    el.trigger = "focus";
    el.innerHTML = "<input id='inp' />";
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();

    const container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    container.dispatchEvent(new FocusEvent("focusin"));
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    container.dispatchEvent(new FocusEvent("focusout"));
    await tick();
    await wait(160);

    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("Click 模式下点击切换，点击外部关闭", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "Click 提示";
    el.trigger = "click";
    el.innerHTML = "<span>点我</span>";
    document.body.appendChild(el);
    await tick();

    const container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;

    // 第一次点击：显示
    container.dispatchEvent(new MouseEvent("click"));
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    // 第二次点击：隐藏
    container.dispatchEvent(new MouseEvent("click"));
    await tick();
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();

    // 再次显示后点击外部
    container.dispatchEvent(new MouseEvent("click"));
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    // 点击外部
    document.dispatchEvent(new MouseEvent("click"));
    await tick();
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("Contextmenu 模式下右键显示，再次右键隐藏，点击外部关闭", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "右键提示";
    el.trigger = "contextmenu";
    el.innerHTML = "<span>右键</span>";
    document.body.appendChild(el);
    await tick();

    const container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;

    // 右键触发
    const contextMenuEvt = new MouseEvent("contextmenu", { cancelable: true });
    container.dispatchEvent(contextMenuEvt);
    await tick();
    await tick();
    expect(contextMenuEvt.defaultPrevented).toBe(true);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    // 点击外部关闭
    document.dispatchEvent(new MouseEvent("click"));
    await tick();
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("Manual 模式由 visible 属性控制", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "手动提示";
    el.trigger = "manual";
    el.visible = false;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();

    el.visible = true;
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    el.visible = false;
    await tick();
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("showAfter 延迟显示与 hideAfter 延迟隐藏", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "延迟提示";
    el.showAfter = 100;
    el.hideAfter = 100;
    document.body.appendChild(el);
    await tick();

    const container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;

    container.dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    // 立即检查，因为有 100ms 延迟，应当还未显示
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();

    // 等待 110ms 后检查，应当显示
    await wait(110);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    container.dispatchEvent(new MouseEvent("mouseleave"));
    await tick();
    // 立即检查，应当还没开始隐藏
    expect(el.shadowRoot!.querySelector(".tooltip-content")!.className).not.toContain("closing");

    // 等待 110ms 后，开始隐藏（变为 closing）
    await wait(110);
    expect(el.shadowRoot!.querySelector(".tooltip-content")!.className).toContain("closing");

    // 再等 150ms 彻底销毁
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("disabled 属性为 true 时，mouseenter 不会触发显示", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "禁用提示";
    el.disabled = true;
    document.body.appendChild(el);
    await tick();

    const container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    container.dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("placement 和 effect 反映到气泡的 class", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "样式提示";
    el.placement = "bottom";
    el.effect = "light";
    document.body.appendChild(el);
    await tick();

    const container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    container.dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    await tick();

    const tooltip = el.shadowRoot!.querySelector(".tooltip-content") as HTMLElement;
    expect(tooltip.className).toContain("bottom");
    expect(tooltip.className).toContain("light");
  });

  it("可以通过 slot name='content' 传入自定义内容", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.innerHTML = "<div slot='content'>自定义内容</div>";
    document.body.appendChild(el);
    await tick();

    const container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    container.dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    await tick();

    const tooltip = el.shadowRoot!.querySelector(".tooltip-content") as HTMLElement;
    expect(tooltip).toBeTruthy();
    const slot = tooltip.querySelector("slot[name='content']");
    expect(slot).toBeTruthy();
  });

  it("可以通过 public API show() 和 hide() 来控制显示", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "API提示";
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();

    el.show!();
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    el.hide!();
    await tick();
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });
});
