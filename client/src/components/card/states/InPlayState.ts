import { AttachLayerEvent, RecallCardEvent, StackableEvent } from "@/types.ts";
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
    const card = event.detail.card;
    const covers = this._card.covers;

    if (!(covers instanceof Card) && covers !== null) return;
    if (this._card.coveredBy !== card) return;

    this._card.dispatchEvent(new Event("stackable:pop"));

    if (this._card.family === "arcana" && card.family !== "arcana") return;
    if (this._card.family !== "arcana" && card.family === "arcana") return;
    if (this._card.number === card.number) return;
    if (this._card.number < card.number - 1) return;
    if (this._card.number > card.number + 1) return;

    card.dispatchEvent(new CustomEvent<StackableEvent>("stackable:push", { detail: { card: this._card } }));
    card.dispatchEvent(new CustomEvent<StackableEvent>("slot:push", { bubbles: true, detail: { card: this._card } }));

    this._card.style.zIndex = `${this._card.layer}`;

    if (covers === null) return; // breaking recursion when the stack is empty.
    covers.dispatchEvent(new CustomEvent<StackableEvent>("card:flush:append", { detail: { card: this._card } }));
  }

  onRecallCard(event: CustomEvent<RecallCardEvent>): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): void {}
  onDragEnd(): void {}
}
