import { CardFamily, CardNumber, RecallCardEvent, StackableEvent } from "@/types.ts";
import Card from "@Components/Card.ts";

enum Direction {
  Prograde = "prograde",
  Retrograde = "retrograde"
}

export default class RestingSlot extends HTMLElement {
  static X_OFFSET = 20;
  static Y_OFFSET = 1;

  private readonly _attachableNumber: CardNumber
  private readonly _direction: Direction
  private readonly _family: CardFamily

  private _disabled: boolean

  constructor() {
    super();

    this._family = this.dataset.family! as CardFamily;
    this._attachableNumber = parseInt(this.dataset.attachable!) as CardNumber;
    this._direction = this.dataset.direction === "retrograde" ? Direction.Retrograde : Direction.Prograde;
    this._disabled = false;
  }

  connectedCallback(): void {
    this.addEventListener("slot:push", this.onPush.bind(this) as EventListener);

    document.addEventListener("resting:enable", this.onRestingEnable.bind(this));
    document.addEventListener("resting:disable", this.onRestingDisable.bind(this));
    document.addEventListener("card:movement:settled", this.onCardMovementSettled.bind(this));

    this.dispatchEvent(new Event("element:loaded", { bubbles: true }));
  }

  disconnectedCallback(): void {
    this.removeEventListener("slot:push", this.onPush.bind(this) as EventListener);

    document.removeEventListener("resting:enable", this.onRestingEnable.bind(this));
    document.removeEventListener("resting:disable", this.onRestingDisable.bind(this));
    document.removeEventListener("card:movement:settled", this.onCardMovementSettled.bind(this));
  }

  private onRestingEnable(): void { this._disabled = false }
  private onRestingDisable(): void { this._disabled = true }

  private onCardMovementSettled(): void {
    if (this._disabled) return;

    const eventInitDict: CustomEventInit<RecallCardEvent> = {
      bubbles: true,
      detail: { number: this._attachableNumber, family: this._family, caller: this }
    };

    if (this.lastElementChild instanceof Card && this._direction === "prograde") {
      eventInitDict.detail!.number = this.lastElementChild.number + 1;
    } else if (this.lastElementChild instanceof Card) {
      eventInitDict.detail!.number = this.lastElementChild.number - 1;
    }

    this.dispatchEvent(new CustomEvent<RecallCardEvent>("recall:cards", eventInitDict));
  }

  private onPush(event: CustomEvent<StackableEvent>): void {
    if (this._disabled) return;
    if (this._family !== event.detail.card.family) return;
    if (this.childElementCount === 0 && event.detail.card.number !== this._attachableNumber) throw new Error("invalid game state");
    event.stopPropagation();

    const card = event.detail.card;

    if (this.canRemoveCardShadow()) card.classList.toggle("shadow-[0_2px_1px_rgba(0,0,0,1)]", false);
    card.rest();
    this.appendChild(card);
    card.layer = this.childElementCount;
    card.style.zIndex = `${event.detail.card.layer}`;

    if (this._direction === "prograde" && this._family === "arcana")
      card.style.transform = `translateX(${RestingSlot.X_OFFSET * (card.layer - 1)}px)`;
    else if (this._family === "arcana")
      card.style.transform = `translateX(${-RestingSlot.X_OFFSET * (card.layer - 1)}px)`;
    else
      card.style.transform = `translateY(${-RestingSlot.Y_OFFSET * (card.layer - 1)}px)`;
  }

  private canRemoveCardShadow(): boolean { return this.childElementCount > 1 && this._family !== "arcana" }
}

customElements.define("game-resting-slot", RestingSlot)
