import { CardFamily } from "@/types.ts";
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
    console.log(this.family)

    this.dispatchEvent(new Event("game:element:connected", { bubbles: true }));
  }

  disconnectedCallback(): void {

  }
}

customElements.define("family-resting-slot", FamilyRestingSlot)
