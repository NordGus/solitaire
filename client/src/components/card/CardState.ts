import { AttachLayerEvent, RecallCardEvent, StackableEvent } from "@/types.ts";
import Card from "@Components/Card.ts";

export default abstract class CardState {
  protected _card: Card;

  protected constructor(card: Card) {
    this._card = card;
  }

  abstract onAttach(event: CustomEvent<AttachLayerEvent>): void;
  abstract onDragStart(event: DragEvent): void;
  abstract onDragEnd(): void;
  abstract onFlushAppend(event: CustomEvent<StackableEvent>): void;
  abstract onRecallCard(event: CustomEvent<RecallCardEvent>): void;
}
