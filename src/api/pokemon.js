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

// 포켓몬 한 종의 상세 정보와 모든 모습을 받는다. 없는 번호면 null.
export async function fetchPokemonDetail(id) {
  const data = await gql(DETAIL_QUERY, { id })
  return data.pokemonspecies[0] ?? null
}
