import { formatNumber } from './format'

// 목록 쿼리 응답(species 배열)을 화면에서 쓰기 쉬운 모양으로 바꾼다.
// { id, name, generation, types }
export function normalizeList(rawSpecies) {
  return rawSpecies.map((species) => ({
    id: species.id,
    name: species.pokemonspeciesnames[0]?.name ?? formatNumber(species.id),
    generation: species.generation_id,
    types: species.pokemons[0].pokemontypes.map((t) => t.type.name),
  }))
}
