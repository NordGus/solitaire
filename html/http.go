package html

import (
	"github.com/NordGus/solitaire/html/cards"
	"github.com/go-chi/chi/v5"
	"net/http"
)

type BoardState struct {
	Slots []Slot
	Cards []CardData
}

type CardData struct {
	Card cards.Card

	IsAttachToSlot bool
	Slot           uint8

	IsAttachToCard bool
	AttachToCard   cards.Card

	Layer uint8
}

type Slot struct {
	Number uint8
}

func (a *App) Routes(router chi.Router) {
	router.Get("/", func(writer http.ResponseWriter, _ *http.Request) {
		slots := make([]Slot, 11)

		for i := uint8(0); i < uint8(len(slots)); i++ {
			slots[i].Number = i
		}

		data := BoardState{
			Slots: slots,
			Cards: []CardData{
				// Layer 1
				{Card: cards.Cups[2], IsAttachToSlot: true, Slot: 0, Layer: 1},
				{Card: cards.Arcana[15], IsAttachToSlot: true, Slot: 1, Layer: 1},
				{Card: cards.Cups[5], IsAttachToSlot: true, Slot: 2, Layer: 1},
				{Card: cards.Clubs[3], IsAttachToSlot: true, Slot: 3, Layer: 1},
				{Card: cards.Arcana[7], IsAttachToSlot: true, Slot: 4, Layer: 1},
				{Card: cards.Swords[11], IsAttachToSlot: true, Slot: 6, Layer: 1},
				{Card: cards.Golds[13], IsAttachToSlot: true, Slot: 7, Layer: 1},
				{Card: cards.Swords[2], IsAttachToSlot: true, Slot: 8, Layer: 1},
				{Card: cards.Swords[6], IsAttachToSlot: true, Slot: 9, Layer: 1},
				{Card: cards.Swords[8], IsAttachToSlot: true, Slot: 10, Layer: 1},
				// Layer 2
				{Card: cards.Arcana[21], IsAttachToCard: true, AttachToCard: cards.Cups[2], Layer: 2},
				{Card: cards.Cups[9], IsAttachToCard: true, AttachToCard: cards.Arcana[15], Layer: 2},
				{Card: cards.Arcana[19], IsAttachToCard: true, AttachToCard: cards.Cups[5], Layer: 2},
				{Card: cards.Swords[10], IsAttachToCard: true, AttachToCard: cards.Clubs[3], Layer: 2},
				{Card: cards.Arcana[20], IsAttachToCard: true, AttachToCard: cards.Arcana[7], Layer: 2},
				{Card: cards.Arcana[14], IsAttachToCard: true, AttachToCard: cards.Swords[11], Layer: 2},
				{Card: cards.Arcana[13], IsAttachToCard: true, AttachToCard: cards.Golds[13], Layer: 2},
				{Card: cards.Cups[6], IsAttachToCard: true, AttachToCard: cards.Swords[2], Layer: 2},
				{Card: cards.Swords[4], IsAttachToCard: true, AttachToCard: cards.Swords[6], Layer: 2},
				{Card: cards.Golds[4], IsAttachToCard: true, AttachToCard: cards.Swords[8], Layer: 2},
				// Layer 3
				{Card: cards.Golds[2], IsAttachToCard: true, AttachToCard: cards.Arcana[21], Layer: 3},
				{Card: cards.Arcana[9], IsAttachToCard: true, AttachToCard: cards.Cups[9], Layer: 3},
				{Card: cards.Arcana[11], IsAttachToCard: true, AttachToCard: cards.Arcana[19], Layer: 3},
				{Card: cards.Clubs[5], IsAttachToCard: true, AttachToCard: cards.Swords[10], Layer: 3},
				{Card: cards.Arcana[0], IsAttachToCard: true, AttachToCard: cards.Arcana[20], Layer: 3},
				{Card: cards.Cups[10], IsAttachToCard: true, AttachToCard: cards.Arcana[14], Layer: 3},
				{Card: cards.Clubs[4], IsAttachToCard: true, AttachToCard: cards.Arcana[13], Layer: 3},
				{Card: cards.Arcana[10], IsAttachToCard: true, AttachToCard: cards.Cups[6], Layer: 3},
				{Card: cards.Cups[13], IsAttachToCard: true, AttachToCard: cards.Swords[4], Layer: 3},
				{Card: cards.Golds[8], IsAttachToCard: true, AttachToCard: cards.Golds[4], Layer: 3},
				// Layer 4
				{Card: cards.Clubs[2], IsAttachToCard: true, AttachToCard: cards.Golds[2], Layer: 4},
				{Card: cards.Swords[7], IsAttachToCard: true, AttachToCard: cards.Arcana[9], Layer: 4},
				{Card: cards.Cups[8], IsAttachToCard: true, AttachToCard: cards.Arcana[11], Layer: 4},
				{Card: cards.Swords[3], IsAttachToCard: true, AttachToCard: cards.Clubs[5], Layer: 4},
				{Card: cards.Golds[7], IsAttachToCard: true, AttachToCard: cards.Arcana[0], Layer: 4},
				{Card: cards.Golds[10], IsAttachToCard: true, AttachToCard: cards.Cups[10], Layer: 4},
				{Card: cards.Golds[5], IsAttachToCard: true, AttachToCard: cards.Clubs[4], Layer: 4},
				{Card: cards.Clubs[12], IsAttachToCard: true, AttachToCard: cards.Arcana[10], Layer: 4},
				{Card: cards.Golds[11], IsAttachToCard: true, AttachToCard: cards.Cups[13], Layer: 4},
				{Card: cards.Swords[13], IsAttachToCard: true, AttachToCard: cards.Golds[8], Layer: 4},
				// Layer 5
				{Card: cards.Arcana[5], IsAttachToCard: true, AttachToCard: cards.Clubs[2], Layer: 5},
				{Card: cards.Arcana[3], IsAttachToCard: true, AttachToCard: cards.Swords[7], Layer: 5},
				{Card: cards.Arcana[16], IsAttachToCard: true, AttachToCard: cards.Cups[8], Layer: 5},
				{Card: cards.Cups[4], IsAttachToCard: true, AttachToCard: cards.Swords[3], Layer: 5},
				{Card: cards.Arcana[1], IsAttachToCard: true, AttachToCard: cards.Golds[7], Layer: 5},
				{Card: cards.Clubs[7], IsAttachToCard: true, AttachToCard: cards.Golds[10], Layer: 5},
				{Card: cards.Cups[3], IsAttachToCard: true, AttachToCard: cards.Golds[5], Layer: 5},
				{Card: cards.Arcana[6], IsAttachToCard: true, AttachToCard: cards.Clubs[12], Layer: 5},
				{Card: cards.Golds[9], IsAttachToCard: true, AttachToCard: cards.Golds[11], Layer: 5},
				{Card: cards.Cups[12], IsAttachToCard: true, AttachToCard: cards.Swords[13], Layer: 5},
				// Layer 6
				{Card: cards.Clubs[8], IsAttachToCard: true, AttachToCard: cards.Arcana[5], Layer: 6},
				{Card: cards.Arcana[18], IsAttachToCard: true, AttachToCard: cards.Arcana[3], Layer: 6},
				{Card: cards.Arcana[12], IsAttachToCard: true, AttachToCard: cards.Arcana[16], Layer: 6},
				{Card: cards.Clubs[13], IsAttachToCard: true, AttachToCard: cards.Cups[4], Layer: 6},
				{Card: cards.Golds[3], IsAttachToCard: true, AttachToCard: cards.Arcana[1], Layer: 6},
				{Card: cards.Swords[12], IsAttachToCard: true, AttachToCard: cards.Clubs[7], Layer: 6},
				{Card: cards.Clubs[11], IsAttachToCard: true, AttachToCard: cards.Cups[3], Layer: 6},
				{Card: cards.Arcana[2], IsAttachToCard: true, AttachToCard: cards.Arcana[6], Layer: 6},
				{Card: cards.Arcana[17], IsAttachToCard: true, AttachToCard: cards.Golds[9], Layer: 6},
				{Card: cards.Swords[5], IsAttachToCard: true, AttachToCard: cards.Cups[12], Layer: 6},
				// Layer 7
				{Card: cards.Clubs[9], IsAttachToCard: true, AttachToCard: cards.Clubs[8], Layer: 7},
				{Card: cards.Arcana[4], IsAttachToCard: true, AttachToCard: cards.Arcana[18], Layer: 7},
				{Card: cards.Clubs[6], IsAttachToCard: true, AttachToCard: cards.Arcana[12], Layer: 7},
				{Card: cards.Arcana[8], IsAttachToCard: true, AttachToCard: cards.Clubs[13], Layer: 7},
				{Card: cards.Swords[9], IsAttachToCard: true, AttachToCard: cards.Golds[3], Layer: 7},
				{Card: cards.Clubs[10], IsAttachToCard: true, AttachToCard: cards.Swords[12], Layer: 7},
				{Card: cards.Golds[12], IsAttachToCard: true, AttachToCard: cards.Clubs[11], Layer: 7},
				{Card: cards.Golds[6], IsAttachToCard: true, AttachToCard: cards.Arcana[2], Layer: 7},
				{Card: cards.Cups[11], IsAttachToCard: true, AttachToCard: cards.Arcana[17], Layer: 7},
				{Card: cards.Cups[7], IsAttachToCard: true, AttachToCard: cards.Swords[5], Layer: 7},
			},
		}

		err := a.templates.ExecuteTemplate(writer, "layout", data)
		if err != nil {
			http.Error(writer, err.Error(), http.StatusInternalServerError)
		}
	})
}
