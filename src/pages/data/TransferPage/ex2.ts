import { defineHtml, html, useRef } from "elfui";

const users = [
  { id: "u1", name: "Ada" },
  { id: "u2", name: "Bruno" },
  { id: "u3", name: "Chi" },
  { id: "u4", name: "Dora", locked: true },
  { id: "u5", name: "Evan" }
];

const selected = useRef<string[]>(["u2"]);
const readKeys = (event: Event): string[] => (Array.isArray((event as CustomEvent).detail) ? (event as CustomEvent).detail : []);
const onTransfer = (event: Event): void => selected.set(readKeys(event));
const filterUsers = (query: string, user: { name: string }): boolean => user.name.toLowerCase().startsWith(query.toLowerCase());

const code = `const selected = useRef(["u2"])
<elf-transfer
  :data="users"
  :modelValue="selected"
  @update:modelValue="onTransfer"
  :props="{ key: 'id', label: 'name', disabled: 'locked' }"
  filterable
  :filterMethod="filterUsers"
  target-order="unshift"
  :leftDefaultChecked="['u1']"
  :buttonTexts="['Remove', 'Add']"
  :format="{ noChecked: '\${total} users', hasChecked: '\${checked}/\${total} selected' }"
/>`;

const noCheckedFormat = "${total} users";
const hasCheckedFormat = "${checked}/${total} selected";

const PageTransferEx2 = defineHtml(html`
  <h2>Filter, defaults, and target ordering</h2>
  <elf-playground title="Custom fields, disabled items, custom filtering, and unshift ordering" :code=${code}>
    <elf-transfer
      :data=${users}
      :modelValue=${selected}
      @update:modelValue=${onTransfer}
      :props=${{ key: "id", label: "name", disabled: "locked" }}
      filterable
      :filterMethod=${filterUsers}
      target-order="unshift"
      :leftDefaultChecked=${["u1"]}
      :buttonTexts=${["Remove", "Add"]}
      :format=${{ noChecked: noCheckedFormat, hasChecked: hasCheckedFormat }}
    ></elf-transfer>
  </elf-playground>
`);

export { PageTransferEx2 };
