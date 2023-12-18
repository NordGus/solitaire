import {
  AttachLayerEvent,
  CardFamily,
  CardMagnetizeToEvent,
  CardMovedEvent,
  CardNumber,
  StackableEvent
} from "@/types.ts";
import CardState from "@Components/card/CardState.ts";
import LoadedState from "@Components/card/states/LoadedState.ts";
import RestingSlot from "@Components/RestingSlot.ts";
import Slot from "@Components/Slot.ts";

function getCardFamilyColorClass(family: CardFamily): string {
  if (family === "swords") return "text-blue-700";
  if (family === "clubs") return "text-green-600";
  if (family === "golds") return "text-yellow-600";
  if (family === "cups") return "text-red-700";
  if (family === "arcana") return "text-amber-500";
  return "";
}

export default class Card extends HTMLElement {
  static TOP_OFFSET: number = 28;

  private _state: CardState
  private _covers: Card | Slot | RestingSlot
  private _coveredBy: Card | null
  private readonly _layer: number

  public readonly number: CardNumber
  public readonly family: CardFamily

  constructor() {
    super();

    this._state = new LoadedState(this);
    this._covers = this;
    this._coveredBy = null;
    this._layer = parseInt(this.dataset.layer!);

    this.number = parseInt(this.dataset.number!) as CardNumber;
    this.family = this.dataset.family! as CardFamily;
  }

  get state(): CardState { return this._state }
  setState(state: CardState) { this._state = state }

  get covers(): Card | Slot | RestingSlot { return this._covers }
  setCovers(covers: Card | Slot | RestingSlot): void { this._covers = covers }

  get coveredBy(): Card | null { return this._coveredBy }

  get layer(): number { return this._layer }

  connectedCallback(): void {
    this.addEventListener("mousedown", this.onStartMovement.bind(this));
    this.addEventListener("mousemove", this.onMove.bind(this));
    this.addEventListener("mouseup", this.onStopMovement.bind(this));
    this.addEventListener("mouseleave", this.onStopMovement.bind(this));

    document.addEventListener("card:moved", this.onCardMoved.bind(this) as EventListener);
    document.addEventListener("stackable:push", this.onPush.bind(this) as EventListener);
    document.addEventListener("stackable:pop", this.onPop.bind(this) as EventListener);

    document.addEventListener("game:elements:attach:layer", this.onAttachLayer.bind(this) as EventListener);

    document.addEventListener("card:magnetize:to", this.onMagnetizeTo.bind(this) as EventListener);

    this.classList.toggle(getCardFamilyColorClass(this.family), true);

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
    this.removeEventListener("mousedown", this.onStartMovement.bind(this));
    this.removeEventListener("mousemove", this.onMove.bind(this));
    this.removeEventListener("mouseup", this.onStopMovement.bind(this));
    this.removeEventListener("mouseleave", this.onStopMovement.bind(this));

    document.removeEventListener("card:moved", this.onCardMoved.bind(this) as EventListener);
    document.removeEventListener("stackable:push", this.onPush.bind(this) as EventListener);
    document.removeEventListener("stackable:pop", this.onPop.bind(this) as EventListener);

    document.removeEventListener("game:elements:attach:layer", this.onAttachLayer.bind(this) as EventListener);

    document.removeEventListener("card:magnetize:to", this.onMagnetizeTo.bind(this) as EventListener);
  }

  private onStartMovement(event: MouseEvent): void { this._state = this._state.onStartMovement(event) }
  private onMove(event: MouseEvent): void { this._state = this._state.onMove(event) }
  private onStopMovement(): void { this._state = this._state.onStopMovement() }
  private onMagnetizeTo(event: CustomEvent<CardMagnetizeToEvent>): void { this._state = this._state.onMagnetize(event) }
  private onAttachLayer(event: CustomEvent<AttachLayerEvent>): void { this._state = this._state.onAttach(event) }
  private onCardMoved(event: CustomEvent<CardMovedEvent>): void { this._state = this._state.onCardMoved(event) }

  private onPush(event: CustomEvent<StackableEvent>): void {
    if (event.detail.stackable !== this) return;
    if (this._coveredBy !== null) return;

    this._coveredBy = event.detail.caller;
  }

  private onPop(event: CustomEvent<StackableEvent>): void {
    if (event.detail.stackable !== this) return;
    if (this._coveredBy === null) return;
    if (event.detail.caller !== this._coveredBy) return;

    this._coveredBy = null;
  }
}

customElements.define("game-card", Card);
