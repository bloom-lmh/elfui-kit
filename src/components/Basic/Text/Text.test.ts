import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Text } from "./index";

beforeAll(() => {
    registerComponents(Text);
});

afterEach(() => {
    document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 10));

interface TextEl extends HTMLElement {
    type?: string;
    size?: string;
    truncated?: boolean;
    lineClamp?: number | string;
    tag?: string;
    mark?: boolean;
    deleted?: boolean;
    inserted?: boolean;
    strong?: boolean;
    italic?: boolean;
}

describe("elf-text", () => {
    it("type 反射到 host", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.type = "success";
        document.body.appendChild(el);
        await tick();
        expect(el.getAttribute("type")).toBe("success");
    });

    it("非法 type 回退为空", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.type = "unknown";
        document.body.appendChild(el);
        await tick();
        expect(el.getAttribute("type")).toBe("");
    });

    it("size 反射到 host", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.size = "lg";
        document.body.appendChild(el);
        await tick();
        expect(el.getAttribute("size")).toBe("lg");
    });

    it("支持 Element Plus 标准 size 值", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.size = "large";
        document.body.appendChild(el);
        await tick();
        expect(el.getAttribute("size")).toBe("large");
    });

    it("truncated flag 反射到 host", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.truncated = true;
        document.body.appendChild(el);
        await tick();
        expect(el.hasAttribute("truncated")).toBe(true);
    });

    it("line-clamp CSS 变量", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.lineClamp = 3;
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_line-clamp")).toBe("3");
    });

    it("line-clamp 接受数字字符串并修正非法值", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.lineClamp = "2";
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_line-clamp")).toBe("2");

        el.lineClamp = "invalid";
        await tick();
        expect(el.style.getPropertyValue("--_line-clamp")).toBe("1");
    });

    it("mark flag 反射", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.mark = true;
        document.body.appendChild(el);
        await tick();
        expect(el.hasAttribute("mark")).toBe(true);
    });

    it("deleted flag 反射", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.deleted = true;
        document.body.appendChild(el);
        await tick();
        expect(el.hasAttribute("deleted")).toBe(true);
    });

    it("inserted flag 反射", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.inserted = true;
        document.body.appendChild(el);
        await tick();
        expect(el.hasAttribute("inserted")).toBe(true);
    });

    it("strong flag 反射", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.strong = true;
        document.body.appendChild(el);
        await tick();
        expect(el.hasAttribute("strong")).toBe(true);
    });

    it("italic flag 反射", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.italic = true;
        document.body.appendChild(el);
        await tick();
        expect(el.hasAttribute("italic")).toBe(true);
    });

    it("tag=span 渲染 span 元素", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.textContent = "text";
        document.body.appendChild(el);
        await tick();
        const inner = el.shadowRoot!.querySelector("span.text");
        expect(inner).toBeTruthy();
    });

    it("tag=p 渲染 p 元素", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.tag = "p";
        el.textContent = "text";
        document.body.appendChild(el);
        await tick();
        const inner = el.shadowRoot!.querySelector("p.text");
        expect(inner).toBeTruthy();
    });

    it("tag=strong 渲染 strong 元素", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.tag = "strong";
        el.textContent = "text";
        document.body.appendChild(el);
        await tick();
        const inner = el.shadowRoot!.querySelector("strong.text");
        expect(inner).toBeTruthy();
    });

    it("支持 sub、sup 与语义标题标签", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.tag = "sub";
        document.body.appendChild(el);
        await tick();
        expect(el.shadowRoot!.querySelector("sub.text")).toBeTruthy();

        el.tag = "h2";
        await tick();
        expect(el.shadowRoot!.querySelector("h2.text")).toBeTruthy();
        expect(el.getAttribute("tag")).toBe("h2");
    });

    it("非法 tag 回退 span", async () => {
        const el = document.createElement("elf-text") as TextEl;
        el.tag = "script";
        el.textContent = "text";
        document.body.appendChild(el);
        await tick();
        const inner = el.shadowRoot!.querySelector("span.text");
        expect(inner).toBeTruthy();
    });

    it("part=text 可被 ::part 选中", async () => {
        const el = document.createElement("elf-text") as TextEl;
        document.body.appendChild(el);
        await tick();
        const inner = el.shadowRoot!.querySelector("[part='text']");
        expect(inner).toBeTruthy();
    });
});
