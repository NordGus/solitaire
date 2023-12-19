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

    if (this._card.covers instanceof Slot) {
      this._card.layer = 1;
    } else if (this._card.covers instanceof Card && this._card.covers.state instanceof InPlayState) {
      this._card.layer = this._card.covers.layer + 1;
    } else {
      throw new Error("invalid CardState");
    }

    this._card.style.zIndex = `${this._card.layer}`;
  }

  onStartMovement(event: MouseEvent): void {
    if (this._card.coveredBy !== null) return;

    this._card.state = new MovingState(this._card, event.clientX, event.clientY);
  }

  onCardMoved(event: CustomEvent<CardMovedEvent>): void {
    if (this._card.coveredBy !== null) return;
    if (this._card === event.detail.card) return;
    if (this._card.family === "arcana" && event.detail.card.family !== "arcana") return;
    if (this._card.family !== "arcana" && event.detail.card.family === "arcana") return;
    if (this._card.number === event.detail.card.number) return;
    if (this._card.number < event.detail.card.number - 1) return;
    if (this._card.number > event.detail.card.number + 1) return;

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
  }

  onMagnetize(event: CustomEvent<CardMagnetizeToEvent>): void {
    if (this._card.number !== event.detail.card.number) return;
    if (this._card.family !== event.detail.card.family) return;

    const target = event.detail.target;
    const rect = target.getBoundingClientRect();
    const targetMagnetism: number = rectArea(getIntersectionRect(
      event.detail.state.card.rect,
      event.detail.state.target.rect
    ));

    if (this.currentMagnetism > targetMagnetism) return;

    this._card.style.top = `${rect.top + (target instanceof Card ? Card.TOP_OFFSET : 0)}px`;
    this._card.style.left = `${rect.left}px`;

    // uncover previous this.covers
    document.dispatchEvent(new CustomEvent<StackableEvent>(
      "stackable:pop",
      { detail: { stackable: this._card.covers, caller: this._card } }
    ));

    // cover new this.covers
    document.dispatchEvent(new CustomEvent<StackableEvent>(
      "stackable:push",
      { detail: { stackable: target, caller: this._card } }
    ));

    this._card.covers = target;
    this._card.state = new InPlayState(this._card, targetMagnetism);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove(_event: MouseEvent): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStopMovement(): void {}
}
