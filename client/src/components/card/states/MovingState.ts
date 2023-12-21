import { AttachLayerEvent, StackableEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";
import InPlayState from "@Components/card/states/InPlayState.ts";

export default class MovingState extends CardState {
  constructor(card: Card) { super(card) }

  // TODO: make the auto order feature seen in the video archive.
  onDragEnd(): void {
    const covers = this._card.covers;
    const parent = this._card.parentElement!;

    this._card.state = new InPlayState(this._card);
    this._card.covers = null;

    if (!(covers instanceof Card)) return;

    if (parent.childElementCount > 1) {
      const covers = parent.children[parent.childElementCount - 2] as Card;

      this._card.covers = covers;
      covers.dispatchEvent(new CustomEvent<StackableEvent>("stackable:push", { detail: { card: this._card } }));
    }

    // Starts recursion to append cards in the stack that continues the flush
    covers.dispatchEvent(new CustomEvent<StackableEvent>("card:flush:append", { detail: { card: this._card } }));

    // TODO: dispatch card:movement:settled event
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDragStart(_event: DragEvent): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFlushAppend(_event: CustomEvent<StackableEvent>): void {}
  onCardMovementSettled(): void {}
}
