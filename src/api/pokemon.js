import { gql } from './graphql'

const LIST_QUERY = `{
  pokemonspecies(order_by: {id: asc}) {
    id
    generation_id
    pokemonspeciesnames(where: {language: {name: {_eq: "ko"}}}) { name }
    pokemons(where: {is_default: {_eq: true}}) {
      pokemontypes(order_by: {slot: asc}) { type { name } }
    }
  }
}`

// 1,025종 전체의 번호, 세대, 한국어 이름, 타입을 한 번에 받는다.
export async function fetchPokemonList() {
  const data = await gql(LIST_QUERY)
  return data.pokemonspecies
}

// 한국어만 고르는 조건. 여러 곳에서 반복돼서 이름을 붙였다.
const KO = '{language: {name: {_eq: "ko"}}}'

const DETAIL_QUERY = `query Detail($id: Int!) {
  pokemonspecies(where: {id: {_eq: $id}}) {
    id is_legendary is_mythical gender_rate capture_rate hatch_counter
    evolution_chain_id generation_id
    pokemonspeciesnames(where: ${KO}) { name genus }
    pokemonspeciesflavortexts(where: ${KO}, order_by: {version_id: desc}, limit: 1) { flavor_text }
    growthrate { name }
    pokemonhabitat { name }
    pokemoncolor { pokemoncolornames(where: ${KO}) { name } }
    pokemonegggroups { egggroup { egggroupnames(where: ${KO}) { name } } }
    pokemons(order_by: {id: asc}) {
      id is_default height weight
      pokemontypes(order_by: {slot: asc}) { type { name } }
      pokemonstats { base_stat stat { name } }
      pokemonabilities(order_by: {slot: asc}) {
        is_hidden
        ability {
          abilitynames(where: ${KO}) { name }
          abilityflavortexts(where: ${KO}, order_by: {version_group_id: desc}, limit: 1) { flavor_text }
        }
      }
      pokemonforms { form_name pokemonformnames(where: ${KO}) { name } }
    }
  }
}`

const EVOLUTION_QUERY = `query Evolution($id: Int!) {
  evolutionchain(where: {id: {_eq: $id}}) {
    pokemonspecies(order_by: {order: asc}) {
      id
      evolves_from_species_id
      pokemonspeciesnames(where: ${KO}) { name }
      pokemonevolutions {
        min_level min_happiness min_affection time_of_day
        evolutiontrigger { name }
        item { itemnames(where: ${KO}) { name } }
        move { movenames(where: ${KO}) { name } }
      }
    }
  }
}`

// 진화 계열에 속한 종들과 진화 조건을 받는다.
export async function fetchEvolutionChain(chainId) {
  const data = await gql(EVOLUTION_QUERY, { id: chainId })
  return data.evolutionchain[0]?.pokemonspecies ?? []
}

const MOVE_VERSIONS_QUERY = `query MoveVersions($pokemonId: Int!) {
  pokemonmove(
    where: {pokemon_id: {_eq: $pokemonId}}
    distinct_on: [version_group_id, move_learn_method_id]
  ) {
    version_group_id
    movelearnmethod { name }
    versiongroup { order versions { name versionnames(where: ${KO}) { name } } }
  }
}`

// 이 포켓몬(모습)이 기술을 배우는 (버전 그룹, 방법) 쌍을 모두 받는다.
export async function fetchMoveVersionGroups(pokemonId) {
  const data = await gql(MOVE_VERSIONS_QUERY, { pokemonId })
  return data.pokemonmove
}

const MOVES_QUERY = `query Moves($pokemonId: Int!, $versionGroupId: Int!, $method: String!) {
  pokemonmove(where: {
    pokemon_id: {_eq: $pokemonId}
    version_group_id: {_eq: $versionGroupId}
    movelearnmethod: {name: {_eq: $method}}
  }) {
    level
    move { power accuracy type { name } movenames(where: ${KO}) { name } }
  }
}`

// 한 버전에서 한 가지 방법으로 배우는 기술 목록을 받는다.
export async function fetchMoves(pokemonId, versionGroupId, method) {
  const data = await gql(MOVES_QUERY, { pokemonId, versionGroupId, method })
  return data.pokemonmove
}

const ENCOUNTERS_QUERY = `query Encounters($pokemonId: Int!) {
  encounter(
    where: {pokemon_id: {_eq: $pokemonId}}
    distinct_on: [version_id, location_area_id, encounter_slot_id]
  ) {
    version { id name versionnames(where: ${KO}) { name } versiongroup { order } }
    locationarea { location { name locationnames(where: ${KO}) { name } } }
    encounterslot { encountermethod { name } }
  }
}`

// 게임별로 야생에서 만나는 장소를 받는다.
export async function fetchEncounters(pokemonId) {
  const data = await gql(ENCOUNTERS_QUERY, { pokemonId })
  return data.encounter
}

// 포켓몬 한 종의 상세 정보와 모든 모습을 받는다. 없는 번호면 null.
export async function fetchPokemonDetail(id) {
  const data = await gql(DETAIL_QUERY, { id })
  return data.pokemonspecies[0] ?? null
}
