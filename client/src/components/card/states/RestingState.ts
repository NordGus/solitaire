import { AttachLayerEvent, CardMagnetizeToEvent, CardMovedEvent } from "@/types.ts";
import Card from "@Components/Card.ts";
import CardState from "@Components/card/CardState.ts";

// TODO: Implement future logic to connect cards here.
export default class RestingState extends CardState {
  constructor(card: Card) {
    super(card);

    this._card.classList.toggle("cursor-move", false);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttach(_event: CustomEvent<AttachLayerEvent>): CardState { return this }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStartMovement(_event: MouseEvent): CardState { return this }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove(_event: MouseEvent): CardState { return this }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStopMovement(): CardState { return this }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMagnetize(_event: CustomEvent<CardMagnetizeToEvent>): CardState { return this }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCardMoved(_event: CustomEvent<CardMovedEvent>): CardState { return this }
}
