import { defineHtml, html, useRef } from "elfui";

const density = useRef("md");

const code2 = `<elf-segmented block size="lg" :options.prop="['紧凑', '默认', '宽松']" :modelValue.prop="density" />`;

const onDensityUpdate = (event: CustomEvent): void => density.set(String(event.detail || ""));

const PageSegmentedEx2 = defineHtml(html`
<elf-playground title="block / size" :code=${code2}>
            <div style="width:360px">
                <elf-segmented
                    block
                    size="lg"
                    :options.prop=${["紧凑", "默认", "宽松"]}
                    :modelValue=${density}
                    @update:modelValue=${onDensityUpdate}
                ></elf-segmented>
            </div>
        </elf-playground>
`);

export { PageSegmentedEx2 };
