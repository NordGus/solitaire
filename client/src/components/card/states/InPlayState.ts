import { AttachLayerEvent, StackableEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";
import MovingState from "@Components/card/states/MovingState.ts";

export default class InPlayState extends CardState {
  constructor(card: Card) {
    super(card);

    this._card.style.zIndex = `${this._card.layer}`;
  }

  onDragStart(event: DragEvent): void {
    if (this._card.coveredBy !== null) return;

    const transfer = event.dataTransfer!;

    transfer.setData("family", this._card.family);
    transfer.setData("number", `${this._card.number}`);

    this._card.state = new MovingState(this._card);
  }


  onFlushAppend(event: CustomEvent<StackableEvent>): void {

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): void {}
  onDragEnd(): void {}
  onCardMovementSettled(): void {}
}
