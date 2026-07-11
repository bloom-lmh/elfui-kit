import { defineHtml, html } from "elfui";
import { useRef } from "elfui";
import type { UploadRequestOptions } from "../../../components/Form";

const basicLog = useRef("等待选择文件");

const validateLog = useRef("只允许 report-*.pdf，且单文件不超过 1MB");

const manualLog = useRef("等待手动上传");

const requestLog = useRef("等待自定义请求");

const chunkLog = useRef("等待分片上传");

const manualFiles = useRef<unknown[]>([]);

const headers = { Authorization: "Bearer demo-token" };

const extraData = { source: "playground", biz: "report" };

const basicCode = `<elf-upload
  multiple
  :limit=\${3}
  tip="最多 3 个文件"
  @change=\${onBasicChange}
/>`;

const basicScript = `const basicLog = useRef("等待选择文件");

const onBasicChange = (event) => {
  const files = event.detail;
  const names = files.map((file) => file.name).join("，");
  basicLog.set(files.length ? \`已选择 \${files.length} 个文件：\${names}\` : "列表为空");
};`;

const dragCode = `<elf-upload drag accept="image/*" list-type="picture-card" />`;

const validateCode = `<elf-upload
  accept=".pdf"
  file-name-pattern="^report-.*\\\\.pdf$"
  :max-size=\${1048576}
  :before-upload.prop=\${beforeUpload}
  @invalid=\${onInvalid}
/>`;

const validateScript = `const validateLog = useRef("只允许 report-*.pdf，且单文件不超过 1MB");

const beforeUpload = (file) => {
  const ok = file.size <= 1024 * 1024;
  if (!ok) validateLog.set(\`\${file.name} 超过 1MB，已阻止上传\`);
  return ok;
};

const onInvalid = (event) => {
  validateLog.set(event.detail?.message || "文件未通过校验");
};`;

const manualCode = `<elf-upload
  :modelValue=\${manualFiles}
  :auto-upload=\${false}
  button-text="选择待上传文件"
  @update:modelValue=\${onManualUpdate}
  @success=\${onManualSuccess}
/>`;

const manualScript = `const manualFiles = useRef([]);
const manualLog = useRef("等待手动上传");

const onManualUpdate = (event) => {
  const next = event.detail ?? [];
  manualFiles.set(next);
  manualLog.set(next.length ? \`待上传 \${next.length} 个文件\` : "等待手动上传");
};

const onManualSuccess = (event) => {
  const [, file] = event.detail;
  manualLog.set(\`\${file.name} 上传完成\`);
};`;

const requestCode = `<elf-upload
  action="/api/upload"
  method="put"
  directory
  :headers.prop=\${headers}
  :data.prop=\${extraData}
  :http-request.prop=\${httpRequest}
  @success=\${onRequestSuccess}
/>`;

const requestScript = `const requestLog = useRef("等待自定义请求");

const headers = { Authorization: "Bearer demo-token" };
const extraData = { source: "playground", biz: "report" };

const httpRequest = (options) => {
  requestLog.set(\`\${options.method.toUpperCase()} \${options.action}：\${options.file.name}\`);
  options.onProgress(35);
  setTimeout(() => {
    options.onProgress(100);
    options.onSuccess({ ok: true, data: options.data, headers: options.headers });
  }, 300);
};

const onRequestSuccess = (event) => {
  const [, file] = event.detail;
  requestLog.set(\`\${file.name} 已通过自定义请求上传\`);
};`;

const chunkCode = `<elf-upload
  :chunk-size=\${1024 * 1024}
  @progress=\${onChunkProgress}
  @success=\${onChunkSuccess}
/>`;

const chunkScript = `const chunkLog = useRef("等待分片上传");

const onChunkProgress = (event) => {
  const [percent, file] = event.detail;
  chunkLog.set(\`\${file.name}：\${percent}%\`);
};

const onChunkSuccess = (event) => {
  const [response, file] = event.detail;
  chunkLog.set(\`\${file.name} 分片完成，共 \${response.chunks ?? 0} 片\`);
};`;

const fileNames = (files: Array<{ name: string }>): string =>
  files.map((file) => file.name).join("，");

const onBasicChange = (event: CustomEvent): void => {
  const files = event.detail as Array<{ name: string }>;
  basicLog.set(files.length ? `已选择 ${files.length} 个文件：${fileNames(files)}` : "列表为空");
};

