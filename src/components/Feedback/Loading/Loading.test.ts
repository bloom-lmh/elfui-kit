import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Loading } from "./index";

beforeAll(() => {
  registerComponents(Loading);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface LoadingEl extends HTMLElement {
  text?: string;
  loading?: boolean;
  fullscreen?: boolean;
  closable?: boolean;
}

describe("elf-loading", () => {
  it("renders overlay text", async () => {
    const el = document.createElement("elf-loading") as LoadingEl;
    el.text = "Loading";
    el.loading = true;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".overlay")).toBeTruthy();
    expect(el.shadowRoot!.textContent).toContain("Loading");
  });

  it("does not block its content until loading is explicitly enabled", async () => {
    const el = document.createElement("elf-loading") as LoadingEl;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".overlay")).toBeNull();
  });

  it("全屏加载提供可见退出按钮并发出受控更新", async () => {
    const el = document.createElement("elf-loading") as LoadingEl;
    el.loading = true;
    el.fullscreen = true;
    el.closable = true;
    document.body.appendChild(el);
    await tick();

    let nextLoading: unknown = true;
    let closed = 0;
    el.addEventListener("update:loading", (event) => {
      nextLoading = (event as CustomEvent).detail;
      el.loading = Boolean(nextLoading);
    });
    el.addEventListener("close", () => closed++);

    const button = el.shadowRoot!.querySelector<HTMLButtonElement>(".close")!;
    expect(button.textContent).toContain("退出全屏加载");
    button.click();

    expect(nextLoading).toBe(false);
    expect(closed).toBe(1);
    await tick();
    expect(el.shadowRoot!.querySelector(".overlay")).toBeNull();
  });
});
