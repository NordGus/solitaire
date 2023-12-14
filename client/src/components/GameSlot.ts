import collides from "@/helpers/collides.ts";
import { CardMagnetizeToEvent, CardMovedEvent, SlotNumber, StackableEvent } from "@/types.ts";
import GameCard from "@Components/GameCard.ts";

export default class GameSlot extends HTMLElement {
  private coveredBy: GameCard | null

  public readonly number: SlotNumber

  constructor() {
    super();

    this.number = parseInt(this.dataset.number!) as SlotNumber
    this.coveredBy = null;
  }

  connectedCallback(): void {
    document.addEventListener("card:moved", this.onCardMoved.bind(this) as EventListener);
    document.addEventListener("stackable:push", this.onPush.bind(this) as EventListener);
    document.addEventListener("stackable:pop", this.onPop.bind(this) as EventListener);

    this.dispatchEvent(new Event("game:element:connected", { bubbles: true }));
  }

  disconnectedCallback(): void {
    document.removeEventListener("card:moved", this.onCardMoved.bind(this) as EventListener);
    document.removeEventListener("stackable:push", this.onPush.bind(this) as EventListener);
    document.removeEventListener("stackable:pop", this.onPop.bind(this) as EventListener);
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

  private onPush(event: CustomEvent<StackableEvent>): void {
    if (event.detail.stackable !== this) return;
    if (this.coveredBy !== null) return;

    this.coveredBy = event.detail.caller;
  }

  private onPop(event: CustomEvent<StackableEvent>): void {
    if (event.detail.stackable !== this) return;
    if (this.coveredBy === null) return;
    if (event.detail.caller !== this.coveredBy) return;

    this.coveredBy = null;
  }
}

customElements.define("game-slot", GameSlot)
