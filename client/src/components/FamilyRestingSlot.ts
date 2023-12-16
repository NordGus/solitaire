import { CardFamily, StackableEvent } from "@/types.ts";
import GameCard from "@Components/GameCard.ts";

export default class FamilyRestingSlot extends HTMLElement {
  private coveredBy: GameCard | null

  public readonly family: CardFamily

  constructor() {
    super();

    this.family = this.dataset.family! as CardFamily
    this.coveredBy = null;
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

    if (event.detail.caller.family !== this.family || event.detail.caller.number !== 1) {
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

customElements.define("family-resting-slot", FamilyRestingSlot)
