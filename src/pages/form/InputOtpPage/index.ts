import { defineHtml, html, useRef } from "elfui";

const otp = useRef("4821");
const payCode = useRef("");

const code1 = `<elf-input-otp
  :modelValue=\${otp}
  length="6"
  separator="-"
  placeholder="0"
  @update:modelValue=\${onOtpUpdate}
/>
<span class="demo-state">当前：\${otp || "未输入"}</span>`;

const script1 = `const otp = useRef("4821");

const onOtpUpdate = (event) => {
  otp.set(event.detail);
};`;

const code2 = `<elf-input-otp
  :modelValue=\${payCode}
  type="number"
  length="4"
  size="lg"
  @update:modelValue=\${onPayCodeUpdate}
/>`;

const script2 = `const payCode = useRef("");

const onPayCodeUpdate = (event) => {
  payCode.set(event.detail);
};`;

const code3 = `<elf-input-otp model-value="******" type="password" readonly />
<elf-input-otp model-value="123456" disabled />`;

const onOtpUpdate = (event: CustomEvent): void => {
  otp.set(String(event.detail || ""));
};

const onPayCodeUpdate = (event: CustomEvent): void => {
  payCode.set(String(event.detail || ""));
};

const PageInputOtp = defineHtml(html`
  <elf-container>
    <h1>InputOtp 一次性密码</h1>
    <p>用于验证码、支付密码等分段输入场景，支持长度、数字模式、分隔符、只读与禁用。</p>

    <elf-playground title="受控值 / 分隔符" :code=${code1} :script=${script1}>
      <elf-input-otp
        :modelValue=${otp}
        length="6"
        separator="-"
        placeholder="0"
        @update:modelValue=${onOtpUpdate}
      ></elf-input-otp>
      <span class="demo-state">当前：${otp || "未输入"}</span>
    </elf-playground>

    <elf-playground title="数字模式 / 大尺寸" :code=${code2} :script=${script2}>
      <elf-input-otp
        :modelValue=${payCode}
        type="number"
        length="4"
        size="lg"
        @update:modelValue=${onPayCodeUpdate}
      ></elf-input-otp>
    </elf-playground>

    <elf-playground title="只读 / 禁用" :code=${code3}>
      <div style="display:grid;gap:12px">
        <elf-input-otp model-value="******" type="password" readonly></elf-input-otp>
        <elf-input-otp model-value="123456" disabled></elf-input-otp>
      </div>
    </elf-playground>
  </elf-container>
`);

export { PageInputOtp };
