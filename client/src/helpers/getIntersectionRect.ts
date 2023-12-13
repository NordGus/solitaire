import { Rect } from "@/types.ts";

export default function getIntersectionRect(rect1: Rect, rect2: Rect): Rect {
  return {
    top: rect1.top >= rect2.top ? rect1.top : rect2.top,
    bottom: rect1.bottom <= rect2.bottom ? rect1.bottom : rect2.bottom,
    left: rect1.left >= rect2.left ? rect1.left : rect2.left,
    right: rect1.right <= rect2.right ? rect1.right : rect2.right,
  }
}
