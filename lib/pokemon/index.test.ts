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
  fusionNameFirst: "Bulba",
  fusionNameSecond: "saur",
};

describe("emojiFor", () => {
  test("uses the Pokémon's emoji when specified", () => {
    const result = emojiFor({ ...basePokemon, emoji: "boop", rolls: [] });
    expect(result).toBe("boop");
  });

  test("uses the Pokémon's name when no emoji is specified", () => {
    const result = emojiFor({
      ...basePokemon,
      name: "Bulbasaur",
      emoji: "",
      rolls: [],
    });
    expect(result).toBe("bulbasaur");
  });

  test("uses sparkles when it's not a generation one Poké", () => {
    const result = emojiFor({
      ...basePokemon,
      number: 200,
      emoji: null,
      rolls: [],
    });
    expect(result).toBe("sparkles");
  });
});
