import { RecallCardEvent, SlotNumber, StackableEvent } from "@/types.ts";
import BlockingSlot from "@Components/BlockingSlot.ts";
import Card from "@Components/Card.ts";

export default class Slot extends HTMLElement {
  public readonly number: SlotNumber

  constructor() {
    super();

    this.number = parseInt(this.dataset.number!) as SlotNumber
  }

  connectedCallback(): void {
    this.addEventListener("dragenter", this.onDrag.bind(this));
    this.addEventListener("dragover", this.onDrag.bind(this));
    this.addEventListener("drop", this.onDrop.bind(this));

    this.addEventListener("slot:push", this.onPush.bind(this) as EventListener);
    this.addEventListener("slot:pop", this.onPop.bind(this));

    document.addEventListener("recall:cards", this.onRecallCards.bind(this) as EventListener);

    this.dispatchEvent(new Event("game:element:connected", { bubbles: true }));
  }

  disconnectedCallback(): void {
    this.removeEventListener("dragenter", this.onDrag.bind(this));
    this.removeEventListener("dragover", this.onDrag.bind(this));
    this.removeEventListener("drop", this.onDrop.bind(this));

    this.removeEventListener("slot:push", this.onPush.bind(this) as EventListener);
    this.removeEventListener("slot:pop", this.onPop.bind(this));

    document.removeEventListener("recall:cards", this.onRecallCards.bind(this) as EventListener);
  }

  private onDrag(event: DragEvent): void {
    if (event.dataTransfer!.getData("family") === "") return;
    if (event.dataTransfer!.getData("number") === "") return;
    if (this.childElementCount === 0) { event.preventDefault(); return; }

    const family = event.dataTransfer!.getData("family");
    const number = parseInt(event.dataTransfer!.getData("number"));
    const lastCard = this.lastElementChild as Card;

    if (family === lastCard.family && number === lastCard.number) return;
    if (family === "arcana" && lastCard.family !== "arcana") return;
    if (family !== "arcana" && lastCard.family === "arcana") return;
    if (number === lastCard.number) return;
    if (number - 1 > lastCard.number) return;
    if (number + 1 < lastCard.number) return;

    event.preventDefault();
  }

  private onDrop(event: DragEvent): void {
    const family = event.dataTransfer!.getData("family");
    const number = parseInt(event.dataTransfer!.getData("number"));
    const card = document.querySelector<Card>(`game-card[data-number='${number}'][data-family='${family}']`)!;
    const origin = card.parentElement! as Slot | BlockingSlot;

    let current: Card | null = card;

    for (; current !== null;) {
      this.dispatchEvent(new CustomEvent<StackableEvent>("slot:push", { detail: { card: current } }));
      origin.dispatchEvent(new Event("slot:pop"));

      if (origin instanceof BlockingSlot) break;

      const next = origin.lastElementChild as Card | null;

      if (next === null) break;
      if (current.family === "arcana" && next.family !== "arcana") break;
      if (current.family !== "arcana" && next.family === "arcana") break;
      if (current.number === next.number) break;
      if (current.number - 1 > next.number) break;
      if (current.number + 1 < next.number) break;

      current = next;
    }

    this.dispatchEvent(new Event("card:movement:settled", { bubbles: true }));
  }

  private onRecallCards(event: CustomEvent<RecallCardEvent>): void {
    if (this.childElementCount === 0) return;

    const top = this.lastElementChild as Card;

    if (top.number !== event.detail.number) return;
    if (top.family !== event.detail.family) return;

    event.detail.caller.dispatchEvent(new CustomEvent<StackableEvent>("slot:push", { detail: { card: top } }));
    this.dispatchEvent(new Event("slot:pop"));

    if (this.lastElementChild instanceof Card) this.lastElementChild.uncover();

    this.dispatchEvent(new Event("card:movement:settled", { bubbles: true }));
  }

  private onPush(event: CustomEvent<StackableEvent>): void {
    event.stopPropagation();

    if (this.lastElementChild instanceof Card) this.lastElementChild.cover();

    this.appendChild(event.detail.card);

    event.detail.card.style.removeProperty("transform");
    event.detail.card.classList.toggle("shadow-[0_2px_1px_rgba(0,0,0,1)]", true);
    event.detail.card.classList.toggle("shadow-[2px_0_1px_rgba(0,0,0,1)]", false);

    event.detail.card.layer = this.childElementCount;
    event.detail.card.style.top = `${Card.TOP_OFFSET * (event.detail.card.layer - 1)}px`;
    event.detail.card.style.zIndex = `${event.detail.card.layer}`;

    this.resize();
  }

  private onPop(): void {
    if (this.lastElementChild instanceof Card) this.lastElementChild.uncover();
    this.resize();
  }

  private resize(): void {
    if (this.childElementCount > 0) {
      const top = this.getBoundingClientRect().top;
      const bottom = this.lastElementChild!.getBoundingClientRect().bottom;

      this.style.height = `${bottom - top}px`;
    } else this.style.removeProperty("height");
  }
}

customElements.define("game-slot", Slot)
