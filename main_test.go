package main

import (
	"reflect"
	"testing"
)

func TestParseSlugs(t *testing.T) {
	for _, test := range []struct {
		input string
		want  []string
	}{
		{"sahaba", []string{"sahaba"}},
		{" sahaba , coteaux-94, sahaba, ,coteaux-94 ", []string{"sahaba", "coteaux-94"}},
	} {
		got, err := parseSlugs(test.input)
		if err != nil || !reflect.DeepEqual(got, test.want) {
			t.Errorf("parseSlugs(%q) = %v, %v; want %v", test.input, got, err, test.want)
		}
	}
	for _, input := range []string{"", " , ", "../outside", "valid,../outside", "a/b", `a\b`, "a?query", "a#fragment", "Sahaba", "mosquée", "a b"} {
		got, err := parseSlugs(input)
		if err == nil || got != nil {
			t.Errorf("parseSlugs(%q) must reject the entire configuration, got %v, %v", input, got, err)
		}
	}
}
