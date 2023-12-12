import GameCard, { CardMovedEvent } from "@Components/GameCard.ts";

type SlotNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type SlotMagnetizeEvent = { slot: GameSlot, card: GameCard }

export default class GameSlot extends HTMLElement {
  public readonly number: SlotNumber

  constructor() {
    super();

    this.number = parseInt(this.attributes.getNamedItem("number")!.value) as SlotNumber
  }

  connectedCallback(): void {
    window.addEventListener<CustomEvent<CardMovedEvent>>("card:moved", this.onCardMoved())
  }

  disconnectedCallback(): void {
    window.removeEventListener<CustomEvent<CardMovedEvent>>("card:moved", this.onCardMoved())
  }

  private onCardMoved(): (event: CustomEvent<CardMovedEvent>) => void {
    return (event: CustomEvent<CardMovedEvent>) => {
      const card: GameCard = event.detail.card
      const eventInitDict: CustomEventInit<SlotMagnetizeEvent> = { detail: { slot: this, card: card } }

      if (this.number === card.cardSlot.number || !this.collidesWithCard(card)) {
        window.dispatchEvent(new CustomEvent<SlotMagnetizeEvent>("slot:magnetize:ignore", eventInitDict))
      } else {
        window.dispatchEvent(new CustomEvent<SlotMagnetizeEvent>("slot:magnetize", eventInitDict))
      }
    }
  }

  private collidesWithCard(card: GameCard): boolean {
    const cardBox = card.getBoundingClientRect()
    const slotBox = this.getBoundingClientRect()

    return !((cardBox.right * 0.8) < slotBox.left ||
      (cardBox.left * 0.8) > slotBox.right)
  }
}

customElements.define("game-slot", GameSlot)
