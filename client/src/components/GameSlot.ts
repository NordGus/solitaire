import collides from "@/helpers/collides.ts";
import { CardMagnetizeToEvent, CardMovedEvent, SlotNumber, StackableEvent } from "@/types.ts";
import GameCard from "@Components/GameCard.ts";

export default class GameSlot extends HTMLElement {
  private coveredBy: GameCard | null

  public readonly number: SlotNumber

  constructor() {
    super();

    this.number = parseInt(this.attributes.getNamedItem("number")!.value) as SlotNumber;
    this.coveredBy = null;
  }

  connectedCallback(): void {
    window.addEventListener("card:moved", this.onCardMoved() as EventListener);

    window.addEventListener("stackable:push", this.onPush() as EventListener);
    window.addEventListener("stackable:pop", this.onPop() as EventListener);
  }

  disconnectedCallback(): void {
    window.removeEventListener("card:moved", this.onCardMoved() as EventListener);

    window.removeEventListener("stackable:push", this.onPush() as EventListener);
    window.removeEventListener("stackable:pop", this.onPop() as EventListener);
  }

  private onCardMoved(): (event: CustomEvent<CardMovedEvent>) => void {
    return (event: CustomEvent<CardMovedEvent>) => {
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
        window.dispatchEvent(new CustomEvent<CardMagnetizeToEvent>("card:magnetize:to", eventInitDict));
      }
    }
  }

  private onPush(): (event: CustomEvent<StackableEvent>) => void {
    return (event: CustomEvent<StackableEvent>) => {
      if (event.detail.stackable !== this) return;
      if (this.coveredBy !== null) return;

      this.coveredBy = event.detail.caller;
    }
  }

  private onPop(): (event: CustomEvent<StackableEvent>) => void {
    return (event: CustomEvent<StackableEvent>) => {
      if (event.detail.stackable !== this) return;
      if (this.coveredBy === null) return;
      if (event.detail.caller !== this.coveredBy) return;

      this.coveredBy = null;
    }
  }
}

customElements.define("game-slot", GameSlot)
