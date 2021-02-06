import { emojiFor } from "./";

const basePokemon = {
  number: 1,
  generation: 1,
  name: "Bulbasaur",
  classification: "",
  primaryType: "",
  secondaryType: null,
  isLegendary: false,
  hp: 123,
  attack: 20,
  defense: 20,
  speed: 20,
  specialDefense: 20,
  specialAttack: 20,
};

describe("emojiFor", () => {
  test("uses the Pokémon's emoji when specified", () => {
    const result = emojiFor({ ...basePokemon, emoji: "boop" });
    expect(result).toBe("boop");
  });

  test("uses the Pokémon's name when no emoji is specified", () => {
    const result = emojiFor({ ...basePokemon, name: "Bulbasaur", emoji: "" });
    expect(result).toBe("bulbasaur");
  });

  test("uses sparkles when it's not a generation one Poké", () => {
    const result = emojiFor({ ...basePokemon, number: 200, emoji: null });
    expect(result).toBe("sparkles");
  });
});

describe("failure", () => {
  test("fails", () => {
    expect(1).toBe(2);
  });
});
