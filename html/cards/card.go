package cards

const (
	cupsFamily   = "cups"
	swordsFamily = "swords"
	clubsFamily  = "clubs"
	goldsFamily  = "golds"
	arcanaFamily = "arcana"
)

type Card struct {
	Number uint8
	Family string
	Name   string
}
