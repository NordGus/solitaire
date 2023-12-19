import collides from "@/helpers/collides.ts";
import { CardMagnetizeToEvent, CardMovedEvent, SlotNumber, SlotStackEvent } from "@/types.ts";

export default class Slot extends HTMLElement {
  public readonly number: SlotNumber

  constructor() {
    super();

    this.number = parseInt(this.dataset.number!) as SlotNumber
  }

  connectedCallback(): void {
    this.addEventListener("slot:push", this.onPush.bind(this) as EventListener);
    this.addEventListener("slot:pop", this.onPop.bind(this));

    // document.addEventListener("card:moved", this.onCardMoved.bind(this) as EventListener);

    this.dispatchEvent(new Event("game:element:connected", { bubbles: true }));
  }

  disconnectedCallback(): void {
    this.removeEventListener("slot:push", this.onPush.bind(this) as EventListener);
    this.removeEventListener("slot:pop", this.onPop.bind(this));

    // document.removeEventListener("card:moved", this.onCardMoved.bind(this) as EventListener);
  }

  private onCardMoved(event: CustomEvent<CardMovedEvent>): void {
    if (this.coveredBy !== null) return;

    const domRect: DOMRect = this.getBoundingClientRect();
    const eventInitDict: CustomEventInit<CardMagnetizeToEvent> = {
      detail: {
        target: this,
        card: event.detail.card,
        state: {
          card: { rect: event.detail.state.card.rect },
          target: { rect: { top: domRect.top, bottom: domRect.bottom, left: domRect.left, right: domRect.right } }
        }
      }
    };

    if (collides(event.detail.state.card.rect, eventInitDict.detail!.state.target.rect)) {
      document.dispatchEvent(new CustomEvent<CardMagnetizeToEvent>("card:magnetize:to", eventInitDict));
    }
  }

  private onPush(event: CustomEvent<SlotStackEvent>): void {
    this.appendChild(event.detail.card);
    event.detail.card.layer = this.childElementCount;
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
