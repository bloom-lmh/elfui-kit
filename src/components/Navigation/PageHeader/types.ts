export interface PageHeaderProps {
  title: string;
  content: string;
  icon: string;
}

export interface PageHeaderSlots {
  icon?: unknown;
  title?: unknown;
  content?: unknown;
  extra?: unknown;
  breadcrumb?: unknown;
}
