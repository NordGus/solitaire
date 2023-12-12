export default class GameBoard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {}

  disconnectedCallback(): void {}
}

customElements.define("game-board", GameBoard);
