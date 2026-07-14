// 布局组件统一注册入口

import { registerComponents } from "elfui";

import { Aside } from "./Aside/index";
import { Container } from "./Container/index";
import { Flex } from "./Flex/index";
import { Footer } from "./Footer/index";
import { Grid } from "./Grid/index";
import { GridItem } from "./GridItem/index";
import { Header } from "./Header/index";
import { Layout } from "./Layout/index";
import { Main } from "./Main/index";
import { Scrollbar } from "./Scrollbar/index";
import { Splitter, SplitterPanel } from "./Splitter/index";
import { Sticky } from "./Sticky/index";

registerComponents(
  Container,
  Flex,
  Grid,
  GridItem,
  Layout,
  Header,
  Aside,
  Main,
  Footer,
  Sticky,
  Scrollbar,
  Splitter,
  SplitterPanel
);
