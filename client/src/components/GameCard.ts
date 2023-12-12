export default class GameCard extends HTMLElement {
  private isMoving: boolean
  private initialX: number
  private initialY: number

  constructor() {
    super();

    this.isMoving = false
    this.initialX = 0
    this.initialY = 0
  }

  connectedCallback(): void {
    this.addEventListener("mousedown", this.onMousedown())
    this.addEventListener("mousemove", this.onMousemove())
    this.addEventListener("mouseup", this.onMouseup())
    this.addEventListener("mouseleave", this.onMouseleave())
  }

  disconnectedCallback(): void {
    this.removeEventListener("mousedown", this.onMousedown())
    this.removeEventListener("mousemove", this.onMousemove())
    this.removeEventListener("mouseup", this.onMouseup())
    this.removeEventListener("mouseleave", this.onMouseleave())
  }

  private onMousedown(): (event: MouseEvent) => void {
    return (event: MouseEvent): void => {
      event.preventDefault();

      this.isMoving = true;
      this.initialX = event.clientX;
      this.initialY = event.clientY;
    }
  }

  private onMousemove(): (event: MouseEvent) => void {
    return (event: MouseEvent): void => {
      event.preventDefault();
      if (!this.isMoving) return;

      const newX = event.clientX
      const newY = event.clientY

      this.style.top = `${this.offsetTop - (this.initialY - newY)}px`
      this.style.left = `${this.offsetLeft - (this.initialX - newX)}px`
      this.initialX = newX
      this.initialY = newY
    }
  }

  private onMouseup(): (event: MouseEvent) => void {
    return (event: MouseEvent): void => {
      event.preventDefault();

      this.isMoving = false;
    }
  }

  private onMouseleave(): (event: MouseEvent) => void {
    return (event: MouseEvent) => {
      event.preventDefault();

      this.isMoving = false;
    }
  }
}

customElements.define("game-card", GameCard)
