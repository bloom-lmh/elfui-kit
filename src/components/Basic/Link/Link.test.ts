import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { registerComponents } from "elfui";

import { Link } from "./index";

beforeAll(() => {
    registerComponents(Link);
});

afterEach(() => {
    document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 10));

interface LinkEl extends HTMLElement {
    type?: string;
    href?: string;
    target?: string;
    disabled?: boolean;
    underline?: boolean;
    icon?: string;
}

const mount = async (patch: Partial<LinkEl> = {}): Promise<LinkEl> => {
    const el = document.createElement("elf-link") as LinkEl;
    el.textContent = "Docs";
    Object.assign(el, patch);
    document.body.appendChild(el);
    await tick();
    return el;
};

describe("elf-link", () => {
    it("渲染 href 和 type", async () => {
        const el = await mount({ type: "primary", href: "/docs" });
        const anchor = el.shadowRoot!.querySelector("a")!;

        expect(el.getAttribute("type")).toBe("primary");
        expect(anchor.getAttribute("href")).toBe("/docs");
        expect(anchor.getAttribute("part")).toBe("link");
    });

    it("disabled 时阻止 click 且移除 href", async () => {
        const el = await mount({ disabled: true, href: "/docs" });
        const onClick = vi.fn();
        el.addEventListener("click", onClick);

        el.shadowRoot!.querySelector("a")!.click();

        expect(onClick).not.toHaveBeenCalled();
        expect(el.shadowRoot!.querySelector("a")!.getAttribute("href")).toBeNull();
    });

    it("enabled 时 click 正常冒泡", async () => {
        const el = await mount({ href: "/docs" });
        const onClick = vi.fn();
        el.addEventListener("click", onClick);

        el.shadowRoot!.querySelector("a")!.click();

        expect(onClick).toHaveBeenCalled();
    });

    it("disabled 时 aria-disabled=true", async () => {
        const el = await mount({ disabled: true });
        const anchor = el.shadowRoot!.querySelector("a")!;
        expect(anchor.getAttribute("aria-disabled")).toBe("true");
    });

    it("enabled 时 aria-disabled 为 null", async () => {
        const el = await mount();
        const anchor = el.shadowRoot!.querySelector("a")!;
        expect(anchor.getAttribute("aria-disabled")).toBeNull();
    });

    it("disabled 时 host flag 反射", async () => {
        const el = await mount({ disabled: true });
        expect(el.hasAttribute("disabled")).toBe(true);
    });

    it("target 透传到 a[target]", async () => {
        const el = await mount({ href: "/docs", target: "_blank" });
        const anchor = el.shadowRoot!.querySelector("a")!;
        expect(anchor.getAttribute("target")).toBe("_blank");
    });

    it("disabled 时 target 也不透传", async () => {
        const el = await mount({ disabled: true, target: "_blank" });
        const anchor = el.shadowRoot!.querySelector("a")!;
        expect(anchor.getAttribute("target")).toBeNull();
    });

    it("underline=false 时 a[data-underline='false']", async () => {
        const el = await mount({ underline: false });
        const anchor = el.shadowRoot!.querySelector("a")!;
        expect(anchor.getAttribute("data-underline")).toBe("false");
    });

    it("默认 underline=true 时 a[data-underline='true']", async () => {
        const el = await mount();
        const anchor = el.shadowRoot!.querySelector("a")!;
        expect(anchor.getAttribute("data-underline")).toBe("true");
    });

    it("type 各语义色反射到 host", async () => {
        for (const type of ["primary", "success", "warning", "danger", "info"] as const) {
            const el = await mount({ type });
            expect(el.getAttribute("type")).toBe(type);
            document.body.innerHTML = "";
        }
    });

    it("非法 type 回退为 default", async () => {
        const el = await mount({ type: "secondary" as unknown as string });
        expect(el.getAttribute("type")).toBe("default");
    });

    it("icon 属性渲染 prop-icon", async () => {
        const el = await mount({ icon: "↗" });
        const iconSpan = el.shadowRoot!.querySelector(".prop-icon");
        expect(iconSpan).toBeTruthy();
        expect(iconSpan!.textContent).toBe("↗");
    });

    // icon slot 优先级验证依赖浏览器 slot 指派，happy-dom 限制无法测试
    it("icon 属性渲染到 shadow DOM", async () => {
        const el = await mount({ icon: "↗" });
        const shadowText = el.shadowRoot!.textContent ?? "";
        expect(shadowText).toContain("↗");
    });
});
