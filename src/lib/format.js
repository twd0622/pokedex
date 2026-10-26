// 도감 번호를 '#0006'처럼 4자리로 맞춘다.
export function formatNumber(id) {
  return '#' + String(id).padStart(4, '0')
}

// 포켓몬(모습) id로 공식 일러스트 주소를 만든다.
export function artworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}
