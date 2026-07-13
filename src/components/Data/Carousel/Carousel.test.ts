import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-carousel", () => {
  it("renders the default height and navigation arrows", async () => {
    const el = document.createElement("elf-carousel");
    el.innerHTML = "<div>A</div><div>B</div>";
    document.body.appendChild(el);
    await tick();

    const root = el.shadowRoot!;
    expect((root.querySelector(".carousel") as HTMLElement).style.height).toBe("320px");
    expect(root.querySelector(".arrow-left")).toBeTruthy();
    expect(root.querySelector(".arrow-right")).toBeTruthy();
  });

  it("keeps a fade track untransformed", async () => {
    const el = document.createElement("elf-carousel");
    el.setAttribute("effect", "fade");
    document.body.appendChild(el);
    await tick();

    expect((el.shadowRoot!.querySelector(".track") as HTMLElement).style.transform).toBeFalsy();
  });

  it("applies initial-index and exposes imperative navigation", async () => {
    const el = document.createElement("elf-carousel") as HTMLElement & {
      activeIndex: number;
      next: () => void;
      setActiveItem: (item: number | string) => void;
    };
    el.setAttribute("autoplay", "false");
    el.setAttribute("initial-index", "1");
    el.innerHTML = '<div label="first">A</div><div label="second">B</div><div label="third">C</div>';
    document.body.appendChild(el);
    await tick();

    expect(el.activeIndex).toBe(1);
    el.next();
    expect(el.activeIndex).toBe(2);
    el.setActiveItem("first");
    expect(el.activeIndex).toBe(0);
  });

  it("honors click indicator trigger and vertical keyboard navigation", async () => {
    const el = document.createElement("elf-carousel");
    el.setAttribute("autoplay", "false");
    el.setAttribute("trigger", "click");
    el.setAttribute("direction", "vertical");
    el.innerHTML = "<div>A</div><div>B</div><div>C</div>";
    document.body.appendChild(el);
    await tick();

    const root = el.shadowRoot!.querySelector(".carousel") as HTMLElement;
    const dots = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".dot");
    dots[2].click();
    await tick();
    expect((el.shadowRoot!.querySelector(".track") as HTMLElement).style.transform).toBe("translateY(-200%)");

    root.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    await tick();
    expect((el.shadowRoot!.querySelector(".track") as HTMLElement).style.transform).toBe("translateY(-100%)");
  });

  it("hides arrows and indicators when visibility props request it", async () => {
    const el = document.createElement("elf-carousel");
    el.setAttribute("arrow", "never");
    el.setAttribute("indicator-position", "none");
    el.innerHTML = "<div>A</div><div>B</div>";
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".arrows")).toBeNull();
    expect(el.shadowRoot!.querySelector(".indicators")).toBeNull();
  });

  it("emits only for a real transition and not at a non-looping boundary", async () => {
    const el = document.createElement("elf-carousel");
    let changes = 0;
    el.addEventListener("change", () => changes++);
    el.setAttribute("autoplay", "false");
    el.setAttribute("loop", "false");
    el.setAttribute("initial-index", "1");
    el.innerHTML = "<div>A</div><div>B</div>";
    document.body.appendChild(el);
    await tick();

    (el.shadowRoot!.querySelector(".arrow-right") as HTMLButtonElement).click();
    expect(changes).toBe(0);
    (el.shadowRoot!.querySelector(".arrow-left") as HTMLButtonElement).click();
    expect(changes).toBe(1);
  });
});
