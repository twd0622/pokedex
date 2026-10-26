// 타입 18개의 한국어 이름과 배지 색. 키는 PokeAPI가 쓰는 영어 이름이다.
export const TYPES = {
  normal: { ko: '노말', color: '#a8a77a' },
  fire: { ko: '불꽃', color: '#ee8130' },
  water: { ko: '물', color: '#6390f0' },
  electric: { ko: '전기', color: '#d4a900' },
  grass: { ko: '풀', color: '#7ac74c' },
  ice: { ko: '얼음', color: '#96d9d6' },
  fighting: { ko: '격투', color: '#c22e28' },
  poison: { ko: '독', color: '#a33ea1' },
  ground: { ko: '땅', color: '#e2bf65' },
  flying: { ko: '비행', color: '#a98ff3' },
  psychic: { ko: '에스퍼', color: '#f95587' },
  bug: { ko: '벌레', color: '#a6b91a' },
  rock: { ko: '바위', color: '#b6a136' },
  ghost: { ko: '고스트', color: '#735797' },
  dragon: { ko: '드래곤', color: '#6f35fc' },
  dark: { ko: '악', color: '#705746' },
  steel: { ko: '강철', color: '#b7b7ce' },
  fairy: { ko: '페어리', color: '#d685ad' },
}

// 게임 도감에서 쓰는 공식 타입 순서
export const TYPE_ORDER = Object.keys(TYPES)
