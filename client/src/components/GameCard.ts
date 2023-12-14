import getIntersectionRect from "@/helpers/getIntersectionRect.ts";
import rectArea from "@/helpers/rectArea.ts";
import {
  AttachLayerEvent,
  CardFamily,
  CardMagnetizeToEvent,
  CardMovedEvent,
  CardNumber,
  StackableEvent
} from "@/types.ts";
import GameSlot from "@Components/GameSlot.ts";

function getCardFamilyColorClass(family: CardFamily): string {
  if (family === "swords") return "text-blue-400";
  if (family === "clubs") return "text-green-400";
  if (family === "golds") return "text-yellow-600";
  if (family === "cups") return "text-red-400";
  if (family === "arcana") return "text-amber-500";
  return "";
}

enum State {
  Loaded = "loaded",
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
  private readonly layer: number

  public readonly number: CardNumber
  public readonly family: CardFamily

  constructor() {
    super();

    this.initialX = 0;
    this.initialY = 0;
    this.targetMagnetismPower = 0;

    this.covers = this;
    // this.coveredBy = null;

    this.state = State.Loaded;
    this.layer = parseInt(this.dataset.layer!);

    this.number = parseInt(this.dataset.number!) as CardNumber;
    this.family = this.dataset.family! as CardFamily;
  }

  connectedCallback(): void {
    this.addEventListener("mousedown", this.onStartMovement.bind(this));
    this.addEventListener("mousemove", this.onMove.bind(this));
    this.addEventListener("mouseup", this.onStopMovement.bind(this));
    this.addEventListener("mouseleave", this.onStopMovement.bind(this));

    document.addEventListener("game:elements:attach:layer", this.onAttachLayer.bind(this) as EventListener);

    document.addEventListener("card:magnetize:to", this.onMagnetizeTo.bind(this) as EventListener);

    this.classList.toggle(getCardFamilyColorClass(this.family), true);

    if (this.dataset.slot) {
      const slot = this.dataset.slot;

      this.covers = document.querySelector<GameSlot>(`#play-area game-slot[data-number='${slot}']`)!;
    }

    if (this.dataset.attachNumber && this.dataset.attachFamily) {
      const number = this.dataset.attachNumber;
      const family = this.dataset.attachFamily;

      this.covers = document.querySelector<GameCard>(
        `game-card[data-number='${number}'][data-family='${family}']`
      )!;
    }

    this.dispatchEvent(new Event("game:element:connected", { bubbles: true }));
  }

  disconnectedCallback(): void {
    this.removeEventListener("mousedown", this.onStartMovement.bind(this));
    this.removeEventListener("mousemove", this.onMove.bind(this));
    this.removeEventListener("mouseup", this.onStopMovement.bind(this));
    this.removeEventListener("mouseleave", this.onStopMovement.bind(this));

    document.removeEventListener("game:elements:attach:layer", this.onAttachLayer.bind(this) as EventListener);

    document.removeEventListener("card:magnetize:to", this.onMagnetizeTo.bind(this) as EventListener);
  }

  private onStartMovement(event: MouseEvent): void {
    this.state = State.Moving;
    this.initialX = event.clientX;
    this.initialY = event.clientY;
  }

  private onMove(event: MouseEvent): void {
    if (this.state !== State.Moving) return;

    const newX = event.clientX;
    const newY = event.clientY;

    this.style.top = `${this.offsetTop - (this.initialY - newY)}px`;
    this.style.left = `${this.offsetLeft - (this.initialX - newX)}px`;
    this.initialX = newX;
    this.initialY = newY;
  }

  private onStopMovement(): void {
    if (this.state !== State.Moving) return;

    const domRect: DOMRect = this.getBoundingClientRect();
    const eventInitDict: CustomEventInit<CardMovedEvent> = {
      detail: {
        card: this,
        state: {
          card: { rect: { top: domRect.top, bottom: domRect.bottom, right: domRect.right, left: domRect.left } },
        }
      }
    };

    this.state = State.Settling;

    document.dispatchEvent(new CustomEvent<CardMovedEvent>("card:moved", eventInitDict));

    this.targetMagnetismPower = 0;

    if (this.state !== State.Settling) return;

    this.state = State.Resting;
    this.style.top = `${this.covers.getBoundingClientRect().top}px`;
    this.style.left = `${this.covers.getBoundingClientRect().left}px`;
  }

  private onMagnetizeTo(event: CustomEvent<CardMagnetizeToEvent>): void {
    if (this.state !== State.Settling && this.state !== State.Resting) return;
    if (this.number !== event.detail.card.number) return;
    if (this.family !== event.detail.card.family) return;

    const targetMagnetismPower: number = rectArea(getIntersectionRect(
      event.detail.state.card.rect,
      event.detail.state.target.rect
    ));

    if (this.targetMagnetismPower > targetMagnetismPower) return;

    const covers: GameSlot | GameCard = event.detail.target;

    this.state = State.Resting;
    this.targetMagnetismPower = targetMagnetismPower;
    this.style.top = `${covers.getBoundingClientRect().top}px`;
    this.style.left = `${covers.getBoundingClientRect().left}px`;

    // uncover previous this.covers
    document.dispatchEvent(new CustomEvent<StackableEvent>(
      "stackable:pop",
      { detail: { stackable: this.covers, caller: this } }
    ));

    // cover new this.covers
    document.dispatchEvent(new CustomEvent<StackableEvent>(
      "stackable:push",
      { detail: { stackable: covers, caller: this } }
    ));

    this.covers = covers;
  }

  private onAttachLayer(event: CustomEvent<AttachLayerEvent>): void {
    if (this.state !== State.Loaded) return;
    if (this.layer !== event.detail.layer) return;

    this.state = State.Resting;

    console.log(this.covers);

    if (this.covers instanceof GameSlot) {
      this.style.top = `${this.covers.getBoundingClientRect().top}px`;
      this.style.left = `${this.covers.getBoundingClientRect().left}px`;
    } else {
      this.style.top = `${this.covers.getBoundingClientRect().top + 35}px`;
      this.style.left = `${this.covers.getBoundingClientRect().left}px`;
    }

    this.dispatchEvent(new CustomEvent<StackableEvent>(
      "stackable:push",
      { bubbles: true, detail: { stackable: this.covers, caller: this } }
    ));
  }
}

customElements.define("game-card", GameCard);
