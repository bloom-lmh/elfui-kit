// elf-carousel 类型定义

export type CarouselEffect = "slide" | "fade";
export type CarouselArrowStyle = "circle" | "square" | "ghost";
export type CarouselIndicatorType = "dot" | "line" | "number";
export type CarouselArrow = "always" | "hover" | "never";
export type CarouselTrigger = "hover" | "click";
export type CarouselDirection = "horizontal" | "vertical";
export type CarouselIndicatorPosition = "" | "outside" | "none";

export interface CarouselProps {
  effect: CarouselEffect;
  autoplay: boolean;
  interval: number;
  loop: boolean;
  showArrow: CarouselArrowStyle | false;
  showIndicator: boolean;
  indicatorType: CarouselIndicatorType;
  /** 轮播高度 */
  height: string;
  /** 过渡时长 */
  duration: string;
  /** 悬停暂停 */
  pauseOnHover: boolean;
  /** 圆角 */
  radius: string;
  /** Initial zero-based slide index. */
  initialIndex: number;
  /** How indicators activate a slide. */
  trigger: CarouselTrigger;
  /** When navigation arrows are visible. */
  arrow: CarouselArrow;
  /** Indicator placement; `none` hides the indicators. */
  indicatorPosition: CarouselIndicatorPosition;
  /** Axis used by the slide transition. */
  direction: CarouselDirection;
  /** Accessible label for the carousel region. */
  ariaLabel: string;
}
