import { AttachLayerEvent, CardMagnetizeToEvent, CardMovedEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";
import InPlayState from "@Components/card/states/InPlayState.ts";

export default class MovingState extends CardState {
  static MOVEMENT_Z_INDEX: number = 60

  private x: number
  private y: number

  constructor(card: Card, x: number, y: number) {
    super(card);

    this.x = x;
    this.y = y;

    this._card.style.zIndex = `${MovingState.MOVEMENT_Z_INDEX}`;
  }

  onMove(event: MouseEvent): void {
    const x = event.clientX;
    const y = event.clientY;

    this._card.style.top = `${this._card.offsetTop - (this.y - y)}px`;
    this._card.style.left = `${this._card.offsetLeft - (this.x - x)}px`;
    this.x = x;
    this.y = y;
  }

  onStopMovement(): void {
    const covers = this._card.covers;
    const cardRect = this._card.getBoundingClientRect();
    const oldRect = covers.getBoundingClientRect();
    const state = new InPlayState(this._card);

    this._card.state = state;

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

    if (this._card.state === state) { // re-magnetizes to old position.
      this._card.style.top = `${oldRect.top + (covers instanceof Card ? Card.TOP_OFFSET : 0)}px`;
      this._card.style.left = `${oldRect.left}px`;

      this._card.state = new InPlayState(this._card);
    }

    // TODO: Implement an event to force attachment to resting cards.
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStartMovement(_event: MouseEvent): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMagnetize(_event: CustomEvent<CardMagnetizeToEvent>): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCardMoved(_event: CustomEvent<CardMovedEvent>): void {}
}
