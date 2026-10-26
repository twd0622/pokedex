import { GROWTH_RATES, HABITATS } from '../data/labels'
import { formatNumber } from './format'

const MAX_POKEMON_ID = 1025

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

// 주소의 :id 부분을 도감 번호로 바꾼다. 잘못된 값이면 null.
export function parsePokemonId(param) {
  if (!/^\d+$/.test(param)) return null
  const id = Number(param)
  return id >= 1 && id <= MAX_POKEMON_ID ? id : null
}

// 게임 문구에 섞인 줄바꿈(\n)과 페이지 넘김(\f) 문자를 공백 하나로 바꾼다.
function cleanText(text) {
  return text.replace(/[\n\f\s]+/g, ' ').trim()
}

// API의 능력치 이름 → 우리 코드의 이름
const STAT_KEYS = {
  hp: 'hp',
  attack: 'attack',
  defense: 'defense',
  'special-attack': 'specialAttack',
  'special-defense': 'specialDefense',
  speed: 'speed',
}

// 모습 하나(pokemon)를 정리한다. 키는 dm, 몸무게는 hg 단위라서 10으로 나눈다.
function normalizeForm(pokemon) {
  const stats = {}
  for (const s of pokemon.pokemonstats) {
    stats[STAT_KEYS[s.stat.name]] = s.base_stat
  }

  const form = pokemon.pokemonforms[0]
  return {
    pokemonId: pokemon.id,
    formName: form?.form_name ?? '',
    koFormName: form?.pokemonformnames[0]?.name || null,
    isDefault: pokemon.is_default,
    heightM: pokemon.height / 10,
    weightKg: pokemon.weight / 10,
    types: pokemon.pokemontypes.map((t) => t.type.name),
    stats,
    abilities: pokemon.pokemonabilities.map((a) => ({
      name: a.ability.abilitynames[0]?.name ?? '',
      description: cleanText(a.ability.abilityflavortexts[0]?.flavor_text ?? ''),
      isHidden: a.is_hidden,
    })),
  }
}

// 상세 쿼리 응답(species 하나)을 상세 화면용 모양으로 바꾼다.
export function normalizeDetail(species) {
  const names = species.pokemonspeciesnames[0]
  const forms = species.pokemons.map(normalizeForm)
  // 기본 모습을 맨 앞으로. 나머지 순서는 그대로 둔다.
  forms.sort((a, b) => Number(b.isDefault) - Number(a.isDefault))

  return {
    id: species.id,
    name: names?.name ?? formatNumber(species.id),
    genus: names?.genus ?? '',
    flavorText: cleanText(species.pokemonspeciesflavortexts[0]?.flavor_text ?? ''),
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
    generation: species.generation_id,
    genderFemalePercent: species.gender_rate === -1 ? null : (species.gender_rate / 8) * 100,
    captureRate: species.capture_rate,
    hatchSteps: species.hatch_counter * 257,
    growthRate: GROWTH_RATES[species.growthrate?.name] ?? '정보 없음',
    habitat: HABITATS[species.pokemonhabitat?.name] ?? null,
    color: species.pokemoncolor?.pokemoncolornames[0]?.name ?? '',
    eggGroups: species.pokemonegggroups.map((g) => g.egggroup.egggroupnames[0]?.name ?? ''),
    evolutionChainId: species.evolution_chain_id,
    forms,
  }
}
