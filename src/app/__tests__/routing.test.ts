// 路由集成回归测试 — 跑通 elf-link 点击 → router-view 切换页面
//
// 这个测试模拟用户报告的"点击导航无响应"问题

import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import type { createRouter as createRouterFactory } from "@elfui/router";
import type { RenderFn } from "@elfui/runtime";

let createRouterForTest: typeof createRouterFactory;

beforeAll(async () => {
  await import("../../components");
  const { App } = await import("../AppShell/index");
  const { createRouter } = await import("@elfui/router");
  const { compile } = await import("@elfui/compiler");
  const { setTemplateCompiler } = await import("@elfui/chain");
  const { defineComponent, registerComponents } = await import("elfui");
  setTemplateCompiler((template) => compile(template) as unknown as RenderFn);
  createRouterForTest = createRouter;
  registerComponents(App);

  // 三个简单页面
  if (!customElements.get("test-home")) {
    defineComponent({ name: "test-home", template: "<div>HOME</div>" });
  }
  if (!customElements.get("test-button")) {
    defineComponent({ name: "test-button", template: "<div>BUTTON-PAGE</div>" });
  }
}, 30000);

beforeEach(() => {
  createRouterForTest({
    mode: "memory",
    routes: [
      { path: "/", name: "home", component: "test-home" },
      { path: "/button", name: "button", component: "test-button" },
      { path: "/basic/button", component: "test-button" }
    ]
  });
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));
const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

describe("路由跳转", () => {
  it("AppShell 侧边菜单默认展开分组导航", async () => {
    const app = document.createElement("elf-app");
    document.body.appendChild(app);
    await tick();
    await tick();
    await wait(20);

    const menu = app.shadowRoot?.querySelector("elf-menu");
    expect(menu).toBeTruthy();
    expect(menu?.shadowRoot?.textContent).toContain("Container 容器");
  });

  it("AppShell setup 早于 router 创建时，菜单点击仍能跳转", async () => {
    const { createRouter, setActiveRouter, getActiveRouter } = await import("@elfui/router");
    setActiveRouter(null);

    const app = document.createElement("elf-app");
    document.body.appendChild(app);
    await tick();
    await tick();

    const router = createRouter({
      mode: "memory",
      routes: [
        { path: "/", component: "test-home" },
        { path: "/basic/button", component: "test-button" }
      ]
    });

    const menu = app.shadowRoot?.querySelector("elf-menu");
    const button = Array.from(
      menu?.shadowRoot?.querySelectorAll<HTMLButtonElement>(".menu-item") ?? []
    ).find((node) => node.textContent?.includes("Button 按钮"));
    expect(button).toBeTruthy();
    button!.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, composed: true })
    );
    await tick();
    await tick();
    await wait(20);

    expect(getActiveRouter()).toBe(router);
    expect(router.current.peek().path).toBe("/basic/button");
  });

  it("router-view 渲染当前路由组件", async () => {
    const view = document.createElement("elf-router-view");
    document.body.appendChild(view);
    await tick();
    await tick();
    await wait(20);

    const child = view.querySelector("test-home");
    expect(child).toBeTruthy();
    expect(child!.shadowRoot!.textContent).toContain("HOME");
  });

  it("点击 elf-link 后 router-view 更新", async () => {
    const view = document.createElement("elf-router-view");
    const link = document.createElement("elf-link");
    link.setAttribute("to", "/button");
    link.textContent = "去按钮页";
    document.body.appendChild(view);
    document.body.appendChild(link);
    await tick();
    await tick();
    await wait(20);

    // 初始为 HOME（memory 模式默认 "/"）
    expect(view.querySelector("test-home")).toBeTruthy();

    // 模拟点击
    const a = link.querySelector("a") as HTMLAnchorElement;
    expect(a).toBeTruthy();
    a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    await tick();
    await tick();
    await wait(50);

    expect(view.querySelector("test-button")).toBeTruthy();
  });
});
