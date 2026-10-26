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
