// 组件级（局部）自定义指令验证

import { directive, type DirectiveDefinition } from "@elfui/runtime";
import { resolveDirective } from "@elfui/runtime/internal";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { localDualCalls, TestDualDirective } from "./dual-directive-fixture";
import { localOnlyCalls, TestLocalDirective } from "./local-only-directive-fixture";

const globalDualCalls: string[] = [];
let removeGlobalDual = (): void => {};

const localDirectives = (component: unknown): Record<string, DirectiveDefinition> =>
  (component as { __elfDefinition: { directives: Record<string, DirectiveDefinition> } })
    .__elfDefinition.directives;

const invokeMounted = (definition: DirectiveDefinition, element: HTMLElement): void => {
  const binding = { value: undefined, oldValue: undefined, modifiers: {} };
  if (typeof definition === "function") definition(element, binding);
  else definition.mounted?.(element, binding);
};

beforeAll(() => {
  removeGlobalDual = directive("dual", { mounted: () => globalDualCalls.push("global") });
});

afterAll(() => removeGlobalDual());

afterEach(() => {
  document.body.innerHTML = "";
  localOnlyCalls.length = 0;
  localDualCalls.length = 0;
  globalDualCalls.length = 0;
});

describe("组件级自定义指令（builder.directive）", () => {
  it("仅组件内可见，不污染全局", () => {
    const local = resolveDirective("local-only", localDirectives(TestLocalDirective));
    expect(local).toBeTruthy();
    expect(resolveDirective("local-only")).toBeUndefined();
    invokeMounted(local!, document.createElement("button"));

    expect(localOnlyCalls).toEqual(["button"]);
  });

  it("局部指令优先于同名全局指令", () => {
    const global = resolveDirective("dual");
    const local = resolveDirective("dual", localDirectives(TestDualDirective));
    expect(local).toBeTruthy();
    expect(local).not.toBe(global);
    invokeMounted(local!, document.createElement("button"));

    expect(localDualCalls).toEqual(["local"]);
    expect(globalDualCalls).toEqual([]);
  });
});
