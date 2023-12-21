import { AttachLayerEvent, RecallCardEvent, StackableEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";

export default class RestingState extends CardState {
  constructor(card: Card) {
    super(card);

    this._card.classList.toggle("cursor-grab", false);
    this._card.setAttribute("draggable", "false");

    this._card.style.zIndex = `${this._card.layer}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDragStart(_event: MouseEvent): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFlushAppend(_event: CustomEvent<StackableEvent>): void {}
  onDragEnd(): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRecallCard(_event: CustomEvent<RecallCardEvent>): void {}
}
