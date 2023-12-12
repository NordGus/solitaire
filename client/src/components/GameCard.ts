import GameSlot, { SlotMagnetizeEvent } from "@Components/GameSlot.ts";

type CardFamily = "swords" | "clubs" | "golds" | "cups" | "arcana"
type CardNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21

export type CardMovedEvent = { card: GameCard }

function getCardFamilyColorClass(family: CardFamily): string {
  if (family === "swords") return "text-blue-400"
  if (family === "clubs") return "text-green-400"
  if (family === "golds") return "text-yellow-400"
  if (family === "cups") return "text-red-400"
  if (family === "arcana") return "text-amber-600"

  return ""
}

enum State {
  Resting = "resting",
  Moving = "moving",
  Settling = "settling"
}

export default class GameCard extends HTMLElement {
  private readonly MAGNETISM_COUNTER_LIMIT: number = 10

  private initialX: number
  private initialY: number
  private currentSlot: GameSlot
  private state: State
  private magnetismCounter: number

  public readonly number: CardNumber
  public readonly family: CardFamily

  constructor() {
    super();

    this.state = State.Resting
    this.initialX = 0
    this.initialY = 0
    this.magnetismCounter = 0

    this.number = parseInt(this.attributes.getNamedItem("number")!.value) as CardNumber
    this.family = this.attributes.getNamedItem("family")!.value as CardFamily

    this.style.top = `${this.parentElement!.getBoundingClientRect().top}`
    this.style.left = `${this.parentElement!.getBoundingClientRect().left}`
    this.currentSlot = this.parentElement! as GameSlot
  }

  get cardSlot(): GameSlot {
    return this.currentSlot
  }

  connectedCallback(): void {
    this.addEventListener("mousedown", this.onStartMovement())
    this.addEventListener("mousemove", this.onMove())
    this.addEventListener("mouseup", this.onStopMovement())
    this.addEventListener("mouseleave", this.onStopMovement())

    window.addEventListener<CustomEvent<CardMovedEvent>>("slot:magnetize", this.onSlotMagnetize())
    window.addEventListener<CustomEvent<CardMovedEvent>>("slot:magnetize:ignore", this.onSlotMagnetizeIgnore())

    this.classList.toggle(getCardFamilyColorClass(this.family), true)
  }

  disconnectedCallback(): void {
    this.removeEventListener("mousedown", this.onStartMovement())
    this.removeEventListener("mousemove", this.onMove())
    this.removeEventListener("mouseup", this.onStopMovement())
    this.removeEventListener("mouseleave", this.onStopMovement())

    window.removeEventListener<CustomEvent<CardMovedEvent>>("slot:magnetize", this.onSlotMagnetize())
    window.removeEventListener<CustomEvent<CardMovedEvent>>("slot:magnetize:ignore", this.onSlotMagnetizeIgnore())
  }

  private onStartMovement(): (event: MouseEvent) => void {
    return (event: MouseEvent): void => {
      event.preventDefault();

      this.state = State.Moving;
      this.magnetismCounter = 0
      this.initialX = event.clientX;
      this.initialY = event.clientY;
    }
  }

  private onMove(): (event: MouseEvent) => void {
    return (event: MouseEvent): void => {
      event.preventDefault();
      if (this.state !== State.Moving) return;

      const newX = event.clientX
      const newY = event.clientY

      this.style.top = `${this.offsetTop - (this.initialY - newY)}px`
      this.style.left = `${this.offsetLeft - (this.initialX - newX)}px`
      this.initialX = newX
      this.initialY = newY
    }
  }

  private onStopMovement(): (event: MouseEvent) => void {
    return (event: MouseEvent) => {
      event.preventDefault();
      if (this.state !== State.Moving) return;

      this.state = State.Settling;
      window.dispatchEvent(new CustomEvent<CardMovedEvent>("card:moved", { detail: { card: this } }))
    }
  }

  private onSlotMagnetize(): (event: CustomEvent<SlotMagnetizeEvent>) => void {
    return (event: CustomEvent<SlotMagnetizeEvent>) => {
      if (this.state !== State.Settling) return;
      if (this.number !== event.detail.card.number) return;
      if (this.family !== event.detail.card.family) return;

      this.state = State.Resting

      console.log(event);

      const slot: GameSlot = event.detail.slot

      this.style.top = `${slot.getBoundingClientRect().top}px`
      this.style.left = `${slot.getBoundingClientRect().left}px`

      const node = this.currentSlot.removeChild(this)
      this.currentSlot = slot
      slot.appendChild(node)
    }
  }

  private onSlotMagnetizeIgnore(): (event: CustomEvent<SlotMagnetizeEvent>) => void {
    return (event: CustomEvent<SlotMagnetizeEvent>) => {
      if (this.state !== State.Settling) return;
      if (this.number !== event.detail.card.number) return;
      if (this.family !== event.detail.card.family) return;

      console.log(event);

      this.magnetismCounter++

      if (this.magnetismCounter < this.MAGNETISM_COUNTER_LIMIT) return;

      this.style.top = `${this.currentSlot.getBoundingClientRect().top}px`
      this.style.left = `${this.currentSlot.getBoundingClientRect().left}px`
      this.magnetismCounter = 0
    }
  }
}

customElements.define("game-card", GameCard)
