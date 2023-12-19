import { AttachLayerEvent, CardMagnetizeToEvent, CardMovedEvent, StackableEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";
import InPlayState from "@Components/card/states/InPlayState.ts";
import RestingState from "@Components/card/states/RestingState.ts";
import RestingSlot from "@Components/RestingSlot.ts";

export default class LoadedState extends CardState {
  constructor(card: Card) { super(card) }

  onAttach(event: CustomEvent<AttachLayerEvent>): void {
    if (this._card.layer !== event.detail.layer) return;

    const rect = this._card.covers.getBoundingClientRect();

    this._card.style.top = `${rect.top + (this._card.covers instanceof Card ? Card.TOP_OFFSET : 0)}px`;
    this._card.style.left = `${rect.left}px`;

    this._card.dispatchEvent(new CustomEvent<StackableEvent>(
      "stackable:push",
      { bubbles: true, detail: { stackable: this._card.covers, caller: this._card } }
    ));

    if (this._card.covers instanceof RestingSlot) this._card.state = new RestingState(this._card);
    else this._card.state = new InPlayState(this._card);
  }

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
