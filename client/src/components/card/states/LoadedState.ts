import { AttachLayerEvent, CardMagnetizeToEvent, CardMovedEvent, SlotStackEvent, StackableEvent } from "@/types.ts";
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

    if (this._card.covers instanceof Slot) {
      this._card.style.removeProperty("left");
      this._card.style.removeProperty("top");

      this._card.covers.dispatchEvent(new CustomEvent<SlotStackEvent>(
        "slot:push",
        { detail: { card: this._card } }
      ));
    } else if (this._card.covers instanceof RestingSlot) { // TODO: refactor to follow the standard from the slots
      this._card.style.removeProperty("left");
      this._card.style.removeProperty("top");
      this._card.covers.appendChild(this._card);
    } else {
      this._card.style.removeProperty("left");
      this._card.style.top = `${Card.TOP_OFFSET * (this._card.layer - 1)}px`;

      this._card.covers.parentElement!.dispatchEvent(new CustomEvent<SlotStackEvent>(
        "slot:push",
        { detail: { card: this._card } }
      ));
    }

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
  onStopMovement(): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMagnetize(_event: CustomEvent<CardMagnetizeToEvent>): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCardMoved(_event: CustomEvent<CardMovedEvent>): void {}
  onCardMovementSettled(): void {}
}
