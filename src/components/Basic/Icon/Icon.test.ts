import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Icon } from "./index";

beforeAll(() => {
    registerComponents(Icon);
});

afterEach(() => {
    document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 10));

interface IconEl extends HTMLElement {
    name?: string;
    size?: number | string;
    color?: string;
    ariaLabel?: string;
    loading?: boolean;
}

describe("elf-icon", () => {
    it("name 渲染为文本内容", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "A";
        document.body.appendChild(el);
        await tick();
        expect(el.shadowRoot!.textContent).toContain("A");
    });

    it("size 数值映射为 px CSS 变量", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        el.size = 24;
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-size")).toBe("24px");
    });

    it("size 纯数字字符串自动补 px", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        el.size = "14";
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-size")).toBe("14px");
    });

    it("size 字符串直接透传 CSS 变量", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        el.size = "2em";
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-size")).toBe("2em");
    });

    it("color 映射为 CSS 变量", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        el.color = "red";
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-color")).toBe("red");
    });

    it("无 color 时 CSS 变量为 currentColor", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-color")).toBe("currentColor");
    });

    it("默认 size CSS 变量为 1em", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-size")).toBe("1em");
    });

    it("aria-label 为空时 aria-hidden=true", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        document.body.appendChild(el);
        await tick();
        const span = el.shadowRoot!.querySelector("span")!;
        expect(span.getAttribute("aria-hidden")).toBe("true");
        expect(span.getAttribute("role")).toBeNull();
    });

    it("aria-label 有值时 role=img", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        el.ariaLabel = "star icon";
        document.body.appendChild(el);
        await tick();
        const span = el.shadowRoot!.querySelector("span")!;
        expect(span.getAttribute("aria-label")).toBe("star icon");
        expect(span.getAttribute("aria-hidden")).toBe("false");
        expect(span.getAttribute("role")).toBe("img");
    });

    it("name 为空时 slot 元素存在", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        document.body.appendChild(el);
        await tick();
        const slot = el.shadowRoot!.querySelector("slot");
        expect(slot).toBeTruthy();
    });

    it("part=icon 可被 ::part 选中", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        document.body.appendChild(el);
        await tick();
        const span = el.shadowRoot!.querySelector("[part='icon']");
        expect(span).toBeTruthy();
    });

    it("数值 size 不小于 1px", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.size = 0;
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-size")).toBe("1px");
    });

    it("loading 为内部图标添加旋转状态类", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.loading = true;
        document.body.appendChild(el);
        await tick();
        expect(el.shadowRoot!.querySelector(".icon")?.classList.contains("is-loading")).toBe(true);
    });
});
