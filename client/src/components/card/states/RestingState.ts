import { AttachLayerEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";

// TODO: Implement future logic to connect cards here.
export default class RestingState extends CardState {
  constructor(card: Card) {
    super(card);

    this._card.classList.toggle("cursor-grab", false);
    this._card.removeAttribute("draggable");

    this._card.style.zIndex = `${this._card.layer}`;
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
