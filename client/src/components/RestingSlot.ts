import { CardFamily, CardNumber, RecallCardEvent, StackableEvent } from "@/types.ts";
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

    document.addEventListener("card:movement:settled", this.onCardMovementSettled.bind(this));

    this.dispatchEvent(new Event("game:element:connected", { bubbles: true }));
  }

  disconnectedCallback(): void {
    this.removeEventListener("slot:push", this.onPush.bind(this) as EventListener);

    document.removeEventListener("card:movement:settled", this.onCardMovementSettled.bind(this));
  }

  private onCardMovementSettled(): void {
    if (this.lastElementChild === null) {
      this.dispatchEvent(new CustomEvent<RecallCardEvent>(
        "recall:cards",
        { bubbles: true, detail: { number: this.attachableNumber, family: this.family, caller: this } }
      ));
    } else {
      const lastCard = this.lastElementChild as Card;

      this.dispatchEvent(new CustomEvent<RecallCardEvent>(
        "recall:cards",
        { bubbles: true, detail: { number: (lastCard.number + 1), family: this.family, caller: this }}
      ));
    }
  }

  private onPush(event: CustomEvent<StackableEvent>): void {
    const card = event.detail.card;

    if (this.family !== card.family) return;
    if (this.childElementCount === 0 && card.number !== this.attachableNumber) throw new Error("invalid game state");

    event.stopPropagation();

    if (this.lastElementChild instanceof Card) this.lastElementChild.cover();

    this.appendChild(card);
    card.rest();
    card.style.removeProperty("left");
    card.style.removeProperty("top");
    card.layer = this.childElementCount;
    event.detail.card.style.zIndex = `${event.detail.card.layer}`;

    if (this.direction === "prograde") this.onPushPrograde(card);
    else this.onPushRetrograde(card);
  }

  private onPushPrograde(card: Card): void {
    if (this.family === "arcana") card.style.left = `${RestingSlot.LEFT_OFFSET * (card.layer - 1)}px`;
    else card.style.bottom = `${RestingSlot.BOTTOM_OFFSET * (card.layer - 1)}px`;
  }

  private onPushRetrograde(card: Card): void {
    if (this.family === "arcana") card.style.right = `${RestingSlot.RIGHT_OFFSET * (card.layer - 1)}px`;
    else card.style.bottom = `${RestingSlot.BOTTOM_OFFSET * (card.layer - 1)}px`;
  }
}

customElements.define("game-resting-slot", RestingSlot)
