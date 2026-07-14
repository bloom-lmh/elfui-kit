import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { StepItem } from "./types";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface StepsEl extends HTMLElement {
  active?: number;
  direction?: string;
  items?: StepItem[];
  space?: string | number;
  processStatus?: string;
  finishStatus?: string;
  alignCenter?: boolean;
  simple?: boolean;
  size?: string;
  clickable?: boolean;
  alternativeLabel?: boolean;
  next?: () => void;
  prev?: () => void;
  setActive?: (index: number) => void;
}

const items: StepItem[] = [
  { title: "账号", description: "填写账号" },
  { title: "验证", description: "验证身份" },
  { title: "完成", description: "创建成功" }
];

const mount = async (patch: Partial<StepsEl> = {}): Promise<StepsEl> => {
  const el = document.createElement("elf-steps") as StepsEl;
  Object.assign(el, { items, active: 1, ...patch });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-steps", () => {
  it("根据 active 推断完成、当前和等待状态", async () => {
    const el = await mount();

    const nodes = Array.from(el.shadowRoot!.querySelectorAll(".step-item"));
    expect(nodes[0]!.className).toContain("is-finish");
    expect(nodes[1]!.className).toContain("is-process");
    expect(nodes[2]!.className).toContain("is-wait");
  });

  it("点击步骤触发受控 active 更新事件", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:active", onUpdate as EventListener);
    el.addEventListener("change", onChange as EventListener);

    (el.shadowRoot!.querySelectorAll(".step-button")[2] as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(2);
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      active: 2,
      item: items[2]
    });
    expect(el.shadowRoot!.querySelectorAll(".step-item")[2]!.className).toContain("is-active");
  });

  it("supports process-status and finish-status inference", async () => {
    const el = await mount({ processStatus: "error", finishStatus: "wait" });

    const nodes = Array.from(el.shadowRoot!.querySelectorAll(".step-item"));
    expect(nodes[0]!.className).toContain("is-wait");
    expect(nodes[1]!.className).toContain("is-error");
    expect(nodes[2]!.className).toContain("is-wait");
  });

  it("supports space, align-center and simple styles", async () => {
    const el = await mount({ space: 160, alignCenter: true, simple: true });
    const root = el.shadowRoot!.querySelector(".steps") as HTMLElement;

    expect(root.className).toContain("has-space");
    expect(root.className).toContain("is-align-center");
    expect(root.className).toContain("is-simple");
    expect(root.getAttribute("style")).toContain("--step-space: 160px");
  });

  it("disabled 步骤不可点击", async () => {
    const el = await mount({
      items: [items[0]!, { ...items[1]!, disabled: true }, items[2]!],
      active: 0
    });
    const onUpdate = vi.fn();
    el.addEventListener("update:active", onUpdate as EventListener);

    (el.shadowRoot!.querySelectorAll(".step-button")[1] as HTMLElement).click();
    await tick();

    expect(onUpdate).not.toHaveBeenCalled();
    expect(el.shadowRoot!.querySelectorAll(".step-item")[1]!.className).toContain("is-disabled");
  });

  it("支持垂直、尺寸和公开控制方法", async () => {
    const el = await mount({ direction: "vertical", size: "lg" });
    const onUpdate = vi.fn();
    el.addEventListener("update:active", onUpdate as EventListener);

    expect(el.shadowRoot!.querySelector(".steps")!.className).toContain("is-vertical");
    expect(el.shadowRoot!.querySelector(".steps")!.className).toContain("size-lg");

    el.next!();
    await tick();
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(2);

    el.setActive!(0);
    await tick();
    expect((onUpdate.mock.calls[1]![0] as CustomEvent).detail).toBe(0);
  });
});
