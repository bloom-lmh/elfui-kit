import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../register");
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface UploadEl extends HTMLElement {
  autoUpload?: boolean;
  multiple?: boolean;
  limit?: number;
  maxSize?: number;
  accept?: string;
  fileNamePattern?: string;
  chunkSize?: number;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  chunkRequest?: unknown;
  httpRequest?: unknown;
  action?: string;
  method?: string;
  headers?: Record<string, unknown>;
  data?: Record<string, unknown> | ((file: File) => Record<string, unknown>);
  withCredentials?: boolean;
  directory?: boolean;
  submit?: () => void;
  abort?: () => void;
  handleStart?: (file: File) => void;
  handleRemove?: (file: File) => void;
  clearFiles?: (statuses?: string[]) => void;
}

const selectFiles = async (el: UploadEl, files: File[]): Promise<void> => {
  const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
  Object.defineProperty(input, "files", { value: files, configurable: true });
  input.dispatchEvent(new Event("change"));
  await tick();
  await tick();
};

const flushTicks = async (count = 6): Promise<void> => {
  for (let i = 0; i < count; i += 1) {
    await tick();
  }
};

describe("elf-upload", () => {
  it("点击选择按钮会打开原生文件选择器", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    document.body.appendChild(el);
    await tick();
    await tick();

    const input = el.shadowRoot!.querySelector("input.native") as HTMLInputElement;
    const click = vi.spyOn(input, "click").mockImplementation(() => undefined);

    (el.shadowRoot!.querySelector(".button") as HTMLElement).click();
    await tick();

    expect(click).toHaveBeenCalledTimes(1);
  });

  it("选择文件后更新列表并触发 change", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.autoUpload = false;
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "a.txt", { type: "text/plain" })]);

    expect(el.shadowRoot!.textContent).toContain("a.txt");
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toHaveLength(1);
  });

  it("超过 limit 时触发 exceed", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.limit = 1;
    el.multiple = true;
    const onExceed = vi.fn();
    el.addEventListener("exceed", onExceed as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "a.txt"), new File(["b"], "b.txt")]);

    expect(onExceed).toHaveBeenCalled();
    expect(el.shadowRoot!.querySelectorAll(".file")).toHaveLength(0);
  });

  it("自动上传成功后触发 success", async () => {
    vi.useFakeTimers();
    const el = document.createElement("elf-upload") as UploadEl;
    const onSuccess = vi.fn();
    el.addEventListener("success", onSuccess as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "a.txt")]);
    await vi.runAllTimersAsync();
    await tick();

    expect(onSuccess).toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector(".file.is-success")).toBeTruthy();
  });

  it("校验 accept、文件名规则和 maxSize，并触发 invalid", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.autoUpload = false;
    el.accept = "image/*";
    el.fileNamePattern = "^avatar-";
    el.maxSize = 4;
    const onInvalid = vi.fn();
    el.addEventListener("invalid", onInvalid as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["abc"], "readme.txt", { type: "text/plain" })]);
    expect((onInvalid.mock.calls[0]![0] as CustomEvent).detail.reason).toBe("accept");
    expect(el.shadowRoot!.querySelectorAll(".file")).toHaveLength(0);

    await selectFiles(el, [new File(["abc"], "photo.png", { type: "image/png" })]);
    expect((onInvalid.mock.calls[1]![0] as CustomEvent).detail.reason).toBe("name");

    await selectFiles(el, [new File(["abcde"], "avatar-big.png", { type: "image/png" })]);
    expect((onInvalid.mock.calls[2]![0] as CustomEvent).detail.reason).toBe("size");
    expect(el.shadowRoot!.textContent).toContain("超过大小限制");
  });

  it("beforeUpload 返回 false 时显示提示并阻止加入列表", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.beforeUpload = vi.fn(() => false);
    const onInvalid = vi.fn();
    el.addEventListener("invalid", onInvalid as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "a.txt")]);

    expect((onInvalid.mock.calls[0]![0] as CustomEvent).detail.reason).toBe("before-upload");
    expect(el.shadowRoot!.textContent).toContain("未通过上传前检查");
    expect(el.shadowRoot!.querySelectorAll(".file")).toHaveLength(0);
  });

  it("手动上传只在 submit 后开始", async () => {
    vi.useFakeTimers();
    const el = document.createElement("elf-upload") as UploadEl;
    el.autoUpload = false;
    const onSuccess = vi.fn();
    el.addEventListener("success", onSuccess as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "manual.txt")]);
    expect(onSuccess).not.toHaveBeenCalled();

    el.submit?.();
    await vi.runAllTimersAsync();
    await tick();

    expect(onSuccess).toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector(".file.is-success")).toBeTruthy();
  });

  it("chunkSize 开启分片上传并汇报进度", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.chunkSize = 2;
    const onProgress = vi.fn();
    const onSuccess = vi.fn();
    el.addEventListener("progress", onProgress as EventListener);
    el.addEventListener("success", onSuccess as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["abcde"], "chunk.txt")]);
    await flushTicks();

    expect(onProgress).toHaveBeenCalled();
    expect((onSuccess.mock.calls[0]![0] as CustomEvent).detail[0].chunks).toBe(3);
    expect(el.shadowRoot!.querySelector(".file.is-success")).toBeTruthy();
  });

  it("httpRequest 接收 Element Plus 风格请求参数", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    const httpRequest = vi.fn((options) => {
      options.onProgress(50);
      options.onSuccess({ ok: true });
    });
    el.action = "/upload";
    el.method = "put";
    el.headers = { token: "abc" };
    el.data = (file: File) => ({ filename: file.name });
    el.withCredentials = true;
    el.httpRequest = httpRequest;
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "request.txt")]);
    await flushTicks();

    expect(httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "/upload",
        method: "put",
        filename: "file",
        data: { filename: "request.txt" },
        headers: { token: "abc" },
        withCredentials: true
      })
    );
    expect(el.shadowRoot!.querySelector(".file.is-success")).toBeTruthy();
  });

  it("directory 会透传目录选择属性", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.directory = true;
    document.body.appendChild(el);
    await tick();
    await tick();

    const input = el.shadowRoot!.querySelector("input.native") as HTMLInputElement;
    expect(input.hasAttribute("webkitdirectory")).toBe(true);
  });

  it("handleStart / handleRemove / clearFiles 暴露方法可控制列表", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.autoUpload = false;
    document.body.appendChild(el);
    await tick();

    const file = new File(["a"], "manual-api.txt");
    el.handleStart?.(file);
    await flushTicks();
    expect(el.shadowRoot!.textContent).toContain("manual-api.txt");

    el.handleRemove?.(file);
    await flushTicks();
    expect(el.shadowRoot!.textContent).not.toContain("manual-api.txt");

    el.handleStart?.(new File(["b"], "clear-ready.txt"));
    await flushTicks();
    el.clearFiles?.(["ready"]);
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".file")).toHaveLength(0);
  });

  it("abort 会取消模拟上传并标记错误", async () => {
    vi.useFakeTimers();
    const el = document.createElement("elf-upload") as UploadEl;
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "abort.txt")]);
    el.abort?.();
    await tick();
    await vi.runAllTimersAsync();
    await tick();

    expect(el.shadowRoot!.querySelector(".file.is-error")).toBeTruthy();
    expect(el.shadowRoot!.textContent).toContain("上传已取消");
  });
});
