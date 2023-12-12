type CardFamily = "swords" | "clubs" | "golds" | "cups" | "arcana"
type CardNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21

function getCardFamilyColorClass(family: CardFamily): string {
  if (family === "swords") return "text-blue-400"
  if (family === "clubs") return "text-green-400"
  if (family === "golds") return "text-yellow-400"
  if (family === "cups") return "text-red-400"
  if (family === "arcana") return "text-amber-600"

  return ""
}

export default class GameCard extends HTMLElement {
  private isMoving: boolean
  private initialX: number
  private initialY: number

  public readonly number: CardNumber
  public readonly family: CardFamily

  constructor() {
    super();

    this.isMoving = false
    this.initialX = 0
    this.initialY = 0

    this.number = parseInt(this.attributes.getNamedItem("number")!.value) as CardNumber
    this.family = this.attributes.getNamedItem("family")!.value as CardFamily
  }

  connectedCallback(): void {
    this.addEventListener("mousedown", this.onMousedown())
    this.addEventListener("mousemove", this.onMousemove())
    this.addEventListener("mouseup", this.onMouseup())
    this.addEventListener("mouseleave", this.onMouseleave())

    this.classList.toggle(getCardFamilyColorClass(this.family), true)
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
