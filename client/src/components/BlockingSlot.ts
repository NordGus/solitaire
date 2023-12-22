import { StackableEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import Slot from "@Components/Slot.ts";

export default class BlockingSlot extends HTMLElement {
  static PUSHED_CARD_Z_INDEX = 30;

  connectedCallback(): void {
    this.addEventListener("dragenter", this.onDrag.bind(this));
    this.addEventListener("dragover", this.onDrag.bind(this));
    this.addEventListener("drop", this.onDrop.bind(this));

    this.addEventListener("slot:push", this.onPush.bind(this) as EventListener);
    this.addEventListener("slot:pop", this.onPop.bind(this) as EventListener);

    this.dispatchEvent(new Event("element:loaded", { bubbles: true }));
  }

  disconnectedCallback(): void {
    this.removeEventListener("dragenter", this.onDrag.bind(this));
    this.removeEventListener("dragover", this.onDrag.bind(this));
    this.removeEventListener("drop", this.onDrop.bind(this));

    this.removeEventListener("slot:push", this.onPush.bind(this) as EventListener);
    this.removeEventListener("slot:pop", this.onPop.bind(this) as EventListener);
  }

  private onDrag(event: DragEvent): void { if (this.childElementCount === 0) event.preventDefault() }

  private onDrop(event: DragEvent): void {
    const family = event.dataTransfer!.getData("family");
    const number = parseInt(event.dataTransfer!.getData("number"));
    const card = document.querySelector<Card>(`game-card[data-number='${number}'][data-family='${family}']`)!;
    const origin = card.parentElement! as Slot;

    this.dispatchEvent(new CustomEvent<StackableEvent>("slot:push", { detail: { card: card } }));
    origin.dispatchEvent(new Event("slot:pop"));
  }

  private onPush(event: CustomEvent<StackableEvent>): void {
    if (this.childElementCount > 0) return;

    event.stopPropagation();

    this.appendChild(event.detail.card);

    event.detail.card.style.removeProperty("top");
    event.detail.card.style.removeProperty("left");

    event.detail.card.classList.toggle("shadow-[0_2px_1px_rgba(0,0,0,1)]", false);
    event.detail.card.classList.toggle("shadow-[2px_0_1px_rgba(0,0,0,1)]", true);

    event.detail.card.layer = BlockingSlot.PUSHED_CARD_Z_INDEX;
    event.detail.card.style.zIndex = `${event.detail.card.layer}`;
    event.detail.card.style.transform = `rotate(-90deg)`;

    this.dispatchEvent(new Event("resting:disable", { bubbles: true }));
  }

  private onPop(): void { this.dispatchEvent(new Event("resting:enable", { bubbles: true })) }
}

customElements.define("game-blocking-slot", BlockingSlot);
