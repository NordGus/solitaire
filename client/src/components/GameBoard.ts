
// items to load:
//   - 13 swords cards.
//   - 13 clubs cards.
//   - 13 cups cards.
//   - 13 golds cards.
//   - 22 arcana cards.
//   - 11 play area slots.
//   - 4 non-arcana resting slots.
//   - 2 arcana resting slots.
//   - 1 blocking slot of non-arcana resting slots.
export default class GameBoard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {}

  disconnectedCallback(): void {}
}

customElements.define("game-board", GameBoard);
