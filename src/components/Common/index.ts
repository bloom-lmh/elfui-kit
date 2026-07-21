// 公共展示组件
import { registerComponents } from "elfui";

import { Playground } from "./Playground/index";
import { PropsTable } from "./PropsTable/index";
import { DocsToc } from "./DocsToc/index";

registerComponents(Playground, PropsTable, DocsToc);
