import Card from "@Components/Card.ts";

export type CardFamily = "swords" | "clubs" | "golds" | "cups" | "arcana";
export type CardNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21;
export type SlotNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type AttachLayerEvent = { layer: number };

export type StackableEvent = { card: Card };
export type RecallCardEvent = { number: CardNumber, family: CardFamily };