const beforeUpload = (file: File): boolean => {
  const ok = file.size <= 1024 * 1024;
  if (!ok) validateLog.set(`${file.name} 超过 1MB，已阻止上传`);
  return ok;
};

const onInvalid = (event: CustomEvent): void => {
  validateLog.set(event.detail?.message || "文件未通过校验");
};

const onManualUpdate = (event: CustomEvent): void => {
  const next = (event.detail ?? []) as unknown[];
  manualFiles.set(next);
  manualLog.set(next.length ? `待上传 ${next.length} 个文件` : "等待手动上传");
};

const onManualSuccess = (event: CustomEvent): void => {
  const [, file] = event.detail as [unknown, { name: string }];
  manualLog.set(`${file.name} 上传完成`);
};

const httpRequest = (options: UploadRequestOptions): void => {
  requestLog.set(`${options.method.toUpperCase()} ${options.action}：${options.file.name}`);
  options.onProgress(35);
  window.setTimeout(() => {
    options.onProgress(100);
    options.onSuccess({ ok: true, data: options.data, headers: options.headers });
  }, 300);
};

const onRequestSuccess = (event: CustomEvent): void => {
  const [, file] = event.detail as [unknown, { name: string }];
  requestLog.set(`${file.name} 已通过自定义请求上传`);
};

const onChunkProgress = (event: CustomEvent): void => {
  const [percent, file] = event.detail as [number, { name: string }];
  chunkLog.set(`${file.name}：${percent}%`);
};

const onChunkSuccess = (event: CustomEvent): void => {
  const [response, file] = event.detail as [{ chunks?: number }, { name: string }];
  chunkLog.set(`${file.name} 分片完成，共 ${response.chunks ?? 0} 片`);
};

const propsRows = [
  { name: "action", type: "string", default: "''", desc: "上传地址" },
  { name: "method", type: "string", default: "post", desc: "请求方法" },
  { name: "headers", type: "Headers | object", default: "{}", desc: "请求头" },
  { name: "data", type: "object | Function", default: "{}", desc: "附加表单数据" },
  { name: "withCredentials", type: "boolean", default: "false", desc: "携带凭证" },
  { name: "multiple", type: "boolean", default: "false", desc: "是否多选" },
  { name: "directory", type: "boolean", default: "false", desc: "文件夹选择" },
  { name: "drag", type: "boolean", default: "false", desc: "拖拽上传模式" },
  { name: "accept", type: "string", default: "''", desc: "文件类型，支持 .ext / mime / image/*" },
  { name: "autoUpload", type: "boolean", default: "true", desc: "选择后自动上传" },
  { name: "limit", type: "number", default: "0", desc: "文件数量上限，0 表示不限制" },
  { name: "maxSize", type: "number", default: "0", desc: "单文件大小上限，单位 byte" },
  { name: "fileNamePattern", type: "string", default: "''", desc: "文件名正则" },
  { name: "chunkSize", type: "number", default: "0", desc: "分片大小，0 表示不开启" },
  { name: "listType", type: "text|picture|picture-card", default: "text", desc: "文件列表类型" },
  { name: "showFileList", type: "boolean", default: "true", desc: "是否展示文件列表" },
  {
    name: "beforeUpload",
    type: "(file) => boolean | Promise<boolean>",
    default: "-",
    desc: "上传前拦截"
  },
  {
    name: "httpRequest / customRequest",
    type: "UploadRequestOptions => void",
    default: "-",
    desc: "完全自定义上传请求"
  },
  {
    name: "onPreview / onRemove",
    type: "Function",
    default: "-",
    desc: "Element Plus 风格回调属性"
  },
  {
    name: "onSuccess / onError / onProgress",
    type: "Function",
    default: "-",
    desc: "上传状态回调属性"
  },
  { name: "onChange / onExceed", type: "Function", default: "-", desc: "列表变化和超限回调属性" },
  {
    name: "chunkRequest",
    type: "UploadChunkRequestOptions => void",
    default: "-",
    desc: "自定义单个分片上传"
  }
];

const eventsRows = [
  { name: "change", type: "(files) => void", desc: "文件列表变化" },
  { name: "invalid", type: "({ reason, message, file }) => void", desc: "校验失败" },
  { name: "exceed", type: "(incoming, files) => void", desc: "超过数量限制" },
  { name: "progress", type: "(percent, file) => void", desc: "上传进度" },
  { name: "success", type: "(response, file, files) => void", desc: "上传成功" },
  { name: "error", type: "(error, file, files) => void", desc: "上传失败" },
  { name: "remove", type: "(file, files) => void", desc: "移除文件" },
  { name: "preview", type: "(file) => void", desc: "预览文件" }
];

