import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface TreeEl extends HTMLElement {
  data?: unknown[];
  nodeKey?: string;
  currentNodeKey?: string;
  defaultExpandedKeys?: string[];
  defaultCheckedKeys?: string[];
  showCheckbox?: boolean;
  checkStrictly?: boolean;
  accordion?: boolean;
  filterable?: boolean;
  bordered?: boolean;
  props?: Record<string, string>;
}

const data = [
  {
    key: "guide",
    label: "指南",
    children: [
      { key: "install", label: "安装" },
      { key: "quick-start", label: "快速开始" }
    ]
  },
  {
    key: "components",
    label: "组件",
    children: [
      { key: "button", label: "Button 按钮" },
      { key: "tree", label: "Tree 树", disabled: true }
    ]
  }
];

const mount = async (setup?: (el: TreeEl) => void): Promise<TreeEl> => {
  const el = document.createElement("elf-tree") as TreeEl;
  el.data = data;
  setup?.(el);
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const labels = (el: TreeEl): string[] =>
  Array.from(el.shadowRoot!.querySelectorAll(".tree-label")).map(
    (node) => node.textContent?.trim() || ""
  );

describe("elf-tree", () => {
  it("默认无边框并支持显式 bordered 外观", async () => {
    const plain = await mount();
    expect(plain.shadowRoot!.querySelector(".tree")!.classList.contains("is-bordered")).toBe(false);

    const bordered = await mount((tree) => {
      tree.bordered = true;
    });
    expect(bordered.shadowRoot!.querySelector(".tree")!.classList.contains("is-bordered")).toBe(true);
  });

  it("默认只渲染根节点", async () => {
    const el = await mount();

    expect(labels(el)).toEqual(["指南", "组件"]);
  });

  it("点击展开按钮显示子节点并触发 expandedKeys 更新", async () => {
    const el = await mount();
    const onExpand = vi.fn();
    el.addEventListener("update:expandedKeys", onExpand as EventListener);

    const switcher = el.shadowRoot!.querySelector(".tree-switch") as HTMLButtonElement;
    switcher.click();
    await tick();
    await tick();

    expect(labels(el)).toContain("安装");
    expect(onExpand).toHaveBeenCalled();
    expect((onExpand.mock.calls[0]![0] as CustomEvent).detail).toEqual(["guide"]);
  });

  it("defaultExpandedKeys 支持默认展开", async () => {
    const el = await mount((tree) => {
      tree.defaultExpandedKeys = ["components"];
    });

    expect(labels(el)).toContain("Button 按钮");
  });

  it("点击节点内容更新选中值并触发 node-click", async () => {
    const el = await mount((tree) => {
      tree.defaultExpandedKeys = ["guide"];
    });
    const onUpdate = vi.fn();
    const onClick = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    el.addEventListener("node-click", onClick as EventListener);

    const install = Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>(".tree-content")).find(
      (node) => node.textContent?.includes("安装")
    )!;
    install.click();
    await tick();

    expect(onUpdate).toHaveBeenCalled();
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("install");
    expect(onClick).toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector(".tree-node.is-selected")?.textContent).toContain("安装");
  });

  it("showCheckbox 支持父子级联勾选", async () => {
    const el = await mount((tree) => {
      tree.showCheckbox = true;
      tree.defaultExpandedKeys = ["guide"];
    });
    const onCheck = vi.fn();
    el.addEventListener("update:checkedKeys", onCheck as EventListener);

    const checkbox = el.shadowRoot!.querySelector(".tree-checkbox") as HTMLButtonElement;
    checkbox.click();
    await tick();

    expect(onCheck).toHaveBeenCalled();
    expect((onCheck.mock.calls[0]![0] as CustomEvent).detail).toEqual([
      "guide",
      "install",
      "quick-start"
    ]);
  });

  it("子节点部分勾选时父节点显示半选", async () => {
    const el = await mount((tree) => {
      tree.showCheckbox = true;
      tree.defaultExpandedKeys = ["guide"];
      tree.defaultCheckedKeys = ["install"];
    });

    const parentCheckbox = el.shadowRoot!.querySelector(".tree-checkbox") as HTMLButtonElement;
    expect(parentCheckbox.classList.contains("is-indeterminate")).toBe(true);
  });

  it("disabled 节点不可选中", async () => {
    const el = await mount((tree) => {
      tree.defaultExpandedKeys = ["components"];
    });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    const disabled = Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>(".tree-content")).find(
      (node) => node.textContent?.includes("Tree 树")
    )!;
    disabled.click();
    await tick();

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("filterable 按关键字显示命中节点和祖先", async () => {
    const el = await mount((tree) => {
      tree.filterable = true;
    });

    const input = el.shadowRoot!.querySelector("input[type='search']") as HTMLInputElement;
    input.value = "Button";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    expect(labels(el)).toEqual(["组件", "Button 按钮"]);
  });

  it("accordion 同级只保留一个展开分支", async () => {
    const el = await mount((tree) => {
      tree.accordion = true;
    });

    const switches = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".tree-switch");
    switches[0]!.click();
    await tick();
    await tick();
    switches[1]!.click();
    await tick();
    await tick();

    expect(labels(el)).not.toContain("安装");
    expect(labels(el)).toContain("Button 按钮");
  });

  it("支持自定义字段名", async () => {
    const el = document.createElement("elf-tree") as TreeEl;
    el.data = [{ id: "root", name: "Root", nodes: [{ id: "child", name: "Child" }] }];
    el.props = { key: "id", label: "name", children: "nodes" };
    el.defaultExpandedKeys = ["root"];
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(labels(el)).toEqual(["Root", "Child"]);
  });

  it("nodeKey 属性可直接指定节点 key 字段", async () => {
    const el = document.createElement("elf-tree") as TreeEl;
    el.nodeKey = "id";
    el.data = [{ id: "root", label: "Root", children: [{ id: "child", label: "Child" }] }];
    el.defaultExpandedKeys = ["root"];
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(labels(el)).toEqual(["Root", "Child"]);
  });

  it("暴露权限树常用 checked / halfChecked 方法", async () => {
    const el = await mount((tree) => {
      tree.showCheckbox = true;
      tree.defaultExpandedKeys = ["guide"];
      tree.defaultCheckedKeys = ["install"];
    });
    const api = el as unknown as {
      getCheckedKeys: (leafOnly?: boolean) => string[];
      getCheckedNodes: (
        leafOnly?: boolean,
        includeHalfChecked?: boolean
      ) => Array<{ key?: string }>;
      getHalfCheckedKeys: () => string[];
      getHalfCheckedNodes: () => Array<{ key?: string }>;
      setChecked: (key: string, checked: boolean, deep?: boolean) => void;
      setCheckedNodes: (nodes: Array<{ key?: string }>) => void;
    };

    expect(api.getCheckedKeys(true)).toEqual(["install"]);
    expect(api.getHalfCheckedKeys()).toEqual(["guide"]);
    expect(api.getHalfCheckedNodes().map((node) => node.key)).toEqual(["guide"]);
    expect(api.getCheckedNodes(false, true).map((node) => node.key)).toEqual(["install", "guide"]);

    api.setChecked("guide", true, true);
    await tick();

    expect(api.getCheckedKeys(true)).toEqual(["install", "quick-start"]);

    api.setCheckedNodes([{ key: "button" }]);
    await tick();

    expect(api.getCheckedKeys(true)).toEqual(["button"]);
  });

  it("checkStrictly 开启后父子勾选互不影响", async () => {
    const el = await mount((tree) => {
      tree.showCheckbox = true;
      tree.checkStrictly = true;
      tree.defaultExpandedKeys = ["guide"];
    });
    const api = el as unknown as {
      setChecked: (key: string, checked: boolean, deep?: boolean) => void;
      getCheckedKeys: () => string[];
      getHalfCheckedKeys: () => string[];
    };

    api.setChecked("guide", true, true);
    await tick();

    expect(api.getCheckedKeys()).toEqual(["guide"]);
    expect(api.getHalfCheckedKeys()).toEqual([]);
  });

  it("currentNodeKey 和 current node 方法可用于权限编辑回显", async () => {
    const el = await mount((tree) => {
      tree.currentNodeKey = "components";
    });
    const api = el as unknown as {
      getCurrentKey: () => string;
      getCurrentNode: () => { key?: string } | undefined;
      setCurrentKey: (key: string) => void;
      setCurrentNode: (node: { key?: string }) => void;
      getNode: (key: string) => { key?: string } | undefined;
    };

    expect(api.getCurrentKey()).toBe("components");
    expect(api.getCurrentNode()?.key).toBe("components");

    api.setCurrentKey("guide");
    await tick();

    expect(api.getCurrentKey()).toBe("guide");
    expect(api.getNode("guide")?.key).toBe("guide");

    api.setCurrentNode({ key: "components" });
    await tick();

    expect(api.getCurrentKey()).toBe("components");
  });
});
