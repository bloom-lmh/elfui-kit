import { defineHtml, html, inject } from "@elfui/core";

import { DEFAULT_LOCALE_CONTEXT, LOCALE_PROVIDER_KEY } from "../../../components/Providers/context";

const locale = inject(LOCALE_PROVIDER_KEY, DEFAULT_LOCALE_CONTEXT) ?? DEFAULT_LOCALE_CONTEXT;

const PageLocaleProviderPreview = defineHtml(html`
  <div
    style="display:grid;gap:8px;padding:16px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper);direction:ltr;text-align:left"
  >
    <strong>{{ locale.t('provider.title') }}</strong>
    <span style="color:var(--elf-text-secondary)"
      >locale: {{ locale.name }} / {{ locale.dir }}</span
    >
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <elf-button size="sm">{{ locale.t('common.confirm') }}</elf-button>
      <elf-button size="sm" variant="outlined">{{ locale.t('common.cancel') }}</elf-button>
    </div>
  </div>
`);

export { PageLocaleProviderPreview };
