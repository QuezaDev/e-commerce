export type OverlayName =
  | "menu"
  | "search"
  | "favorites"
  | "cart"
  | "tracking"
  | "notice"
  | "notify"
  | "policy"
  | null;

export interface CartLine {
  key: string;
  productId: string;
  size?: string;
  color: string;
  quantity: number;
}

export interface NoticeContent {
  title: string;
  message: string;
}
