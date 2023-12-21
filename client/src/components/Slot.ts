import { SlotNumber, StackableEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import RestingSlot from "@Components/RestingSlot.ts";

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

    this.dispatchEvent(new Event("game:element:connected", { bubbles: true }));
  }

  disconnectedCallback(): void {
    this.removeEventListener("dragenter", this.onDrag.bind(this));
    this.removeEventListener("dragover", this.onDrag.bind(this));
    this.removeEventListener("drop", this.onDrop.bind(this));

    this.removeEventListener("slot:push", this.onPush.bind(this) as EventListener);
    this.removeEventListener("slot:pop", this.onPop.bind(this));
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
    const origin = card.parentElement! as Slot;

    let current: Card | null = card;

    for (; current !== null;) {
      if (current.covers instanceof Slot || current.covers instanceof RestingSlot) break;

      const next: Card | null = current.covers;
      current.covers = null

      if (next !== null) next.uncover();
      this.dispatchEvent(new CustomEvent<StackableEvent>("slot:push", { detail: { card: current } }));
      origin.dispatchEvent(new Event("slot:pop"));

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

  private onPush(event: CustomEvent<StackableEvent>): void {
    event.stopPropagation();

    if (this.lastElementChild instanceof Card) {
      this.lastElementChild.cover(event.detail.card);
      event.detail.card.covers = this.lastElementChild;
    }

    this.appendChild(event.detail.card);

    event.detail.card.layer = this.childElementCount;
    event.detail.card.style.top = `${Card.TOP_OFFSET * (event.detail.card.layer - 1)}px`;

    this.resize();
  }

  private onPop(): void {
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
