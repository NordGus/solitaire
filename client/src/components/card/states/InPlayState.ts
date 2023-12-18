import collides from "@/helpers/collides.ts";
import getIntersectionRect from "@/helpers/getIntersectionRect.ts";
import rectArea from "@/helpers/rectArea.ts";
import { AttachLayerEvent, CardMagnetizeToEvent, CardMovedEvent, StackableEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";
import MovingState from "@Components/card/states/MovingState.ts";

export default class InPlayState extends CardState {
  private readonly currentMagnetism: number;

  constructor(card: Card, currentMagnetism?: number) {
    super(card);

    this.currentMagnetism = currentMagnetism ? currentMagnetism : 0;
  }

  onStartMovement(event: MouseEvent): CardState {
    if (this._card.coveredBy !== null) return this;

    return new MovingState(this._card, event.clientX, event.clientY);
  }

  onCardMoved(event: CustomEvent<CardMovedEvent>): CardState {
    if (this._card.coveredBy !== null) return this;
    if (this._card === event.detail.card) return this;
    if (this._card.family === "arcana" && event.detail.card.family !== "arcana") return this;
    if (this._card.number === event.detail.card.number) return this;
    if (this._card.number < event.detail.card.number - 1) return this;
    if (this._card.number > event.detail.card.number + 1) return this;

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

  onMagnetize(event: CustomEvent<CardMagnetizeToEvent>): CardState {
    if (this._card.number !== event.detail.card.number) return this;
    if (this._card.family !== event.detail.card.family) return this;

    const target = event.detail.target;
    const rect = target.getBoundingClientRect();
    const covers = this._card.covers;
    const targetMagnetism: number = rectArea(getIntersectionRect(
      event.detail.state.card.rect,
      event.detail.state.target.rect
    ));

    if (this.currentMagnetism > targetMagnetism) return this;

    this._card.style.top = `${rect.top + (target instanceof Card ? Card.TOP_OFFSET : 0)}px`;
    this._card.style.left = `${rect.left}px`;

    // uncover previous this.covers
    document.dispatchEvent(new CustomEvent<StackableEvent>(
      "stackable:pop",
      { detail: { stackable: covers, caller: this._card } }
    ));

    // cover new this.covers
    document.dispatchEvent(new CustomEvent<StackableEvent>(
      "stackable:push",
      { detail: { stackable: target, caller: this._card } }
    ));

    this._card.setCovers(target);

    return new InPlayState(this._card, targetMagnetism);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): CardState { return this }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove(_event: MouseEvent): CardState { return this }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStopMovement(): CardState { return this }
}
