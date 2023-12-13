import collides from "@/helpers/collides.ts";
import { CardMagnetizeToEvent, CardMovedEvent, SlotNumber } from "@/types.ts";
import GameCard from "@Components/GameCard.ts";

export default class GameSlot extends HTMLElement {
  private coveredBy: GameCard | null

  public readonly number: SlotNumber

  constructor() {
    super();

    this.number = parseInt(this.attributes.getNamedItem("number")!.value) as SlotNumber
    this.coveredBy = null
  }

  connectedCallback(): void {
    window.addEventListener("card:moved", this.onCardMoved() as EventListener)
  }

  disconnectedCallback(): void {
    window.removeEventListener("card:moved", this.onCardMoved() as EventListener)
  }

  private onCardMoved(): (event: CustomEvent<CardMovedEvent>) => void {
    return (event: CustomEvent<CardMovedEvent>) => {
      if (this.coveredBy !== null) return;

      const eventInitDict: CustomEventInit<CardMagnetizeToEvent> = {
        detail: {
          target: this,
          card: event.detail.card,
          state: {
            card: { rect: event.detail.state.card.rect },
            target: { rect: this.getBoundingClientRect() }
          }
        }
      }

      if (collides(event.detail.state.card.rect, this.getBoundingClientRect())) {
        window.dispatchEvent(new CustomEvent<CardMagnetizeToEvent>("card:magnetize:to", eventInitDict))
      }
    }
  }
}

customElements.define("game-slot", GameSlot)
