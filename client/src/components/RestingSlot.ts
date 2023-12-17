import { CardFamily, CardNumber, StackableEvent } from "@/types.ts";
import Card from "@Components/Card.ts";

enum Direction {
  Prograde = "prograde",
  Retrograde = "retrograde"
}

export default class RestingSlot extends HTMLElement {
  private coveredBy: Card | null

  private readonly attachableNumber: CardNumber
  private readonly direction: Direction
  public readonly family: CardFamily

  constructor() {
    super();

    this.coveredBy = null;
    this.family = this.dataset.family! as CardFamily;
    this.attachableNumber = parseInt(this.dataset.attachable!) as CardNumber;
    this.direction = this.dataset.direction === "retrograde" ? Direction.Retrograde : Direction.Prograde;
  }

  connectedCallback(): void {
    document.addEventListener("stackable:push", this.onPush.bind(this) as EventListener);

    this.dispatchEvent(new Event("game:element:connected", { bubbles: true }));
  }

  disconnectedCallback(): void {
    document.removeEventListener("stackable:push", this.onPush.bind(this) as EventListener);
  }


  private onPush(event: CustomEvent<StackableEvent>): void {
    if (event.detail.stackable !== this) return;
    if (this.coveredBy !== null) return;

    if (event.detail.caller.family !== this.family || event.detail.caller.number !== this.attachableNumber) {
      console.error(
        "tried to push invalid family or number: family:",
        event.detail.caller.family,
        "number:",
        event.detail.caller.family
      );
    }

    this.coveredBy = event.detail.caller;
  }
}

customElements.define("game-resting-slot", RestingSlot)
