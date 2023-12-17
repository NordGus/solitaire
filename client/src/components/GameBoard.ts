
/*
GameBoard:
  loadableElementsAmount is this number because the game needs this:
    - 13 cards for the families cups, golds, clubs and swords.
    - 22 cards for the arcana family.
    - 11 play-area slots.
    - 1 card resting slots for the cards of the families cups, golds, clubs and swords.
    - 2 card resting slots for the arcana cards. (this to implement the double order resting).
    - 1 out-of-play-area slot for cards to take cards.
*/
import { AttachLayerEvent } from "@/types.ts";

export default class GameBoard extends HTMLElement {
  private readonly loadableElementsAmount: number = (4*13) + 22 + 11 + 4 + 2;
  private loadableElementsCount: number;
  private gameStarted: boolean;

  constructor() {
    super();

    this.gameStarted = false;
    this.loadableElementsCount = 0;
  }

  connectedCallback(): void {
    this.addEventListener("game:element:connected", this.onGameElementConnected.bind(this))
  }

  disconnectedCallback(): void {
    this.removeEventListener("game:element:connected", this.onGameElementConnected)
  }

  private onGameElementConnected(): void {
    if (this.gameStarted) return;

    this.loadableElementsCount++;

    if (this.loadableElementsCount < this.loadableElementsAmount) return;

    this.gameStarted = true;

    for (let i = 0; i < 8; i++) {
      this.dispatchEvent(new CustomEvent<AttachLayerEvent>(
        "game:elements:attach:layer", { bubbles: true, detail: { layer: i+1 } }
      ));
    }
  }
}

customElements.define("game-board", GameBoard);
