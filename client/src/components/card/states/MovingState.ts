import { AttachLayerEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";
import InPlayState from "@Components/card/states/InPlayState.ts";

export default class MovingState extends CardState {
  constructor(card: Card) { super(card) }

  onDragEnd(): void { this._card.state = new InPlayState(this._card) }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDragStart(_event: DragEvent): void {}
  onCardMovementSettled(): void {}
}
