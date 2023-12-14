package html

import (
	"github.com/go-chi/chi/v5"
	"net/http"
)

const (
	cupsCard   = "cups"
	swordsCard = "swords"
	clubsCard  = "clubs"
	goldsCard  = "golds"
	arcanaCard = "arcana"
)

type BoardState struct {
	Slots []Slot
	Cards []Card
}

type Card struct {
	Number uint8
	Family string
	Slot   uint8
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
			Cards: []Card{
				{Number: 2, Family: cupsCard, Slot: 0},
				{Number: 15, Family: arcanaCard, Slot: 1},
				{Number: 5, Family: cupsCard, Slot: 2},
				{Number: 3, Family: clubsCard, Slot: 3},
				{Number: 7, Family: arcanaCard, Slot: 4},
				{Number: 11, Family: swordsCard, Slot: 6},
				{Number: 13, Family: goldsCard, Slot: 7},
				{Number: 2, Family: swordsCard, Slot: 8},
				{Number: 6, Family: swordsCard, Slot: 9},
				{Number: 8, Family: swordsCard, Slot: 10},
			},
		}

		err := a.templates.ExecuteTemplate(writer, "layout", data)
		if err != nil {
			http.Error(writer, err.Error(), http.StatusInternalServerError)
		}
	})
}
