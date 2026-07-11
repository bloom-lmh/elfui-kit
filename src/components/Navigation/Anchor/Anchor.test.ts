import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  history.replaceState(null, "", "/");
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AnchorEl extends HTMLElement {
  items?: unknown[];
  modelValue?: string;
  defaultActive?: string;
  container?: string | HTMLElement;
  offset?: number;
  bound?: number;
  bounds?: number;
  marker?: boolean;
  type?: string;
  direction?: string;
  duration?: number;
  smooth?: boolean;
  props?: Record<string, string>;
  scrollTo?: (href: string) => void;
  scrollToAnchor?: (href: string) => void;
}

const sections = ["intro", "usage", "api"];

const installSections = (): void => {
  for (const [index, id] of sections.entries()) {
    const section = document.createElement("section");
    section.id = id;
    section.getBoundingClientRect = vi.fn(() => ({
      top: index * 160 - window.scrollY,
      left: 0,
      right: 100,
      bottom: index * 160 - window.scrollY + 80,
      width: 100,
      height: 80,
      x: 0,
      y: index * 160 - window.scrollY,
      toJSON: () => ({})
    })) as unknown as Element["getBoundingClientRect"];
    document.body.appendChild(section);
  }
};

const mount = async (patch: Partial<AnchorEl> = {}): Promise<AnchorEl> => {
  installSections();
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: patch.offset ? 10 : 0,
    writable: true
  });
  vi.spyOn(window, "scrollTo").mockImplementation((options?: ScrollToOptions | number) => {
    if (typeof options === "object" && options) {
      Object.defineProperty(window, "scrollY", {
        configurable: true,
        value: Number(options.top || 0),
        writable: true
      });
    }
  });

  const el = document.createElement("elf-anchor") as AnchorEl;
  Object.assign(el, {
    items: [
      { title: "Intro", href: "#intro" },
      { title: "Usage", href: "#usage" },
      { title: "API", href: "#api", disabled: true }
    ],
    smooth: false,
    ...patch
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const activeText = (el: AnchorEl): string =>
  el.shadowRoot!.querySelector(".item.is-active")?.textContent?.trim() || "";

describe("elf-anchor", () => {
  it("renders anchor items and activates the first reachable target", async () => {
    const el = await mount();

    expect(el.shadowRoot!.querySelectorAll(".item")).toHaveLength(3);
    expect(activeText(el)).toContain("Intro");
  });

  it("clicks an item, emits events and scrolls to the target", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const onClick = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    el.addEventListener("change", onChange as unknown as EventListener);
    el.addEventListener("click", onClick as unknown as EventListener);

    (el.shadowRoot!.querySelectorAll(".link")[1] as HTMLElement).click();
    await tick();
    await tick();

    expect(activeText(el)).toContain("Usage");
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("#usage");
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      href: "#usage",
      oldHref: "#intro"
    });
    expect((onClick.mock.calls[0]![0] as CustomEvent).detail.href).toBe("#usage");
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 160, behavior: "auto" });
  });

  it("updates the active item while the page scrolls", async () => {
    const el = await mount({ bounds: 8 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 170, writable: true });

    window.dispatchEvent(new Event("scroll"));
    await tick();
    await tick();

    expect(activeText(el)).toContain("Usage");
  });

  it("supports custom field names", async () => {
    const el = await mount({
      props: { title: "label", href: "to", disabled: "locked", children: "nodes" },
      items: [
        { label: "Guide", to: "#intro" },
        {
          label: "Reference",
          to: "#usage",
          nodes: [{ label: "Disabled", to: "#api", locked: true }]
        }
      ]
    });

    expect(el.shadowRoot!.textContent).toContain("Guide");
    expect(el.shadowRoot!.textContent).toContain("Reference");
    expect(el.shadowRoot!.querySelectorAll(".item")).toHaveLength(3);
  });

  it("does not activate disabled items", async () => {
    const el = await mount();

    (el.shadowRoot!.querySelectorAll(".link")[2] as HTMLElement).click();
    await tick();

    expect(activeText(el)).toContain("Intro");
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("supports bound alias, direction, type, marker and scrollTo expose", async () => {
    const el = await mount({
      bound: 20,
      direction: "horizontal",
      type: "underline",
      marker: false,
      duration: 0
    });

    expect(el.shadowRoot!.querySelector(".anchor.is-horizontal.is-underline")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".track")).toBeNull();

    Object.defineProperty(window, "scrollY", { configurable: true, value: 145, writable: true });
    window.dispatchEvent(new Event("scroll"));
    await tick();
    expect(activeText(el)).toContain("Usage");

    el.scrollTo!("#usage");
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 160, behavior: "auto" });
  });
});
