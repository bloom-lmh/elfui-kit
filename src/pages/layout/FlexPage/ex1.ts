import { defineHtml, html } from "elfui";

const code1 = `<elf-flex direction="row" gap="md">
  <elf-button>A</elf-button>
  <elf-button>B</elf-button>
  <elf-button>C</elf-button>
</elf-flex>
<elf-flex direction="column" gap="sm">
  <elf-button>A</elf-button>
  <elf-button>B</elf-button>
  <elf-button>C</elf-button>
</elf-flex>`;

const code2 = `<elf-flex gap="xs"><elf-tag>xs</elf-tag><elf-tag>xs</elf-tag><elf-tag>xs</elf-tag></elf-flex>
<elf-flex gap="sm"><elf-tag>sm</elf-tag><elf-tag>sm</elf-tag><elf-tag>sm</elf-tag></elf-flex>
<elf-flex gap="md"><elf-tag>md</elf-tag><elf-tag>md</elf-tag><elf-tag>md</elf-tag></elf-flex>
<elf-flex gap="lg"><elf-tag>lg</elf-tag><elf-tag>lg</elf-tag><elf-tag>lg</elf-tag></elf-flex>
<elf-flex gap="xl"><elf-tag>xl</elf-tag><elf-tag>xl</elf-tag><elf-tag>xl</elf-tag></elf-flex>`;

const PageFlexEx1 = defineHtml(html`
  <h2>方向</h2>
  <elf-playground title="row / column" :code="code1">
    <div style="width: 100%">
      <elf-flex gap="md" style="margin-bottom: 8px"
        ><elf-button>A</elf-button><elf-button>B</elf-button><elf-button>C</elf-button></elf-flex
      >
      <elf-flex direction="column" gap="sm"
        ><elf-button>A</elf-button><elf-button>B</elf-button><elf-button>C</elf-button></elf-flex
      >
    </div>
  </elf-playground>

  <h2>间距</h2>
  <elf-playground title="gap=xs..xl" :code="code2">
    <div style="width: 100%; display: flex; flex-direction: column; gap: 8px">
      <elf-flex gap="xs"><elf-tag>xs</elf-tag><elf-tag>xs</elf-tag><elf-tag>xs</elf-tag></elf-flex>
      <elf-flex gap="sm"><elf-tag>sm</elf-tag><elf-tag>sm</elf-tag><elf-tag>sm</elf-tag></elf-flex>
      <elf-flex gap="md"><elf-tag>md</elf-tag><elf-tag>md</elf-tag><elf-tag>md</elf-tag></elf-flex>
      <elf-flex gap="lg"><elf-tag>lg</elf-tag><elf-tag>lg</elf-tag><elf-tag>lg</elf-tag></elf-flex>
      <elf-flex gap="xl"><elf-tag>xl</elf-tag><elf-tag>xl</elf-tag><elf-tag>xl</elf-tag></elf-flex>
    </div>
  </elf-playground>
`);

export { PageFlexEx1 };
