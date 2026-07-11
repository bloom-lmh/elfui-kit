import { beforeAll, afterEach, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../index");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface DefaultsProviderEl extends HTMLElement {
  defaults?: Record<string, Record<string, unknown>>;
  strategy?: string;
}

describe("elf-defaults-provider", () => {
  it("为子组件写入默认 props，并保留显式属性", async () => {
    const provider = document.createElement("elf-defaults-provider") as DefaultsProviderEl;
    provider.defaults = {
      "elf-button": {
        color: "secondary",
        variant: "outlined",
        size: "sm",
        disabled: true
      }
    };
    provider.innerHTML = `
      <elf-button id="a">默认按钮</elf-button>
      <elf-button id="b" color="danger">危险按钮</elf-button>
    `;

    document.body.appendChild(provider);
    await tick();
    await tick();

    const first = provider.querySelector("#a") as HTMLElement & {
      color?: string;
      variant?: string;
      size?: string;
      disabled?: boolean;
    };
    const second = provider.querySelector("#b") as HTMLElement & { color?: string };

    expect(first.color).toBe("secondary");
    expect(first.variant).toBe("outlined");
    expect(first.size).toBe("sm");
    expect(first.disabled).toBe(true);
    expect(first.hasAttribute("disabled")).toBe(true);
    expect(second.color).toBe("danger");
  });

  it("overwrite 策略可以覆盖显式属性", async () => {
    const provider = document.createElement("elf-defaults-provider") as DefaultsProviderEl;
    provider.strategy = "overwrite";
    provider.defaults = { Button: { color: "success" } };
    provider.innerHTML = `<elf-button color="danger">按钮</elf-button>`;

    document.body.appendChild(provider);
    await tick();
    await tick();

    const button = provider.querySelector("elf-button") as HTMLElement & { color?: string };
    expect(button.color).toBe("success");
    expect(button.getAttribute("color")).toBe("success");
  });
});
