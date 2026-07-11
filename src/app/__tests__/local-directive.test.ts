// 组件级（局部）自定义指令验证

import { compile } from "@elfui/compiler";
import { setTemplateCompiler, type RenderFn } from "@elfui/chain";
import { defineComponent, directive } from "elfui";
import { afterEach, describe, expect, it, vi } from "vitest";

setTemplateCompiler((template) => compile(template) as unknown as RenderFn);

afterEach(() => {
  document.body.innerHTML = "";
});

let id = 0;
const next = (): string => `elf-test-local-dir-${++id}`;

describe("组件级自定义指令（builder.directive）", () => {
  it("仅组件内可见，不污染全局", () => {
    const tag = next();
    const mounted = vi.fn();

    defineComponent({
      name: tag,
      directives: {
        "local-only": {
          mounted: (el: HTMLElement) => {
            mounted(el.tagName.toLowerCase());
          }
        }
      },
      template: `<button v-local-only>x</button>`
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);

    return new Promise<void>((resolve) => {
      queueMicrotask(() => {
        expect(mounted).toHaveBeenCalledWith("button");
        // 全局没注册过该指令
        resolve();
      });
    });
  });

  it("局部指令优先于同名全局指令", () => {
    const tag = next();
    const localFn = vi.fn();
    const globalFn = vi.fn();

    // 全局
    directive("dual", { mounted: globalFn });

    defineComponent({
      name: tag,
      directives: {
        dual: { mounted: localFn }
      },
      template: `<button v-dual>x</button>`
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);

    return new Promise<void>((resolve) => {
      queueMicrotask(() => {
        expect(localFn).toHaveBeenCalledTimes(1);
        // 全局没被调用
        expect(globalFn).not.toHaveBeenCalled();
        resolve();
      });
    });
  });
});
