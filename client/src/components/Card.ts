import { AttachLayerEvent, CardFamily, CardNumber, StackableEvent } from "@/types.ts";
import RestingSlot from "@Components/RestingSlot.ts";
import Slot from "@Components/Slot.ts";

function getCardBackgroundColorClass(family: CardFamily): string {
  if (family === "arcana") return "bg-gray-900";
  return "bg-amber-100";
}

function getCardTextColorClass(family: CardFamily): string {
  if (family === "swords") return "text-blue-700";
  if (family === "clubs") return "text-green-600";
  if (family === "golds") return "text-yellow-600";
  if (family === "cups") return "text-red-700";
  if (family === "arcana") return "text-amber-500";
  return "";
}

function getCardBorderColorClass(family: CardFamily): string {
  if (family === "swords") return "border-blue-700";
  if (family === "clubs") return "border-green-600";
  if (family === "golds") return "border-yellow-600";
  if (family === "cups") return "border-red-700";
  if (family === "arcana") return "border-amber-600";
  return "";
}

enum State {
  Connected = "connected",
  InPlay = "inPlay",
  Resting = "resting"
}

export default class Card extends HTMLElement {
  static TOP_OFFSET: number = 28;

  private _state: State
  private _covers: Card | Slot | RestingSlot | null
  private _layer: number

  public readonly number: CardNumber
  public readonly family: CardFamily

  constructor() {
    super();

    this._state = State.Connected;
    this._covers = null;
    this._layer = parseInt(this.dataset.layer!);

    this.number = parseInt(this.dataset.number!) as CardNumber;
    this.family = this.dataset.family! as CardFamily;

    this.classList.toggle(getCardBackgroundColorClass(this.family), true);
    this.classList.toggle(getCardTextColorClass(this.family), true);
    this.classList.toggle(getCardBorderColorClass(this.family), true);

    this.style.top = "5rem";
    this.style.left = `${(this.parentElement!.offsetWidth - this.offsetWidth)/2}px`;
  }

  get layer(): number { return this._layer }
  set layer(layer: number) { this._layer = layer }

  connectedCallback(): void {
    this.addEventListener("dragstart", this.onDragStart.bind(this));

    document.addEventListener("attach:layer", this.onAttach.bind(this) as EventListener);

    if (this.dataset.slot) {
      this._covers = document.querySelector<Slot>(`#play-area game-slot[data-number='${this.dataset.slot}']`)!;
    }

    if (this.dataset.attachNumber && this.dataset.attachFamily) {
      this._covers = document.querySelector<Card>(
        `game-card[data-number='${this.dataset.attachNumber}'][data-family='${this.dataset.attachFamily}']`
      )!;
    }

    if (this.dataset.isResting) {
      this._covers = document.querySelector<RestingSlot>(`game-resting-slot[data-family='${this.family}']`)!;
    }

    this.dispatchEvent(new Event("game:element:connected", { bubbles: true }));
  }

  disconnectedCallback(): void {
    this.removeEventListener("dragstart", this.onDragStart.bind(this));

    document.removeEventListener("attach:layer", this.onAttach.bind(this) as EventListener);
  }

  cover(): void {
    if (this._state === State.Resting) return;

    this.setAttribute("draggable", "false");
    this.classList.toggle("cursor-grab", false);
  }

  uncover(): void {
    if (this._state === State.Resting) return;

    this.setAttribute("draggable", "true");
    this.classList.toggle("cursor-grab", true);
  }

  rest(): void {
    if (this._state === State.Resting) return;

    this.cover();
    this._state = State.Resting;
  }

  private onDragStart(event: DragEvent): void {
    if (this._state !== State.InPlay) return;

    const transfer = event.dataTransfer!;

    transfer.setData("family", this.family);
    transfer.setData("number", `${this.number}`);
  }

  private onAttach(event: CustomEvent<AttachLayerEvent>): void {
    if (this._state !== State.Connected) return;
    if (this._layer !== event.detail.layer) return;
    if (this._covers === null) throw new Error("invalid initial state");

    const covers = this._covers;

    this._covers = null;
    this._state = covers instanceof RestingSlot ? State.Resting : State.InPlay;
    this.style.removeProperty("left");
    this.style.removeProperty("top");

    covers.dispatchEvent(new CustomEvent<StackableEvent>("slot:push", { bubbles: true, detail: { card: this } }));
  }
}

customElements.define("game-card", Card);
