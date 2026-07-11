// elf-carousel 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-carousel", () => {
  it("渲染箭头", async () => {
    const el = document.createElement("elf-carousel");
    el.innerHTML = "<div>A</div><div>B</div>";
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".arrow-left")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".arrow-right")).toBeTruthy();
  });

  it("默认高度 320px", async () => {
    const el = document.createElement("elf-carousel");
    document.body.appendChild(el);
    await tick();

    const carousel = el.shadowRoot!.querySelector(".carousel") as HTMLElement;
    expect(carousel.style.height).toBe("320px");
  });

  it("effect=fade 时 track 无 transform", async () => {
    const el = document.createElement("elf-carousel");
    el.setAttribute("effect", "fade");
    document.body.appendChild(el);
    await tick();

    const track = el.shadowRoot!.querySelector(".track") as HTMLElement;
    expect(track.style.transform).toBeFalsy();
  });

  it("autoplay=false 不自动播放", async () => {
    const el = document.createElement("elf-carousel");
    el.setAttribute("autoplay", "false");
    el.innerHTML = "<div>A</div><div>B</div>";
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("autoplay")).toBe("false");
  });
});
