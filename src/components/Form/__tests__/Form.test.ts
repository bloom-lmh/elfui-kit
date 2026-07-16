// elf-form / elf-form-item / elf-input 联动集成测试
//
// 覆盖：
// - form / form-item / input 连接
// - input 失焦触发 blur 校验
// - validate / resetFields / clearValidate
// - 自定义 validator
// - rules 合并（form.rules[prop] + item.rules）

import { useReactive } from "@elfui/reactivity";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

interface FormHost extends HTMLElement {
  validate(): Promise<boolean>;
  resetFields(): void;
  clearValidate(): void;
  validateField(prop: string | string[], trigger?: string): Promise<boolean>;
  model?: unknown;
  rules?: unknown;
}

const buildSimpleForm = async (): Promise<{
  form: FormHost;
  item: HTMLElement;
  input: HTMLElement;
  inputEl: HTMLInputElement;
  data: { name: string };
}> => {
  // 注意：把 useReactive 对象当作 form.model 直接传入。setup 内 props.model
  // 会读到代理本身，输入框写入时通过代理同步。
  const data = useReactive({ name: "" });

  const form = document.createElement("elf-form") as FormHost;
  // 直接传 useReactive 对象（form-item 通过 inject 拿到 form context，再 getPath(form.model, "name")）
  form.model = data;
  form.rules = { name: [{ required: true, message: "必填", trigger: "blur" }] };
  document.body.appendChild(form);

  const item = document.createElement("elf-form-item");
  item.setAttribute("prop", "name");
  item.setAttribute("label", "姓名");
  form.appendChild(item);

  const input = document.createElement("elf-input") as HTMLElement & { modelValue?: unknown };
  // 双向同步：input → data
  input.addEventListener("update:modelValue", (e) => {
    data.name = (e as unknown as CustomEvent).detail;
  });
  item.appendChild(input);

  await tick();
  await tick();
  await tick();

  const inputEl = input.shadowRoot!.querySelector("input") as HTMLInputElement;
  return { form, item, input, inputEl, data };
};

describe("Form 联动", () => {
  it("form / form-item / input 渲染并连接", async () => {
    const { form, item, input, inputEl } = await buildSimpleForm();
    expect(form.shadowRoot!.querySelector("form")).toBeTruthy();
    expect(item.shadowRoot!.querySelector("label")?.textContent?.trim()).toBe("姓名");
    expect(input.shadowRoot!.querySelector("input")).toBe(inputEl);
  });

  it("validate() 失败：返回 false 且 form-item state=error", async () => {
    const { form, item } = await buildSimpleForm();

    const ok = await form.validate();
    expect(ok).toBe(false);
    await tick();
    expect(item.shadowRoot!.querySelector(".error")?.textContent).toContain("必填");
  });

  it("validate() 通过：填值后", async () => {
    const { form, data, inputEl } = await buildSimpleForm();

    inputEl.value = "Alice";
    inputEl.dispatchEvent(new Event("input"));
    await tick();
    await tick();
    expect(data.name).toBe("Alice");

    const ok = await form.validate();
    expect(ok).toBe(true);
  });

  it("blur 触发校验 + 显示错误", async () => {
    const { item, inputEl } = await buildSimpleForm();

    inputEl.dispatchEvent(new Event("blur"));
    await tick();
    await tick();
    expect(item.shadowRoot!.querySelector(".error")?.textContent).toContain("必填");
  });

  it("resetFields 清空 + 清错误状态", async () => {
    const { form, data, item, inputEl } = await buildSimpleForm();

    inputEl.value = "Bob";
    inputEl.dispatchEvent(new Event("input"));
    await tick();
    expect(data.name).toBe("Bob");

    await form.validate();
    form.resetFields();
    await tick();
    await tick();
    expect(data.name).toBe("");
    expect(item.shadowRoot!.querySelector(".error")).toBeNull();
  });

  it("clearValidate 清错误不重置值", async () => {
    const { form, data, item } = await buildSimpleForm();

    await form.validate();
    await tick();
    expect(item.shadowRoot!.querySelector(".error")).toBeTruthy();

    form.clearValidate();
    await tick();
    expect(item.shadowRoot!.querySelector(".error")).toBeNull();
    expect(data.name).toBe("");
  });

  it("keeps inline layout on the native form and supports native submit opt-out", async () => {
    const form = document.createElement("elf-form") as FormHost & {
      inline?: boolean;
      preventSubmit?: boolean;
    };
    form.inline = true;
    form.preventSubmit = false;
    document.body.appendChild(form);
    await tick();
    await tick();

    expect(form.hasAttribute("inline")).toBe(true);
    const nativeForm = form.shadowRoot!.querySelector("form")!;
    const submit = new SubmitEvent("submit", { bubbles: true, cancelable: true });
    nativeForm.dispatchEvent(submit);

    expect(submit.defaultPrevented).toBe(false);
  });
});

describe("CheckboxGroup 联动", () => {
  it("checkbox-group min/max 限制", async () => {
    const group = document.createElement("elf-checkbox-group") as HTMLElement & {
      modelValue?: unknown[];
      min?: number;
      max?: number;
    };
    document.body.appendChild(group);
    group.min = 1;
    group.modelValue = ["a"];
    await tick();
    await tick();

    const cb = document.createElement("elf-checkbox") as HTMLElement & { value?: unknown };
    cb.value = "a";
    group.appendChild(cb);
    await tick();
    await tick();

    let called = false;
    group.addEventListener("update:modelValue", () => {
      called = true;
    });

    const box = cb.shadowRoot!.querySelector(".box") as HTMLElement;
    box.click();
    await tick();

    // min=1，不能取消最后一个
    expect(called).toBe(false);
  });
});

describe("RadioGroup 联动", () => {
  it("radio-group 切换选项", async () => {
    const group = document.createElement("elf-radio-group") as HTMLElement & {
      modelValue?: unknown;
    };
    group.modelValue = "a";
    document.body.appendChild(group);

    const r1 = document.createElement("elf-radio") as HTMLElement & { value?: unknown };
    r1.value = "a";
    group.appendChild(r1);

    const r2 = document.createElement("elf-radio") as HTMLElement & { value?: unknown };
    r2.value = "b";
    group.appendChild(r2);
    await tick();
    await tick();

    let emitted: unknown = null;
    group.addEventListener("update:modelValue", (e) => {
      emitted = (e as CustomEvent).detail;
      group.modelValue = emitted;
    });

    const dot2 = r2.shadowRoot!.querySelector(".dot") as HTMLElement;
    dot2.click();
    await tick();

    expect(emitted).toBe("b");
    expect(r2.hasAttribute("data-checked")).toBe(true);
  });
});

describe("异步校验", () => {
  it("异步 validator 校验", async () => {
    const data = useReactive({ name: "" });

    const form = document.createElement("elf-form") as FormHost;
    form.model = data;
    form.rules = {
      name: [
        {
          validator: async () => {
            await new Promise((r) => setTimeout(r, 10));
            return "异步校验失败";
          }
        }
      ]
    };
    document.body.appendChild(form);

    const item = document.createElement("elf-form-item");
    item.setAttribute("prop", "name");
    form.appendChild(item);
    await tick();
    await tick();

    const ok = await form.validate();
    expect(ok).toBe(false);
    expect(item.shadowRoot!.querySelector(".error")?.textContent).toContain("异步校验失败");
  });
});
