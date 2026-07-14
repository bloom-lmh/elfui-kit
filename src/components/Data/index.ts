// Data 展示组件
import { registerComponents } from "elfui";

import { Card } from "./Card/index";
import { Carousel } from "./Carousel/index";
import { CarouselItem } from "./CarouselItem/index";
import { Collapse } from "./Collapse/index";
import { CollapseItem } from "./CollapseItem/index";
import { Countdown } from "./Countdown/index";
import { Descriptions } from "./Descriptions/index";
import { DescriptionsItem } from "./DescriptionsItem/index";
import { Divider } from "./Divider/index";
import { Empty } from "./Empty/index";
import { Image } from "./Image/index";
import { InfiniteScroll } from "./InfiniteScroll/index";
import { registerInfiniteScrollDirective } from "./InfiniteScroll/directive";
import { Pagination } from "./Pagination/index";
import { Progress } from "./Progress/index";
import { Result } from "./Result/index";
import { Skeleton } from "./Skeleton/index";
import { Statistic } from "./Statistic/index";
import { Table } from "./Table/index";
import { Timeline } from "./Timeline/index";
import { Transfer } from "./Transfer/index";
import { Tree } from "./Tree/index";
import { Watermark } from "./Watermark/index";

registerComponents(
  Card,
  Carousel,
  CarouselItem,
  Collapse,
  CollapseItem,
  Countdown,
  Descriptions,
  DescriptionsItem,
  Divider,
  Empty,
  Image,
  InfiniteScroll,
  Pagination,
  Progress,
  Result,
  Skeleton,
  Statistic,
  Table,
  Timeline,
  Transfer,
  Tree,
  Watermark
);

registerInfiniteScrollDirective();

export { infiniteScrollDirective, registerInfiniteScrollDirective } from "./InfiniteScroll/directive";
export type {
  InfiniteScrollDirectiveHandler,
  InfiniteScrollDirectiveOptions,
  InfiniteScrollDirectiveValue,
  InfiniteScrollEmits,
  InfiniteScrollProps,
  InfiniteScrollSlots
} from "./InfiniteScroll/types";
