import { CardFamily, CardNumber, SlotStackEvent } from "@/types.ts";
import Card from "@Components/Card.ts";

enum Direction {
  Prograde = "prograde",
  Retrograde = "retrograde"
}

export default class RestingSlot extends HTMLElement {
  static LEFT_OFFSET = 10;
  static RIGHT_OFFSET = 10;
  static BOTTOM_OFFSET = 3;

  private readonly attachableNumber: CardNumber
  private readonly direction: Direction
  public readonly family: CardFamily

  constructor() {
    super();

    this.family = this.dataset.family! as CardFamily;
    this.attachableNumber = parseInt(this.dataset.attachable!) as CardNumber;
    this.direction = this.dataset.direction === "retrograde" ? Direction.Retrograde : Direction.Prograde;
  }

  connectedCallback(): void {
    this.addEventListener("slot:push", this.onPush.bind(this) as EventListener);

    this.dispatchEvent(new Event("game:element:connected", { bubbles: true }));
  }

  disconnectedCallback(): void {
    this.addEventListener("slot:push", this.onPush.bind(this) as EventListener);
  }

  private onPush(event: CustomEvent<SlotStackEvent>): void {
    const card = event.detail.card;

    if (this.family !== card.family) return;
    if (this.childElementCount === 0 && card.number !== this.attachableNumber) throw new Error("invalid game state");

    event.stopPropagation();

    this.appendChild(card);
    card.style.removeProperty("left");
    card.style.removeProperty("top");
    card.layer = this.childElementCount;

    if (this.direction === "prograde") this.onPushPrograde(card);
    else this.onPushRetrograde(card);
  }

  // TODO: implement recursive call to call other restable cards
  private onPushPrograde(card: Card): void {
    if (this.family === "arcana") card.style.left = `${RestingSlot.LEFT_OFFSET * (card.layer - 1)}px`;
    else card.style.bottom = `${RestingSlot.BOTTOM_OFFSET * (card.layer - 1)}px`;
  }

  // TODO: implement recursive call to call other restable cards
  private onPushRetrograde(card: Card): void {
    if (this.family === "arcana") card.style.right = `${RestingSlot.RIGHT_OFFSET * (card.layer - 1)}px`;
    else card.style.bottom = `${RestingSlot.BOTTOM_OFFSET * (card.layer - 1)}px`;
  }
}

customElements.define("game-resting-slot", RestingSlot)
