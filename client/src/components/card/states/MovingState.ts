import { AttachLayerEvent, StackableEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";
import InPlayState from "@Components/card/states/InPlayState.ts";

export default class MovingState extends CardState {
  constructor(card: Card) { super(card) }

  onDragEnd(): void {
    const covers = this._card.covers;
    const parent = this._card.parentElement!;

    this._card.state = new InPlayState(this._card);
    this._card.covers = null;

    if (parent.childElementCount > 1) {
      const covers = parent.children[parent.childElementCount - 2] as Card;

      this._card.covers = covers;
      covers.dispatchEvent(new CustomEvent<StackableEvent>("stackable:push", { detail: { card: this._card } }));
    }

    if (!(covers instanceof Card)) return;

    // Starts recursion to append cards in the stack that continues the flush
    covers.dispatchEvent(new CustomEvent<StackableEvent>("card:flush:append", { detail: { card: this._card } }));

    this._card.dispatchEvent(new Event("card:movement:settled", { bubbles: true }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDragStart(_event: DragEvent): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFlushAppend(_event: CustomEvent<StackableEvent>): void {}
}
