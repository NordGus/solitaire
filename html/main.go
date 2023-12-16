package html

import (
	"embed"
	"errors"
	"fmt"
	"html/template"
)

var (
	//go:embed templates
	templates embed.FS

	funcs = template.FuncMap{
		"parseCardNumber": func(number uint8, family string) string {
			if family == "arcana" {
				return fmt.Sprintf("%d", number)
			}

			switch number {
			case 13:
				return "K"
			case 12:
				return "Q"
			case 11:
				return "J"
			default:
				return fmt.Sprintf("%d", number)
			}
		},
	}
)

type App struct {
	templates *template.Template
}

func New() (*App, error) {
	tmpls, err := template.New("card").Funcs(funcs).ParseFS(templates, "templates/card.gohtml")
	if err != nil {
		return nil, errors.Join(errors.New("html: something went wrong parsing templates"), err)
	}

	tmpls, err = tmpls.New("family_resting_slot").ParseFS(templates, "templates/family_resting_slot.gohtml")
	if err != nil {
		return nil, errors.Join(errors.New("html: something went wrong parsing templates"), err)
	}

	tmpls, err = tmpls.New("slot").ParseFS(templates, "templates/slot.gohtml")
	if err != nil {
		return nil, errors.Join(errors.New("html: something went wrong parsing templates"), err)
	}

	tmpls, err = tmpls.New("layout").ParseFS(templates, "templates/layout.gohtml")
	if err != nil {
		return nil, errors.Join(errors.New("html: something went wrong parsing templates"), err)
	}

	return &App{
		templates: tmpls,
	}, nil
}
