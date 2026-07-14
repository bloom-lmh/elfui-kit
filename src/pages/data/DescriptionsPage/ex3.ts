import { defineHtml, html } from "elfui";

const code3 = `<elf-descriptions title="Account" border direction="horizontal" :column=\${2}>
  <elf-descriptions-item label="Name" label-width="88" :span=\${1}>Elf</elf-descriptions-item>
  <elf-descriptions-item align="right" :span=\${1}>
    <span slot="label">Role</span>
    Maintainer
  </elf-descriptions-item>
  <elf-descriptions-item label="Description" :span=\${2}>
    Declarative descriptions items preserve rich content and slots.
  </elf-descriptions-item>
</elf-descriptions>`;

const PageDescriptionsEx3 = defineHtml(html`
<elf-playground title="descriptions item / slots" :code=${code3}>
      <elf-descriptions title="Account" border direction="horizontal" :column=${2}>
        <elf-descriptions-item label="Name" label-width="88" :span=${1}>Elf</elf-descriptions-item>
        <elf-descriptions-item align="right" :span=${1}>
          <span slot="label">Role</span>
          Maintainer
        </elf-descriptions-item>
        <elf-descriptions-item label="Description" :span=${2}>
          Declarative descriptions items preserve rich content and slots.
        </elf-descriptions-item>
      </elf-descriptions>
    </elf-playground>
`);

export { PageDescriptionsEx3 };
