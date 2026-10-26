// 목록을 브라우저 저장소에 넣어 두고 다음 방문 때 바로 꺼내 쓴다.
// 저장 형식을 바꾸게 되면 키 끝의 v1을 v2로 올려서 예전 값을 무시한다.
const CACHE_KEY = 'pokedex:list:v1'

// 화면이 쓰는 모양 { id, name, generation, types }인지 확인한다.
// 모양이 다른 값을 그대로 쓰면 카드를 그리다가 앱 전체가 멈춘다.
function isSummary(item) {
  return (
    typeof item?.id === 'number' &&
    typeof item.name === 'string' &&
    typeof item.generation === 'number' &&
    Array.isArray(item.types)
  )
}

export function readListCache(storage) {
  try {
    const list = JSON.parse(storage.getItem(CACHE_KEY))
    if (!Array.isArray(list) || list.length === 0) return null
    if (!list.every(isSummary)) return null
    return list
  } catch {
    // 깨진 값이면 없는 것으로 친다.
    return null
  }
}

export function writeListCache(storage, list) {
  try {
    storage.setItem(CACHE_KEY, JSON.stringify(list))
  } catch {
    // 저장 공간이 꽉 찼거나 막혀 있어도 앱은 계속 동작해야 한다.
  }
}