const methodsRows = [
  { name: "select()", desc: "打开文件选择器" },
  { name: "submit()", desc: "手动上传 ready 文件" },
  { name: "abort(file?)", desc: "取消全部或指定文件上传" },
  { name: "handleStart(rawFile)", desc: "手动加入原始文件" },
  { name: "handleRemove(file)", desc: "手动移除文件" },
  { name: "clearFiles(statuses?)", desc: "清空全部或指定状态文件列表" }
];

const PageUpload = defineHtml(html`
  <elf-container>
    <h1>Upload 上传</h1>
    <p>文件选择与上传入口，支持多选、拖拽、图片卡片、校验、手动上传、自定义请求和分片上传。</p>

    <elf-playground title="基础上传" :code=${basicCode} :script=${basicScript}>
      <div style="display:grid;gap:12px;width:100%;max-width:720px">
        <elf-upload
          multiple
          :limit=${3}
          tip="最多选择 3 个文件，示例使用模拟上传。"
          @change=${onBasicChange}
        ></elf-upload>
        <span class="demo-state">{{ basicLog }}</span>
      </div>
    </elf-playground>

    <elf-playground title="拖拽与图片卡片" :code=${dragCode}>
      <elf-upload
        drag
        accept="image/*"
        list-type="picture-card"
        button-text="上传图片"
        tip="支持拖拽图片，也可以点击选择。"
      ></elf-upload>
    </elf-playground>

    <elf-playground title="类型、大小与文件名校验" :code=${validateCode} :script=${validateScript}>
      <div style="display:grid;gap:12px;width:100%;max-width:720px">
        <elf-upload
          accept=".pdf"
          file-name-pattern="^report-.*\\\\.pdf$"
          :maxSize=${1048576}
          :beforeUpload.prop=${beforeUpload}
          button-text="选择 PDF"
          tip="只允许 report-*.pdf，且单文件不超过 1MB。"
          @invalid=${onInvalid}
        ></elf-upload>
        <span class="demo-state">{{ validateLog }}</span>
      </div>
    </elf-playground>

    <elf-playground title="手动上传" :code=${manualCode} :script=${manualScript}>
      <div style="display:grid;gap:12px;width:100%;max-width:720px">
        <elf-upload
          :modelValue=${manualFiles}
          :autoUpload=${false}
          button-text="选择待上传文件"
          tip="选择后点击开始上传。"
          @update:modelValue=${onManualUpdate}
          @success=${onManualSuccess}
        ></elf-upload>
        <span class="demo-state">{{ manualLog }}</span>
      </div>
    </elf-playground>

    <elf-playground
      title="http-request / directory / headers / data"
      :code=${requestCode}
      :script=${requestScript}
    >
      <div style="display:grid;gap:12px;width:100%;max-width:720px">
        <elf-upload
          action="/api/upload"
          method="put"
          directory
          :headers.prop=${headers}
          :data.prop=${extraData}
          :httpRequest.prop=${httpRequest}
          tip="directory 开启文件夹选择；httpRequest 接管真实请求。"
          @success=${onRequestSuccess}
        ></elf-upload>
        <span class="demo-state">{{ requestLog }}</span>
      </div>
    </elf-playground>

    <elf-playground title="分片上传" :code=${chunkCode} :script=${chunkScript}>
      <div style="display:grid;gap:12px;width:100%;max-width:720px">
        <elf-upload
          :chunkSize=${1048576}
          button-text="选择大文件"
          tip="chunkSize 大于 0 时启用分片路径；未提供 chunkRequest 时使用模拟分片。"
          @progress=${onChunkProgress}
          @success=${onChunkSuccess}
        ></elf-upload>
        <span class="demo-state">{{ chunkLog }}</span>
      </div>
    </elf-playground>

    <h2>API</h2>
    <elf-props-table title="Upload Props" :rows="propsRows"></elf-props-table>
    <elf-props-table title="Upload Events" :rows="eventsRows"></elf-props-table>
    <elf-props-table title="Upload Methods" :rows="methodsRows"></elf-props-table>
  </elf-container>
`);

export { PageUpload };
