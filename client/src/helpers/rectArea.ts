import { Rect } from "@/types.ts";

export default function rectArea(rect: Rect): number {
  return (rect.right + (-rect.left)) * (rect.bottom + (-rect.top))
}
