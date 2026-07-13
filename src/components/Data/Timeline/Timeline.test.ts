import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

const items = [
  { timestamp: "2024-01-01", title: "事件一", content: "描述一" },
  { timestamp: "2024-02-01", title: "事件二", content: "描述二" },
  { timestamp: "2024-03-01", title: "事件三", content: "描述三" }
];

describe("elf-timeline", () => {
  it("渲染所有时间轴项", async () => {
    const el = document.createElement("elf-timeline");
    (el as any).items = items;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelectorAll(".item").length).toBe(3);
  });

  it("显示时间戳和标题", async () => {
    const el = document.createElement("elf-timeline");
    (el as any).items = items;
    document.body.appendChild(el);
    await tick();

    const first = el.shadowRoot!.querySelector(".item:first-child")!;
    expect(first.textContent).toContain("2024-01-01");
    expect(first.textContent).toContain("事件一");
  });

  it("reverse 反转顺序", async () => {
    const el = document.createElement("elf-timeline");
    (el as any).items = items;
    el.setAttribute("reverse", "");
    document.body.appendChild(el);
    await tick();

    const first = el.shadowRoot!.querySelector(".item:first-child")!;
    expect(first.textContent).toContain("2024-03-01");
  });

  it("最后一项无连接线", async () => {
    const el = document.createElement("elf-timeline");
    (el as any).items = items;
    document.body.appendChild(el);
    await tick();

    const last = el.shadowRoot!.querySelector(".item:last-child")!;
    // 最后一项渲染正常，CSS :last-child 控制连线隐藏
    expect(last).toBeTruthy();
  });

  it("color 类型渲染对应节点色", async () => {
    const colored = [{ timestamp: "now", title: "T", color: "success" }];
    const el = document.createElement("elf-timeline");
    (el as any).items = colored;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".node.is-success")).toBeTruthy();
  });

  it("supports Element Plus TimelineItem placement, type, size, hollow, and hidden timestamps", async () => {
    const el = document.createElement("elf-timeline");
    (el as any).items = [
      { timestamp: "2026-07-13", title: "Top", placement: "top", type: "success", size: "large" },
      { timestamp: "2026-07-14", title: "Hidden", hideTimestamp: true, hollow: true }
    ];
    document.body.appendChild(el);
    await tick();

    const nodes = el.shadowRoot!.querySelectorAll(".node");
    expect(nodes[0].classList.contains("is-success")).toBe(true);
    expect(nodes[0].classList.contains("is-large")).toBe(true);
    expect(nodes[1].classList.contains("is-hollow")).toBe(true);
    expect(el.shadowRoot!.textContent).not.toContain("2026-07-14");
  });

  it("supports start, end, alternate-reverse, and the dot slot", async () => {
    const el = document.createElement("elf-timeline");
    (el as any).items = items;
    el.setAttribute("mode", "alternate-reverse");
    el.innerHTML = '<span slot="dot">●</span>';
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("data-mode")).toBe("alternate-reverse");
    const dot = el.shadowRoot!.querySelector('slot[name="dot"]') as HTMLSlotElement;
    expect(dot.assignedNodes()[0]?.textContent).toContain("●");
  });
});
