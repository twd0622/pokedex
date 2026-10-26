// 검색어·세대·타입 세 조건을 모두 만족하는 포켓몬만 남긴다.
// generation, type이 null이면 「전체」라서 거르지 않는다.
export function filterPokemon(list, { query, generation, type }) {
  const keyword = query.trim()
  const isNumber = /^\d+$/.test(keyword)

  return list.filter((pokemon) => {
    if (generation !== null && pokemon.generation !== generation) return false
    if (type !== null && !pokemon.types.includes(type)) return false
    if (keyword === '') return true
    if (isNumber) return pokemon.id === Number(keyword)
    return pokemon.name.includes(keyword)
  })
}
