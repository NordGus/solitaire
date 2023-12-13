import getIntersectionRect from "@/helpers/getIntersectionRect.ts";
import rectArea from "@/helpers/rectArea.ts";
import { CardFamily, CardMagnetizeToEvent, CardMovedEvent, CardNumber, SlotNumber, StackableEvent } from "@/types.ts";
import GameSlot from "@Components/GameSlot.ts";

function getCardFamilyColorClass(family: CardFamily): string {
  if (family === "swords") return "text-blue-400";
  if (family === "clubs") return "text-green-400";
  if (family === "golds") return "text-yellow-400";
  if (family === "cups") return "text-red-400";
  if (family === "arcana") return "text-amber-600";

  return "";
}

enum State {
  Resting = "resting",
  Moving = "moving",
  Settling = "settling"
}

export default class GameCard extends HTMLElement {
  private initialX: number
  private initialY: number
  private targetMagnetismPower: number

  private covers: GameCard | GameSlot
  // private coveredBy: GameCard | null

  private state: State

  public readonly number: CardNumber
  public readonly family: CardFamily

  constructor() {
    super();

    this.initialX = 0;
    this.initialY = 0;
    this.targetMagnetismPower = 0;

    this.covers = this;
    // this.coveredBy = null;

    this.state = State.Resting;

    this.number = parseInt(this.attributes.getNamedItem("number")!.value) as CardNumber;
    this.family = this.attributes.getNamedItem("family")!.value as CardFamily;
  }

  connectedCallback(): void {
    this.addEventListener("mousedown", this.onStartMovement());
    this.addEventListener("mousemove", this.onMove());
    this.addEventListener("mouseup", this.onStopMovement());
    this.addEventListener("mouseleave", this.onStopMovement());

    window.addEventListener("card:magnetize:to", this.onMagnetizeTo() as EventListener);

    this.classList.toggle(getCardFamilyColorClass(this.family), true);

    // TODO: implement a event listener to attach this.covers
    if (this.attributes.getNamedItem("slot")!.value) {
      const slotNumber = parseInt(this.attributes.getNamedItem("slot")!.value) as SlotNumber;
      this.covers = document.querySelector<GameSlot>(`#play-area game-slot[number='${slotNumber}']`)!;
    }

    this.style.top = `${this.covers.getBoundingClientRect().top}px`;
    this.style.left = `${this.covers.getBoundingClientRect().left}px`;
  }

  disconnectedCallback(): void {
    this.removeEventListener("mousedown", this.onStartMovement());
    this.removeEventListener("mousemove", this.onMove());
    this.removeEventListener("mouseup", this.onStopMovement());
    this.removeEventListener("mouseleave", this.onStopMovement());

    window.removeEventListener("card:magnetize:to", this.onMagnetizeTo() as EventListener);
  }

  private onStartMovement(): (event: MouseEvent) => void {
    return (event: MouseEvent): void => {
      this.state = State.Moving;
      this.initialX = event.clientX;
      this.initialY = event.clientY;
    }
  }

  private onMove(): (event: MouseEvent) => void {
    return (event: MouseEvent): void => {
      if (this.state !== State.Moving) return;

      const newX = event.clientX;
      const newY = event.clientY;

      this.style.top = `${this.offsetTop - (this.initialY - newY)}px`;
      this.style.left = `${this.offsetLeft - (this.initialX - newX)}px`;
      this.initialX = newX;
      this.initialY = newY;
    }
  }

  private onStopMovement(): () => void {
    return () => {
      if (this.state !== State.Moving) return;

      this.state = State.Settling;

      const domRect: DOMRect = this.getBoundingClientRect();
      const eventInitDict: CustomEventInit<CardMovedEvent> = {
        detail: {
          card: this,
          state: {
            card: { rect: { top: domRect.top, bottom: domRect.bottom, right: domRect.right, left: domRect.left } },
          }
        }
      };

      window.dispatchEvent(new CustomEvent<CardMovedEvent>("card:moved", eventInitDict));

      this.targetMagnetismPower = 0;

      if (this.state !== State.Settling) return;

      this.state = State.Resting;
      this.style.top = `${this.covers.getBoundingClientRect().top}px`;
      this.style.left = `${this.covers.getBoundingClientRect().left}px`;
    }
  }

  private onMagnetizeTo(): (event: CustomEvent<CardMagnetizeToEvent>) => void {
    return (event: CustomEvent<CardMagnetizeToEvent>) => {
      if (this.state !== State.Settling && this.state !== State.Resting) return;
      if (this.number !== event.detail.card.number) return;
      if (this.family !== event.detail.card.family) return;

      const targetMagnetismPower: number = rectArea(getIntersectionRect(
        event.detail.state.card.rect,
        event.detail.state.target.rect
      ));

      console.log("prev magnetism power", this.targetMagnetismPower, "current magnetism power", targetMagnetismPower, event.detail.target)

      if (this.targetMagnetismPower > targetMagnetismPower) return;

      const covers: GameSlot | GameCard = event.detail.target;

      this.state = State.Resting;
      this.targetMagnetismPower = targetMagnetismPower;
      this.style.top = `${covers.getBoundingClientRect().top}px`;
      this.style.left = `${covers.getBoundingClientRect().left}px`;

      // uncover previous this.covers
      window.dispatchEvent(new CustomEvent<StackableEvent>(
        "stackable:pop",
        { detail: { stackable: this.covers, caller: this } }
      ));

      // cover new this.covers
      window.dispatchEvent(new CustomEvent<StackableEvent>(
        "stackable:push",
        { detail: { stackable: covers, caller: this } }
      ));

      this.covers = covers;
    }
  }
}

customElements.define("game-card", GameCard);
