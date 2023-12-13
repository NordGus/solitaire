import GameCard from "@Components/GameCard.ts";
import GameSlot from "@Components/GameSlot.ts";

export type CardFamily = "swords" | "clubs" | "golds" | "cups" | "arcana"
export type CardNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21
export type SlotNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type CardMovedEvent = {
  card: GameCard,
  state: {
    card: { rect: DOMRect }
  }
}
export type CardMagnetizeToEvent = {
  card: GameCard,
  target: GameCard | GameSlot,
  state: {
    card: { rect: DOMRect },
    target: { rect: DOMRect }
  }
}
