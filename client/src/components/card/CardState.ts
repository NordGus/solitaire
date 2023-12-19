import { AttachLayerEvent, CardMagnetizeToEvent, CardMovedEvent } from "@/types.ts";
import Card from "@Components/Card.ts";

export default abstract class CardState {
  protected _card: Card;

  protected constructor(card: Card) {
    this._card = card;
  }

  abstract onStartMovement(event: MouseEvent): void;
  abstract onMove(event: MouseEvent): void;
  abstract onStopMovement(): void;
  abstract onMagnetize(event: CustomEvent<CardMagnetizeToEvent>): void;
  abstract onAttach(event: CustomEvent<AttachLayerEvent>): void;
  abstract onCardMoved(event: CustomEvent<CardMovedEvent>): void;
}
