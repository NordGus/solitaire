import { AttachLayerEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";
import RestingSlot from "@Components/RestingSlot.ts";

// TODO: Implement future logic to connect cards here.
export default class RestingState extends CardState {
  constructor(card: Card) {
    super(card);

    this._card.classList.toggle("cursor-grab", false);

    if (this._card.covers instanceof RestingSlot) {
      this._card.layer = 1;
    } else if (this._card.covers instanceof Card && this._card.covers.state instanceof RestingState) {
      this._card.layer = this._card.covers.layer + 1;
    } else {
      throw new Error("invalid CardState");
    }

    this._card.style.zIndex = `${this._card.layer}`;
    this._card.removeAttribute("draggable");
  }

  onCardMovementSettled(): void {
    if (this._card.family !== "arcana" && this._card.number > 1) return;
    if (this._card.family === "arcana" && (this._card.number < 21 || this._card.number > 0)) return;

    console.log("root card");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDragStart(_event: MouseEvent): void {}
  onDragEnd(): void {}
}
