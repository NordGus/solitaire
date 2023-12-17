import { AttachLayerEvent, CardMagnetizeToEvent, CardMovedEvent } from "@/types.ts";
import Card from "@Components/Card.ts";

export default abstract class CardState {
  protected _card: Card;

  constructor(card: Card) {
    this._card = card;
  }

  abstract onStartMovement(event: MouseEvent): CardState;
  abstract onMove(event: MouseEvent): CardState;
  abstract onStopMovement(): CardState;
  abstract onMagnetize(event: CustomEvent<CardMagnetizeToEvent>): CardState;
  abstract onAttach(event: CustomEvent<AttachLayerEvent>): CardState;
  abstract onCardMoved(event: CustomEvent<CardMovedEvent>): CardState;
}
