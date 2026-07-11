// elf-radio-group 测试

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const flush = (): Promise<void> =>
  Promise.resolve()
    .then(() => Promise.resolve())
    .then(() => Promise.resolve());

type GroupHost = HTMLElement & { modelValue?: unknown; disabled?: boolean };

describe("elf-radio-group", () => {
  const mount = (): GroupHost => {
    const el = document.createElement("elf-radio-group") as GroupHost;
    document.body.appendChild(el);
    return el;
  };

  it("渲染 group 容器", async () => {
    const el = mount();
    await flush();
    expect(el.shadowRoot!.querySelector(".group")).toBeTruthy();
  });

  it("子 radio 点击后 emit update:modelValue", async () => {
    const group = mount();
    group.modelValue = "b";
    await flush();

    const r = document.createElement("elf-radio") as HTMLElement & { value?: unknown };
    r.value = "a";
    group.appendChild(r);
    await flush();

    const onUpdate = vi.fn();
    group.addEventListener("update:modelValue", (e) => {
      group.modelValue = (e as CustomEvent).detail;
    });
    group.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    (r.shadowRoot!.querySelector(".dot") as HTMLElement).click();
    await flush();

    expect(group.modelValue).toBe("a");
    expect(r.hasAttribute("data-checked")).toBe(true);
  });

  it("disabled 属性设置到 props", async () => {
    const el = mount();
    el.disabled = true;
    await flush();
    expect(el.disabled).toBe(true);
  });
});
