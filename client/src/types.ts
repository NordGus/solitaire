import RestingSlot from "@Components/RestingSlot.ts";
import Card from "@Components/Card.ts";
import Slot from "@Components/Slot.ts";

export type CardFamily = "swords" | "clubs" | "golds" | "cups" | "arcana";
export type CardNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21;
export type SlotNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Rect = { top: number, bottom: number, left: number, right: number };

export type AttachLayerEvent = { layer: number };
export type CardMovedEvent = { card: Card, state: { card: { rect: Rect } } };
export type CardMagnetizeToEvent = {
  card: Card,
  target: Card | Slot,
  state: {
    card: { rect: Rect },
    target: { rect: Rect }
  }
};
export type StackableEvent = { stackable: Card | Slot | RestingSlot, caller: Card };
