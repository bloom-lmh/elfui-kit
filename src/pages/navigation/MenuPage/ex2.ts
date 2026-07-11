import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const active = useRef("/product/list");

const items = [
  {
    index: "/product",
    label: "Product",
    icon: "📦",
    children: [
      { index: "/product/list", label: "Product list" },
      { index: "/product/category", label: "Categories" },
      { index: "/product/inventory", label: "Inventory" },
      { index: "/product/pricing", label: "Pricing" },
      { index: "/product/reviews", label: "Reviews" },
      { index: "/product/shipping", label: "Shipping" }
    ]
  },
  {
    index: "/order",
    label: "Order",
    icon: "📋",
    children: [
      { index: "/order/list", label: "Orders" },
      { index: "/order/refund", label: "Refunds" },
      { index: "/order/invoice", label: "Invoices" },
      { index: "/order/tracking", label: "Tracking" },
      { index: "/order/history", label: "History" }
    ]
  },
  { index: "/analytics", label: "Analytics", icon: "A" }
];

const onChange = (event: CustomEvent): void => {
  active.set(event.detail);
};

const code = `<elf-menu
  mode="horizontal"
  :items.prop="items"
  :modelValue="active"
  @update:modelValue="onChange"
/>`;

const script = `const active = useRef("/product/list");

const items = [
  {
    index: "/product",
    label: "Product",
    icon: "📦",
    children: [
      { index: "/product/list", label: "Product list" },
      { index: "/product/category", label: "Categories" }
    ]
  },
  { index: "/analytics", label: "Analytics", icon: "A" }
];

const onChange = (event) => {
  active.set(event.detail);
};`;

const PageMenuEx2 = defineHtml(html`
  <h2>水平菜单</h2>
  <elf-playground title="顶部导航 / 下方面板" :code=${code} :script=${script}>
    <div style="width:100%;max-width:860px">
      <elf-menu
        mode="horizontal"
        :items.prop=${items}
        :modelValue=${active}
        @update:modelValue=${onChange}
      ></elf-menu>
      <div style="margin-top:16px;color:var(--elf-text-secondary)">Active: {{ active }}</div>
    </div>
  </elf-playground>
`);

export { PageMenuEx2 };
