import { defineHtml, html, useComponents } from "@elfui/core";

import { PageInfiniteScrollEx1 } from "./ex1";
import { PageInfiniteScrollEx2 } from "./ex2";
import { PageInfiniteScrollEx3 } from "./ex3";

const propsRows = [
  { name: "height", type: "string | number", default: "280px", desc: "内部滚动视口高度" },
  { name: "distance", type: "number", default: "0", desc: "距底部多少像素时触发加载" },
  { name: "delay", type: "number", default: "200", desc: "触发 load 前的防抖时间" },
  { name: "loading", type: "boolean", default: "false", desc: "由调用方控制，避免重复加载" },
  { name: "disabled", type: "boolean", default: "false", desc: "停止监听与加载" },
  { name: "immediate", type: "boolean", default: "false", desc: "挂载时检查是否需要加载" },
  { name: "container", type: "string | HTMLElement", default: "-", desc: "指定外部滚动容器" }
];

const eventRows = [{ name: "load", type: "() => void", desc: "滚动到阈值时触发" }];

const directiveRows = [
  { name: "v-infinite-scroll", type: "() => void", default: "-", desc: "接近容器底部时执行的加载函数" },
  { name: "infinite-scroll-disabled", type: "boolean", default: "false", desc: "暂停指令加载" },
  { name: "infinite-scroll-distance", type: "number", default: "0", desc: "触发距离" },
  { name: "infinite-scroll-delay", type: "number", default: "200", desc: "触发延迟" },
  { name: "infinite-scroll-immediate", type: "boolean", default: "true", desc: "挂载后立即检查容器" }
];

useComponents({
  "page-infinite-scroll-ex1": PageInfiniteScrollEx1,
  "page-infinite-scroll-ex2": PageInfiniteScrollEx2,
  "page-infinite-scroll-ex3": PageInfiniteScrollEx3
});

const PageInfiniteScroll = defineHtml(html`
  <elf-container>
    <h1>InfiniteScroll 无限滚动</h1>
    <p>将连续信息流放入独立滚动视口，接近底部时请求下一页数据。</p>

    <page-infinite-scroll-ex1 />

    <page-infinite-scroll-ex2 />

    <page-infinite-scroll-ex3 />

    <h2>API</h2>
    <elf-props-table title="属性" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="事件" :rows=${eventRows}></elf-props-table>
    <elf-props-table title="指令" :rows=${directiveRows}></elf-props-table>
  </elf-container>
`);

export { PageInfiniteScroll };
