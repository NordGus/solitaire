import { AttachLayerEvent, CardFamily, CardNumber, StackableEvent } from "@/types.ts";
import CardState from "@Components/card/CardState.ts";
import LoadedState from "@Components/card/states/LoadedState.ts";
import RestingState from "@Components/card/states/RestingState.ts";
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

// TODO: Change how covers and coveredBy works in the new Drag and Drop API flow
export default class Card extends HTMLElement {
  static TOP_OFFSET: number = 28;

  private _state: CardState
  private _covers: Card | Slot | RestingSlot | null
  private _coveredBy: Card | null
  private _layer: number

  public readonly number: CardNumber
  public readonly family: CardFamily

  constructor() {
    super();

    this._state = new LoadedState(this);
    this._covers = null;
    this._coveredBy = null;
    this._layer = parseInt(this.dataset.layer!);

    this.number = parseInt(this.dataset.number!) as CardNumber;
    this.family = this.dataset.family! as CardFamily;

    this.classList.toggle(getCardBackgroundColorClass(this.family), true);
    this.classList.toggle(getCardTextColorClass(this.family), true);
    this.classList.toggle(getCardBorderColorClass(this.family), true);

    this.style.top = "5rem";
    this.style.left = `${(this.parentElement!.offsetWidth - this.offsetWidth)/2}px`;
  }

  get state(): CardState { return this._state }
  set state(state: CardState) { this._state = state }

  get covers(): Card | Slot | RestingSlot | null { return this._covers }
  set covers(covers: Card | Slot | RestingSlot | null) { this._covers = covers }

  get coveredBy(): Card | null { return this._coveredBy }
  set coveredBy(coveredBy: Card | null) { this._coveredBy = coveredBy }

  get layer(): number { return this._layer }
  set layer(layer: number) { this._layer = layer }

  connectedCallback(): void {
    this.addEventListener("dragstart", this.onDragStart.bind(this));
    this.addEventListener("dragend", this.onDragEnd.bind(this));

    this.addEventListener("stackable:push", this.onPush.bind(this) as EventListener);
    this.addEventListener("stackable:pop", this.onPop.bind(this) as EventListener);
    this.addEventListener("card:flush:append", this.onFlushAppend.bind(this) as EventListener);

    document.addEventListener("card:moved:settled", this.onCardMovementSettled.bind(this) as EventListener);

    document.addEventListener("game:elements:attach:layer", this.onAttach.bind(this) as EventListener);

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
    this.removeEventListener("dragend", this.onDragEnd.bind(this));

    this.removeEventListener("stackable:push", this.onPush.bind(this) as EventListener);
    this.removeEventListener("stackable:pop", this.onPop.bind(this) as EventListener);
    this.removeEventListener("card:flush:append", this.onFlushAppend.bind(this) as EventListener);

    document.removeEventListener("card:moved:settled", this.onCardMovementSettled.bind(this) as EventListener);

    document.removeEventListener("game:elements:attach:layer", this.onAttach.bind(this) as EventListener);
  }

  private onDragStart(event: DragEvent): void { this._state.onDragStart(event) }
  private onDragEnd(): void { this._state.onDragEnd() }
  private onAttach(event: CustomEvent<AttachLayerEvent>): void { this._state.onAttach(event) }
  private onCardMovementSettled(): void { this._state.onCardMovementSettled() }
  private onFlushAppend(event: CustomEvent<StackableEvent>): void { this._state.onFlushAppend(event) }

  private onPush(event: CustomEvent<StackableEvent>): void {
    if (this._coveredBy !== null) return;

    this._coveredBy = event.detail.card;

    if (this._state instanceof RestingState) return;

    this.setAttribute("draggable", "false");
    this.classList.toggle("cursor-grab", false);
  }

  private onPop(): void {
    if (this._coveredBy === null) return;

    this._coveredBy = null;

    if (this._state instanceof RestingState) return;

    this.setAttribute("draggable", "true");
    this.classList.toggle("cursor-grab", true);
  }
}

customElements.define("game-card", Card);
