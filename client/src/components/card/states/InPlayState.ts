import collides from "@/helpers/collides.ts";
import getIntersectionRect from "@/helpers/getIntersectionRect.ts";
import rectArea from "@/helpers/rectArea.ts";
import { AttachLayerEvent, CardMagnetizeToEvent, CardMovedEvent, StackableEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";
import MovingState from "@Components/card/states/MovingState.ts";
import Slot from "@Components/Slot.ts";

export default class InPlayState extends CardState {
  private readonly currentMagnetism: number;

  constructor(card: Card, currentMagnetism?: number) {
    super(card);

    this.currentMagnetism = currentMagnetism ? currentMagnetism : 0;
  }

  onMagnetize(event: CustomEvent<CardMagnetizeToEvent>): CardState  {
    if (this._card.number !== event.detail.card.number) return this;
    if (this._card.family !== event.detail.card.family) return this;

    const rect = event.detail.target.getBoundingClientRect();
    const targetMagnetism: number = rectArea(getIntersectionRect(
      event.detail.state.card.rect,
      event.detail.state.target.rect
    ));

    if (this.currentMagnetism > targetMagnetism) return this;

    this._card.style.top = `${rect.top + (this._card.covers instanceof Slot ? 0 : Card.TOP_OFFSET)}px`;
    this._card.style.left = `${rect.left}px`;

    // uncover previous this.covers
    document.dispatchEvent(new CustomEvent<StackableEvent>(
      "stackable:pop",
      { detail: { stackable: this._card.covers, caller: this._card } }
    ));

    // cover new this.covers
    document.dispatchEvent(new CustomEvent<StackableEvent>(
      "stackable:push",
      { detail: { stackable: event.detail.target, caller: this._card } }
    ));

    this._card.setCovers(event.detail.target);

    return new InPlayState(this._card, targetMagnetism);
  }

  onStartMovement(event: MouseEvent): CardState  {
    if (this._card.coveredBy !== null) return this;

    return new MovingState(this._card, event.clientX, event.clientY);
  }

  onCardMoved(event: CustomEvent<CardMovedEvent>): CardState {
    if (this._card.coveredBy !== null) return this;
    if (this._card.number === event.detail.card.number && this._card.family === event.detail.card.family) return this;

    const rect = this._card.getBoundingClientRect();
    const eventInit: CustomEventInit<CardMagnetizeToEvent> = {
      detail: {
        target: this._card,
        card: event.detail.card,
        state: {
          card: event.detail.state.card,
          target: { rect: { top: rect.top, bottom: rect.bottom, right: rect.right, left: rect.left } }
        }
      }
    };

    if (collides(event.detail.state.card.rect, this._card.getBoundingClientRect())) {
      document.dispatchEvent(new CustomEvent<CardMagnetizeToEvent>("card:magnetize:to", eventInit));
    }

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): CardState { return this }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove(_event: MouseEvent): CardState { return this }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStopMovement(): CardState { return this }
}
