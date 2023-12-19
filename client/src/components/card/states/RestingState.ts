import { AttachLayerEvent, CardMagnetizeToEvent, CardMovedEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";
import RestingSlot from "@Components/RestingSlot.ts";

// TODO: Implement future logic to connect cards here.
export default class RestingState extends CardState {
  constructor(card: Card) {
    super(card);

    this._card.classList.toggle("cursor-move", false);

    if (this._card.covers instanceof RestingSlot) {
      this._card.layer = 1;
    } else if (this._card.covers instanceof Card && this._card.covers.state instanceof RestingState) {
      this._card.layer = this._card.covers.layer + 1;
    } else {
      throw new Error("invalid CardState");
    }

    this._card.style.zIndex = `${this._card.layer}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStartMovement(_event: MouseEvent): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove(_event: MouseEvent): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStopMovement(): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMagnetize(_event: CustomEvent<CardMagnetizeToEvent>): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCardMoved(_event: CustomEvent<CardMovedEvent>): void {}
}
