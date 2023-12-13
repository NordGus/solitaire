package html

import (
	"github.com/go-chi/chi/v5"
	"net/http"
)

type BoardState struct {
	Slots []Slot
	Card  Card
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
			Card:  Card{Number: 5, Family: "swords", Slot: 0},
		}

		err := a.templates.ExecuteTemplate(writer, "layout.gohtml", data)
		if err != nil {
			http.Error(writer, err.Error(), http.StatusInternalServerError)
		}
	})
}
