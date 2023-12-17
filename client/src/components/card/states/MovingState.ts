import { AttachLayerEvent, CardMagnetizeToEvent, CardMovedEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";
import InPlayState from "@Components/card/states/InPlayState.ts";
import SettlingState from "@Components/card/states/SettlingState.ts";
import RestingSlot from "@Components/RestingSlot.ts";
import Slot from "@Components/Slot.ts";

export default class MovingState extends CardState {
  private x: number
  private y: number

  constructor(card: Card, x: number, y: number) {
    super(card);

    this.x = x;
    this.y = y;
  }

  onMove(event: MouseEvent): CardState {
    const x = event.clientX;
    const y = event.clientY;

    this._card.style.top = `${this._card.offsetTop - (this.y - y)}px`;
    this._card.style.left = `${this._card.offsetLeft - (this.x - x)}px`;
    this.x = x;
    this.y = y;

    return this;
  }

  onStopMovement(): CardState {
    const cardRect = this._card.getBoundingClientRect();
    const oldRect = this._card.covers.getBoundingClientRect();
    const settling = new SettlingState(this._card);

    this._card.setState(settling);

    document.dispatchEvent(new CustomEvent<CardMovedEvent>(
      "card:moved",
      {
        detail: {
          card: this._card,
          state: {
            card: { rect: { top: cardRect.top, bottom: cardRect.bottom, right: cardRect.right, left: cardRect.left } }
          }
        }
      }
    ));

    if (this._card.state !== settling) return this._card.state;
    else { // re-magnetizes to old position.
      this._card.style.top = `${oldRect.top + (this._card.covers instanceof Slot || RestingSlot ? 0 : Card.TOP_OFFSET)}px`;
      this._card.style.left = `${oldRect.left}px`;

      return new InPlayState(this._card);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): CardState  { return this }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStartMovement(_event: MouseEvent): CardState  { return this }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMagnetize(_event: CustomEvent<CardMagnetizeToEvent>): CardState  { return this }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCardMoved(_event: CustomEvent<CardMovedEvent>): CardState  { return this }
}
