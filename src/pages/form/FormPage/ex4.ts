import { defineHtml, html } from "elfui";
import { useReactive, useRef } from "elfui";

const disabled = useRef(false);

const settings = useReactive({
  env: "prod",
  notify: true,
  remark: "生产环境变更需要审批"
});

const envOptions = [
  { label: "开发环境", value: "dev" },
  { label: "测试环境", value: "test" },
  { label: "生产环境", value: "prod" }
];

const toggle = (): void => {
  disabled.set(!disabled.value);
};

const code = `<elf-form :model.prop="settings" label-position="right" label-width="96px" :disabled="disabled">
  <elf-form-item label="环境"><elf-select v-model="settings.env" /></elf-form-item>
</elf-form>`;

const PageFormEx4 = defineHtml(html`
  <h2>布局与禁用态</h2>
  <elf-playground title="label-position / label-width / disabled" :code="code">
    <div style="width:100%;max-width:640px;display:grid;gap:12px">
      <div style="display:flex;justify-content:flex-end">
        <elf-button size="small" @click="toggle()"
          >{{ disabled ? '启用表单' : '禁用表单' }}</elf-button
        >
      </div>
      <elf-form
        :model.prop="settings"
        label-position="right"
        label-width="96px"
        :disabled="disabled"
      >
        <elf-form-item label="环境">
          <elf-select v-model="settings.env" :options.prop="envOptions"></elf-select>
        </elf-form-item>
        <elf-form-item label="通知">
          <elf-switch v-model="settings.notify"></elf-switch>
        </elf-form-item>
        <elf-form-item label="备注">
          <elf-textarea v-model="settings.remark" rows="3"></elf-textarea>
        </elf-form-item>
      </elf-form>
    </div>
  </elf-playground>
`);

export { PageFormEx4 };
