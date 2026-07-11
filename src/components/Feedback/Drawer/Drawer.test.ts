// elf-drawer 测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 20));
const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const mask = (): HTMLElement | null => document.body.querySelector(".elf-drawer-mask");
const panel = (): HTMLElement | null => document.body.querySelector(".elf-drawer-panel");

type DrawerEl = HTMLElement & {
  open?: boolean;
  title?: string;
  direction?: string;
  size?: string;
  modal?: boolean;
  closeOnMask?: boolean;
  closeOnEscape?: boolean;
  closable?: boolean;
  lockScroll?: boolean;
  beforeClose?: (() => boolean | Promise<boolean>) | null;
  close?: () => void;
};

describe("elf-drawer", () => {
  it("默认关闭，open=true 后 Teleport 到 body", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.title = "我的抽屉";
    document.body.appendChild(el);
    await tick();

    expect(mask()).toBeNull();

    el.open = true;
    await tick();

    expect(mask()).toBeTruthy();
    expect(document.body.textContent).toContain("我的抽屉");
  });

  it("direction 反映到 panel class/style 和 host attribute", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.direction = "ltr";
    el.size = "200px";
    el.open = true;
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("direction")).toBe("ltr");
    expect(panel()?.className).toContain("ltr");
    expect(panel()?.getAttribute("style")).toContain("width: 200px");
  });

  it("vertical direction (ttb) 采用 height 作为 size", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.direction = "ttb";
    el.size = "150px";
    el.open = true;
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("direction")).toBe("ttb");
    expect(panel()?.className).toContain("ttb");
    expect(panel()?.getAttribute("style")).toContain("height: 150px");
  });

  it("modal=false 添加 no-modal class", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.modal = false;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    expect(mask()?.classList.contains("no-modal")).toBe(true);
  });

  it("close 按钮触发 close + update:open", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    let closeFired = false;
    let lastOpen: unknown = undefined;
    el.addEventListener("close", () => {
      closeFired = true;
    });
    el.addEventListener("update:open", (e) => {
      lastOpen = (e as CustomEvent).detail;
    });

    const btn = document.body.querySelector(".elf-drawer-close") as HTMLButtonElement;
    btn.click();
    await tick();

    expect(closeFired).toBe(true);
    expect(lastOpen).toBe(false);
  });

  it("closeOnMask=true 时点击遮罩关闭", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    let closeFired = false;
    el.addEventListener("close", () => {
      closeFired = true;
    });

    mask()?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await tick();
    expect(closeFired).toBe(true);
  });

  it("closeOnMask=false 时点击遮罩不关闭", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.open = true;
    el.closeOnMask = false;
    document.body.appendChild(el);
    await tick();

    let closeFired = false;
    el.addEventListener("close", () => {
      closeFired = true;
    });

    mask()?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await tick();
    expect(closeFired).toBe(false);
  });

  it("ESC 触发关闭", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    let closeFired = false;
    el.addEventListener("close", () => {
      closeFired = true;
    });

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await tick();
    expect(closeFired).toBe(true);
  });

  it("beforeClose 返回 false 阻止关闭", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.beforeClose = () => false;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    let closeFired = false;
    el.addEventListener("close", () => {
      closeFired = true;
    });

    const btn = document.body.querySelector(".elf-drawer-close") as HTMLButtonElement;
    btn.click();
    await tick();
    expect(closeFired).toBe(false);
    expect(el.open).toBe(true);
  });

  it("打开时锁滚动，关闭后还原", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    expect(document.body.style.overflow).toBe("hidden");

    el.open = false;
    await wait(400);
    expect(document.body.style.overflow).toBe("");
  });

  it("关闭时遮罩和面板同步离场", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    el.open = false;
    await tick();

    expect(mask()?.classList.contains("closing")).toBe(true);
    expect(mask()?.classList.contains("mask-closing")).toBe(true);

    await wait(260);
    expect(mask()).toBeNull();
  });

  it("light DOM 内容使用真实节点投射", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    const button = document.createElement("button");
    button.textContent = "抽屉按钮";
    let clicked = 0;
    button.addEventListener("click", () => {
      clicked++;
    });
    el.appendChild(button);
    el.open = true;
    document.body.appendChild(el);
    await tick();

    const teleportedButton = document.body.querySelector(".elf-drawer-body button");
    expect(teleportedButton).toBe(button);
    (teleportedButton as HTMLButtonElement).click();
    expect(clicked).toBe(1);
  });

  it("close() 公共 API 工作：触发 update:open 并移除 mask", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();
    expect(mask()).toBeTruthy();

    let lastOpen: unknown = undefined;
    el.addEventListener("update:open", (e) => {
      lastOpen = (e as CustomEvent).detail;
    });

    el.close?.();
    await tick();
    expect(lastOpen).toBe(false);
    await wait(400);
    expect(mask()).toBeNull();
  });
});
