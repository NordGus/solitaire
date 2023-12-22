import { AttachLayerEvent } from "@/types.ts";

export default class Board extends HTMLElement {
  /*
    Board.LOADABLE_ELEMENTS_AMOUNT: is equal to 92 because the game needs to load the following elements to work:
      - 13 cards for the families cups, golds, clubs and swords.
      - 22 cards for the arcana family.
      - 11 play-area slots.
      - 1 card resting slots for the cards of the families cups, golds, clubs and swords.
      - 2 card resting slots for the arcana cards. (this to implement the double order resting).
      - 1 out-of-play-area slot for cards to take cards.
  */
  static LOADABLE_ELEMENTS_AMOUNT: number = 92;

  private _loadableElementsCount: number;
  private _gameStarted: boolean;

  constructor() {
    super();

    this._gameStarted = false;
    this._loadableElementsCount = 0;
  }

  connectedCallback(): void {
    this.addEventListener("element:loaded", this.onElementLoaded.bind(this));
  }

  disconnectedCallback(): void {
    this.removeEventListener("element:loaded", this.onElementLoaded.bind(this));
  }

  private onElementLoaded(): void {
    if (!this._gameStarted) this._loadableElementsCount++;
    if (this._loadableElementsCount < Board.LOADABLE_ELEMENTS_AMOUNT) return;
    if (this._gameStarted) return;

    this._gameStarted = true;

    for (let i = 0; i < 8; i++) {
      this.dispatchEvent(new CustomEvent<AttachLayerEvent>("attach:layer", { bubbles: true, detail: { layer: i+1 } }));
    }
  }
}

customElements.define("game-board", Board);
