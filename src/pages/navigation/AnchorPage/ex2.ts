import { defineHtml, html, useRef } from "elfui";

const active = useRef("#anchor-nested-install");

const items = [
  {
    title: "Getting started",
    href: "#anchor-nested-start",
    children: [
      { title: "Install", href: "#anchor-nested-install" },
      { title: "Register", href: "#anchor-nested-register" }
    ]
  },
  {
    title: "Advanced",
    href: "#anchor-nested-advanced",
    children: [
      { title: "Disabled target", href: "#anchor-nested-disabled", disabled: true },
      { title: "Events", href: "#anchor-nested-events" }
    ]
  }
];

const horizontalItems = [
  { title: "Overview", href: "#anchor-nested-start" },
  { title: "Installation", href: "#anchor-nested-install" },
  { title: "Registration", href: "#anchor-nested-register" },
  { title: "Design tokens", href: "#anchor-nested-advanced" },
  { title: "Accessibility", href: "#anchor-nested-events" },
  { title: "Keyboard navigation", href: "#anchor-nested-events" },
  { title: "Release notes", href: "#anchor-nested-events" }
];

const onUpdate = (event: CustomEvent): void => {
  active.set(event.detail);
};

const code = `<elf-anchor
  :items=\${items}
  :modelValue=\${active}
  container="#anchor-nested-scroll"
  :bound=\${24}
  @update:modelValue=\${onUpdate}
/>`;

const horizontalCode = `<elf-anchor
  :items=\${horizontalItems}
  direction="horizontal"
  type="underline"
  :marker=\${false}
/>`;

const PageAnchorEx2 = defineHtml(html`
  <h2>Nested and controlled</h2>
  <elf-playground title="Nested items / controlled active / disabled link" :code=${code}>
    <div
      style="display:grid;grid-template-columns:minmax(180px,240px) 1fr;gap:20px;width:100%;max-width:900px"
    >
      <elf-anchor
        :items=${items}
        :modelValue=${active}
        container="#anchor-nested-scroll"
        :bound=${24}
        @update:modelValue=${onUpdate}
      ></elf-anchor>
      <div
        id="anchor-nested-scroll"
        style="height:300px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
      >
        <section id="anchor-nested-start" style="min-height:180px;padding:20px">
          <h3>Getting started</h3>
          <p>The component accepts tree data and flattens it into a Material style rail.</p>
        </section>
        <section
          id="anchor-nested-install"
          style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"
        >
          <h3>Install</h3>
          <p>The active item is controlled by modelValue in this example.</p>
        </section>
        <section
          id="anchor-nested-register"
          style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"
        >
          <h3>Register</h3>
          <p>Use update:modelValue when the parent needs to own the current href.</p>
        </section>
        <section
          id="anchor-nested-advanced"
          style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"
        >
          <h3>Advanced</h3>
          <p>Offset and bounds make sticky header layouts easier to tune.</p>
        </section>
        <section
          id="anchor-nested-disabled"
          style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"
        >
          <h3>Disabled target</h3>
          <p>This section exists, but the navigation item is disabled.</p>
        </section>
        <section
          id="anchor-nested-events"
          style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"
        >
          <h3>Events</h3>
          <p>change emits the new and old href; click emits the item and href.</p>
        </section>
      </div>
    </div>
  </elf-playground>

  <elf-playground title="horizontal / underline / marker=false" :code=${horizontalCode}>
    <div style="width:100%;max-width:560px">
      <elf-anchor
        :items=${horizontalItems}
        direction="horizontal"
        type="underline"
        :marker=${false}
        default-active="#anchor-nested-start"
      ></elf-anchor>
    </div>
  </elf-playground>
`);

export { PageAnchorEx2 };
