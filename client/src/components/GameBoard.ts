export default class GameBoard extends HTMLElement {
  constructor() {
    super();

    console.log("hello world")
  }
}

customElements.define("game-board", GameBoard);
