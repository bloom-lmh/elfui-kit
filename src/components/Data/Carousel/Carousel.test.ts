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

  it("uses CarouselItem labels and names for imperative navigation", async () => {
    const el = document.createElement("elf-carousel") as HTMLElement & {
      activeIndex: number;
      setActiveItem: (item: number | string) => void;
    };
    el.setAttribute("autoplay", "false");
    el.innerHTML = `
      <elf-carousel-item name="welcome" label="Welcome">A</elf-carousel-item>
      <elf-carousel-item name="plans" label="Plans">B</elf-carousel-item>
    `;
    document.body.appendChild(el);
    await tick();

    const items = el.querySelectorAll<HTMLElement>("elf-carousel-item");
    expect(items[0].shadowRoot!.querySelector("[role=group]")?.getAttribute("aria-label")).toBe("Welcome 1 of 2");
    expect(items[0].hasAttribute("active")).toBe(true);
    expect(items[1].getAttribute("aria-hidden")).toBe("true");

    el.setActiveItem("plans");
    await tick();
    expect(el.activeIndex).toBe(1);
    expect(items[1].hasAttribute("active")).toBe(true);
    expect(items[1].shadowRoot!.querySelector("[role=group]")?.getAttribute("aria-roledescription")).toBe("slide");
    expect(items[1].shadowRoot!.querySelector(".carousel-item__label")?.textContent).toBe("Plans");
  });

  it("preserves a CarouselItem custom accessible label", async () => {
    const el = document.createElement("elf-carousel");
    el.setAttribute("autoplay", "false");
    el.innerHTML = '<elf-carousel-item label="Decorative" aria-label="Featured announcement">A</elf-carousel-item>';
    document.body.appendChild(el);
    await tick();

    expect(el.querySelector("elf-carousel-item")!.shadowRoot!.querySelector("[role=group]")?.getAttribute("aria-label")).toBe(
      "Featured announcement"
    );
  });

  it("enables card layout only for direct CarouselItem children", async () => {
    const el = document.createElement("elf-carousel") as HTMLElement & { next: () => void };
    el.setAttribute("type", "card");
    el.setAttribute("autoplay", "false");
    el.innerHTML = "<elf-carousel-item>A</elf-carousel-item><elf-carousel-item>B</elf-carousel-item>";
    document.body.appendChild(el);
    await tick();

    const items = el.querySelectorAll<HTMLElement>("elf-carousel-item");
    expect(items[0].style.getPropertyValue("--_card-offset")).toBe("0");
    expect(items[1].style.getPropertyValue("--_card-offset")).toBe("1");
    expect((el.shadowRoot!.querySelector(".track") as HTMLElement).style.transform).toBeFalsy();

    el.next();
    await tick();
    expect(items[0].style.getPropertyValue("--_card-offset")).toBe("-1");
    expect(items[1].style.getPropertyValue("--_card-offset")).toBe("0");

    const fallback = document.createElement("elf-carousel");
    fallback.setAttribute("type", "card");
    fallback.setAttribute("autoplay", "false");
    fallback.innerHTML = "<div>A</div><div>B</div>";
    document.body.appendChild(fallback);
    await tick();
    expect((fallback.querySelector("div") as HTMLElement).style.getPropertyValue("--_card-offset")).toBe("");
  });
});
