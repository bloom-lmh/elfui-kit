import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { TourStep } from "./types";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

interface TourEl extends HTMLElement {
  steps?: TourStep[];
  visible?: boolean;
  current?: number;
  next?: () => void;
  prev?: () => void;
  close?: () => void;
}

const steps: TourStep[] = [
  { target: "#tour-target-one", title: "第一步", content: "说明一", placement: "bottom" },
  { target: "#tour-target-two", title: "第二步", content: "说明二", placement: "right" }
];

const createTarget = (id: string, left: number): HTMLElement => {
  const target = document.createElement("button");
  target.id = id;
  target.textContent = id;
  target.getBoundingClientRect = () =>
    ({
      left,
      top: 80,
      width: 120,
      height: 40,
      right: left + 120,
      bottom: 120,
      x: left,
      y: 80,
      toJSON: () => ({})
    }) as DOMRect;
  document.body.appendChild(target);
  return target;
};

const mount = async (patch: Partial<TourEl> = {}): Promise<TourEl> => {
  createTarget("tour-target-one", 40);
  createTarget("tour-target-two", 220);
  const el = document.createElement("elf-tour") as TourEl;
  Object.assign(el, { steps, visible: true, current: 0, ...patch });
  document.body.appendChild(el);
  await tick();
  await frame();
  await tick();
  return el;
};

describe("elf-tour", () => {
  it("显示遮罩、高亮和当前步骤内容", async () => {
    await mount();

    expect(document.body.querySelector(".tour-layer")).toBeTruthy();
    expect(document.body.querySelector(".tour-highlight")).toBeTruthy();
    expect(document.body.querySelector(".tour-backdrop")).toBeNull();
    expect(document.body.querySelector(".tour-title")?.textContent).toContain("第一步");
    expect(document.body.querySelector(".tour-close svg")).toBeTruthy();
  });

  it("目标不存在时仍显示安全遮罩和居中引导面板", async () => {
    await mount({
      steps: [{ target: "#missing-target", title: "备用引导", content: "目标暂不可用" }]
    });

    expect(document.body.querySelector(".tour-highlight")).toBeNull();
    expect(document.body.querySelector(".tour-backdrop")).toBeTruthy();
    expect(document.body.querySelector(".tour-title")?.textContent).toContain("备用引导");
  });

  it("目标靠近视口底部时自动向上翻转，操作区保持在视口内", async () => {
    const el = await mount();
    const target = document.querySelector("#tour-target-one") as HTMLElement;
    target.getBoundingClientRect = () =>
      ({
        left: 80,
        top: window.innerHeight - 50,
        width: 120,
        height: 40,
        right: 200,
        bottom: window.innerHeight - 10,
        x: 80,
        y: window.innerHeight - 50,
        toJSON: () => ({})
      }) as DOMRect;

    window.dispatchEvent(new Event("resize"));
    await frame();
    await tick();

    const panel = document.body.querySelector<HTMLElement>(".tour-panel")!;
    expect(panel.style.transform).toBe("translate(-50%, -100%)");
    expect(el.visible).toBe(true);
  });

  it("next/prev 更新 current 并触发 change", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:current", onUpdate as EventListener);
    el.addEventListener("change", onChange as EventListener);

    el.next!();
    await tick();
    await frame();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(1);
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      current: 1,
      step: steps[1]
    });
    expect(document.body.querySelector(".tour-title")?.textContent).toContain("第二步");

    el.prev!();
    await tick();
    expect((onUpdate.mock.calls[1]![0] as CustomEvent).detail).toBe(0);
  });

  it("键盘方向键和完成按钮可驱动流程", async () => {
    const el = await mount();
    const onFinish = vi.fn();
    el.addEventListener("finish", onFinish);

    document.body
      .querySelector(".tour-layer")!
      .dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();
    expect(document.body.querySelector(".tour-title")?.textContent).toContain("第二步");

    (
      document.body.querySelector(".tour-footer .tour-button--primary") as HTMLElement
    ).click();
    await tick();
    expect(onFinish).toHaveBeenCalledTimes(1);
    await wait(190);
    expect(document.body.querySelector(".tour-layer")).toBeNull();
  });

  it("visible 变更会关闭并触发 close", async () => {
    const el = await mount();
    const onClose = vi.fn();
    el.addEventListener("close", onClose);

    el.visible = false;
    await tick();
    await wait(190);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.body.querySelector(".tour-layer")).toBeNull();
  });
});
