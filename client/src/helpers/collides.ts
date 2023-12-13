import { Rect } from "@/types.ts";

export default function collides(body: Rect, collider: Rect): boolean {
  const bodyPoints = [
    { x: body.left, y: body.top },     // top left
    { x: body.right, y: body.top },    // top right
    { x: body.left, y: body.bottom },  // bottom left
    { x: body.right, y: body.bottom }, // bottom right
  ]

  return bodyPoints
    .filter((value: {x: number, y: number}) => value.y > collider.top)
    .filter((value: {x: number, y: number}) => value.y < collider.bottom)
    .filter((value: {x: number, y: number}) => value.x > collider.left)
    .filter((value: {x: number, y: number}) => value.x < collider.right)
    .length > 0
}
