// 만나는 방법의 한국어 이름. 목록에 없는 방법은 영어 그대로 보여 준다.
const METHODS = {
  walk: '풀숲·동굴',
  surf: '파도타기',
  'old-rod': '낡은낚싯대',
  'good-rod': '좋은낚싯대',
  'super-rod': '대단한낚싯대',
  gift: '선물',
  'gift-egg': '선물(알)',
  'npc-trade': '교환',
  'rock-smash': '바위깨기',
  headbutt: '박치기',
  static: '고정 위치',
  overworld: '필드에서 보임',
  wanderer: '돌아다님',
  'max-raid': '맥스 레이드배틀',
  'dynamax-adventure': '다이맥스 어드벤처',
}

// 'trophy-garden' → 'Trophy Garden'
function toTitle(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// 출현 기록을 버전별로 묶는다.
// 결과: [{ versionId, versionLabel, places: [{ location, method }] }]
// 출시 순서(order)가 늦은 버전이 먼저 온다.
export function groupEncounters(rows) {
  const groups = new Map()

  for (const row of rows) {
    const { version } = row
    if (!groups.has(version.id)) {
      groups.set(version.id, {
        versionId: version.id,
        versionLabel: version.versionnames[0]?.name ?? version.name,
        order: version.versiongroup.order,
        places: [],
        seen: new Set(),
      })
    }
    const group = groups.get(version.id)

    const location = row.locationarea.location
    const methodName = row.encounterslot.encountermethod.name
    const place = {
      location: location.locationnames[0]?.name ?? toTitle(location.name),
      method: METHODS[methodName] ?? methodName,
    }
    // 같은 장소에 같은 방법이 여러 번(시간대, 레벨별 등) 적혀 있으면 하나만
    const key = `${place.location}|${place.method}`
    if (group.seen.has(key)) continue
    group.seen.add(key)
    group.places.push(place)
  }

  return [...groups.values()]
    .sort((a, b) => b.order - a.order || b.versionId - a.versionId)
    .map(({ versionId, versionLabel, places }) => ({ versionId, versionLabel, places }))
}
