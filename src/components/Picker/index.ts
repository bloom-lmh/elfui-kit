// Picker 选择器组件
import { registerComponents } from "elfui";

import { Calendar } from "./Calendar/index";
import { ColorPicker } from "./ColorPicker/index";
import { DatePicker } from "./DatePicker/index";
import { TimePicker } from "./TimePicker/index";

registerComponents(Calendar, ColorPicker, DatePicker, TimePicker);
