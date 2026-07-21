import { defineHtml, html } from "@elfui/core";

import { useLocaleProvider } from "../context";

const locale = useLocaleProvider();

const LocaleProviderProbe = defineHtml(html`
  <span class="value">{{ locale.name }}|{{ locale.dir }}|{{ locale.t('common.confirm') }}</span>
`);

export { LocaleProviderProbe };
