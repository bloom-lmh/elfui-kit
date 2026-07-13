// elf-alert 测试

import { compile } from "@elfui/compiler";
import { defineComponent, setTemplateCompiler, useRef, type RenderFn } from "@elfui/chain";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
    setTemplateCompiler((template) => compile(template) as unknown as RenderFn);
    await import("../../../components/Feedback/Alert/index");
});

afterEach(() => {
    document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 20));
const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

type AlertEl = HTMLElement & {
    type?: string;
    variant?: string;
    title?: string;
    description?: string;
    closable?: boolean;
    closeText?: string;
    showIcon?: boolean;
    center?: boolean;
    density?: string;
    prominent?: boolean;
};

const mount = async (template: string): Promise<AlertEl> => {
    defineComponent({
        name: "test-alert-wrap",
        setup: () => ({}),
        template,
    });
    const wrap = document.createElement("test-alert-wrap");
    document.body.appendChild(wrap);
    await tick();
    return wrap.shadowRoot!.querySelector("elf-alert") as AlertEl;
};

describe("elf-alert", () => {
    it("基础渲染 title + description", async () => {
        const el = await mount(`
            <elf-alert type="success" title="操作成功" description="数据已保存"></elf-alert>
        `);
        expect(el).toBeTruthy();
        expect(el.getAttribute("title")).toBe("操作成功");
    });

    it("type 反射到 host", async () => {
        const el = await mount(`<elf-alert type="success" title="ok"></elf-alert>`);
        expect(el.getAttribute("type")).toBe("success");
    });

    it("variant=tonal 有 border", async () => {
        const el = await mount(`<elf-alert variant="tonal" type="info" title="test"></elf-alert>`);
        const alertDiv = el.shadowRoot!.querySelector(".alert") as HTMLElement;
        const style = getComputedStyle(alertDiv);
        expect(style.borderLeftWidth).not.toBe("0px");
    });

    it("variant=outlined", async () => {
        const el = await mount(`<elf-alert variant="outlined" type="success" title="test"></elf-alert>`);
        const alertDiv = el.shadowRoot!.querySelector(".alert") as HTMLElement;
        const style = getComputedStyle(alertDiv);
        expect(style.borderWidth).not.toBe("0px");
    });

    it("variant=plain 透明背景", async () => {
        const el = await mount(`<elf-alert variant="plain" type="info" title="test"></elf-alert>`);
        const alertDiv = el.shadowRoot!.querySelector(".alert") as HTMLElement;
        const style = getComputedStyle(alertDiv);
        expect(style.backgroundColor).toBe("rgba(0, 0, 0, 0)");
    });

    it("variant=filled 非透明背景", async () => {
        const el = await mount(`<elf-alert variant="filled" type="danger" title="test"></elf-alert>`);
        const alertDiv = el.shadowRoot!.querySelector(".alert") as HTMLElement;
        const style = getComputedStyle(alertDiv);
        expect(style.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    });

    it("closable 显示关闭按钮，点击 emit close", async () => {
        const el = await mount(`<elf-alert closable title="可关闭"></elf-alert>`);
        let closed = false;
        el.addEventListener("close", () => { closed = true; });

        const btn = el.shadowRoot!.querySelector(".close") as HTMLButtonElement;
        expect(btn).toBeTruthy();
        btn.click();
        await tick();
        expect(closed).toBe(true);
    });

    it("关闭后 data-closed flag", async () => {
        const el = await mount(`<elf-alert closable title="test"></elf-alert>`);
        const btn = el.shadowRoot!.querySelector(".close") as HTMLButtonElement;
        btn.click();
        await wait(300);
        expect(el.getAttribute("data-closed")).toBe("");
    });

    it("close-text 显示文字", async () => {
        defineComponent({
            name: "test-alert-close-text",
            setup: () => { const t = useRef("关闭"); return { t }; },
            template: `<elf-alert closable :close-text="t" title="提示"></elf-alert>`,
        });
        const wrap = document.createElement("test-alert-close-text");
        document.body.appendChild(wrap);
        await tick();

        const el = wrap.shadowRoot!.querySelector("elf-alert") as AlertEl;
        const btn = el.shadowRoot!.querySelector(".close") as HTMLButtonElement;
        expect(btn.textContent).toContain("关闭");
    });

    it("show-icon=false 隐藏图标", async () => {
        const el = await mount(`<elf-alert title="test" :show-icon="false"></elf-alert>`);
        expect(el.shadowRoot!.querySelector(".icon")).toBeNull();
    });

    it("center host attribute", async () => {
        const el = await mount(`<elf-alert center title="居中"></elf-alert>`);
        expect(el.getAttribute("center")).toBe("");
    });

    it("density=compact 反射", async () => {
        const el = await mount(`<elf-alert density="compact" title="紧凑"></elf-alert>`);
        expect(el.getAttribute("density")).toBe("compact");
    });

    it("prominent 反射", async () => {
        const el = await mount(`<elf-alert prominent title="粗色条"></elf-alert>`);
        expect(el.getAttribute("prominent")).toBe("");
    });

    it("icon slot 自定义图标", async () => {
        defineComponent({
            name: "test-alert-icon-slot",
            setup: () => ({}),
            template: `<elf-alert type="success" title="自定义图标"><span slot="icon">★</span></elf-alert>`,
        });
        const wrap = document.createElement("test-alert-icon-slot");
        document.body.appendChild(wrap);
        await tick();

        const el = wrap.shadowRoot!.querySelector("elf-alert") as AlertEl;
        const text = el.shadowRoot!.textContent ?? "";
        expect(text).toContain("★");
    });

    it("title slot 自定义标题", async () => {
        defineComponent({
            name: "test-alert-title-slot",
            setup: () => ({}),
            template: `<elf-alert type="info"><strong slot="title">自定义标题</strong></elf-alert>`,
        });
        const wrap = document.createElement("test-alert-title-slot");
        document.body.appendChild(wrap);
        await tick();

        const el = wrap.shadowRoot!.querySelector("elf-alert") as AlertEl;
        const text = el.shadowRoot!.textContent ?? "";
        expect(text).toContain("自定义标题");
    });
});
