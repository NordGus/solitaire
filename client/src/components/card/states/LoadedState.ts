import { AttachLayerEvent, StackableEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";
import InPlayState from "@Components/card/states/InPlayState.ts";
import RestingState from "@Components/card/states/RestingState.ts";
import RestingSlot from "@Components/RestingSlot.ts";
import Slot from "@Components/Slot.ts";

export default class LoadedState extends CardState {
  constructor(card: Card) { super(card) }

  onAttach(event: CustomEvent<AttachLayerEvent>): void {
    if (this._card.layer !== event.detail.layer) return;
    if (this._card.covers === null) throw new Error("invalid initial state");

    const covers = this._card.covers;

    if (covers instanceof RestingSlot) this._card.covers = null;
    if (covers instanceof Slot) this._card.covers = null;

    this._card.style.removeProperty("left");
    this._card.style.removeProperty("top");

    covers.dispatchEvent(new CustomEvent<StackableEvent>("slot:push", { bubbles: true, detail: { card: this._card } }));
    covers.dispatchEvent(new CustomEvent<StackableEvent>("stackable:push", { detail: { card: this._card } }));

    if (covers instanceof RestingSlot) this._card.state = new RestingState(this._card);
    else this._card.state = new InPlayState(this._card);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDragStart(_event: DragEvent): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFlushAppend(_event: StackableEvent): void {}
  onDragEnd(): void {}
  onCardMovementSettled(): void {}
}
