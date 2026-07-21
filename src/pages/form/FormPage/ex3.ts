import { defineHtml, defineStyle, html, useHost, useReactive, useRef } from "@elfui/core";

import type { FormRules } from "../../../components/Form";
import demoStyles from "./demo.scss?inline";

interface FormHost extends HTMLElement {
  validate(): Promise<boolean>;
  resetFields(): void;
  clearValidate(): void;
}

const pageHost = useHost();

const getForm = (): FormHost | null => pageHost.shadowRoot?.querySelector<FormHost>("elf-form") ?? null;

const message = useRef("等待提交");

const model = useReactive({
  project: "",
  owner: "",
  desc: ""
});

const rules: FormRules = {
  project: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  owner: [{ required: true, message: "请选择负责人", trigger: "change" }],
  desc: [{ min: 6, message: "至少 6 个字符", trigger: "change" }]
};

const owners = [
  { label: "林舟", value: "lin" },
  { label: "周然", value: "zhou" },
  { label: "许宁", value: "xu" }
];

const submit = async (): Promise<void> => {
  const ok = await getForm()?.validate();
  message.set(ok ? `已提交：${model.project}` : "校验未通过");
};

const reset = (): void => {
  getForm()?.resetFields();
  message.set("已重置");
};

const clear = (): void => {
  getForm()?.clearValidate();
  message.set("已清除校验状态");
};

const code = `const ok = await formRef.validate()
formRef.resetFields()
formRef.clearValidate()`;

defineStyle(demoStyles);

const PageFormEx3 = defineHtml(html`
  <h2>提交校验</h2>
  <elf-playground title="validate / resetFields / clearValidate" :code=${code}>
    <p slot="status" class="demo-state">{{ message }}</p>
    <elf-card
      class="form-demo-card"
      variant="outlined"
      title="新建项目"
      subtitle="校验结果与操作按钮保持在同一张 Card 中"
    >
      <elf-form
        :model.prop="model"
        :rules.prop="rules"
        label-position="top"
        scroll-to-error
      >
        <elf-form-item prop="project" label="项目名称" required>
          <elf-input v-model="model.project" placeholder="请输入项目名称"></elf-input>
        </elf-form-item>
        <elf-form-item prop="owner" label="负责人" required>
          <elf-select
            v-model="model.owner"
            :options.prop="owners"
            placeholder="请选择负责人"
          ></elf-select>
        </elf-form-item>
        <elf-form-item prop="desc" label="说明">
          <elf-textarea v-model="model.desc" rows="3" placeholder="至少 6 个字符"></elf-textarea>
        </elf-form-item>
      </elf-form>
      <div class="form-demo-actions">
        <elf-button type="primary" @click="submit()">提交</elf-button>
        <elf-button @click="reset()">重置</elf-button>
        <elf-button @click="clear()">清除校验</elf-button>
      </div>
    </elf-card>
  </elf-playground>
`);

export { PageFormEx3 };
