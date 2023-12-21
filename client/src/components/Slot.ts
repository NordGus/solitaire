import { SlotNumber, SlotStackEvent } from "@/types.ts";
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

    this.dispatchEvent(new CustomEvent<SlotStackEvent>("slot:push", { bubbles: true, detail: { card: card } }));
    origin.dispatchEvent(new Event("slot:pop"));
  }

  private onPush(event: CustomEvent<SlotStackEvent>): void {
    event.stopPropagation();

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
