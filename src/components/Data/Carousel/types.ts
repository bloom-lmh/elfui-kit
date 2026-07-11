// elf-carousel 类型定义

export type CarouselEffect = "slide" | "fade";
export type CarouselArrowStyle = "circle" | "square" | "ghost";
export type CarouselIndicatorType = "dot" | "line" | "number";

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
}
