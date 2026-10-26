import { LEARN_METHODS } from '../data/labels'

const METHOD_ORDER = Object.keys(LEARN_METHODS)

// (버전 그룹, 배우는 방법) 쌍 목록을 버전 메뉴용으로 묶는다.
// 결과: [{ id: 25, label: '스칼렛·바이올렛', methods: ['level-up', 'machine'] }, ...]
// 출시 순서(order)가 늦은 버전이 먼저 온다.
export function toVersionGroupOptions(pairs) {
  const groups = new Map()

  for (const pair of pairs) {
    const method = pair.movelearnmethod.name
    if (!METHOD_ORDER.includes(method)) continue

    if (!groups.has(pair.version_group_id)) {
      const versions = pair.versiongroup.versions
      groups.set(pair.version_group_id, {
        id: pair.version_group_id,
        order: pair.versiongroup.order,
        label: versions.map((v) => v.versionnames[0]?.name ?? v.name).join('·'),
        methods: [],
      })
    }
    groups.get(pair.version_group_id).methods.push(method)
  }

  return [...groups.values()]
    .sort((a, b) => b.order - a.order)
    .map(({ id, label, methods }) => ({
      id,
      label,
      methods: METHOD_ORDER.filter((m) => methods.includes(m)),
    }))
}

// 기술 목록을 화면용으로 바꾸고 정렬한다.
// 레벨업은 레벨 순서(0 = 진화할 때), 나머지는 가나다순이다.
export function normalizeMoves(rows, method) {
  const isLevelUp = method === 'level-up'
  const seen = new Set()
  const moves = []

  for (const row of rows) {
    const move = {
      level: isLevelUp ? row.level : null,
      name: row.move.movenames[0]?.name ?? '',
      type: row.move.type.name,
      power: row.move.power,
      accuracy: row.move.accuracy,
    }
    // 같은 기술이 같은 레벨에 두 번 적혀 있으면 하나만 남긴다.
    const key = `${move.level}:${move.name}`
    if (seen.has(key)) continue
    seen.add(key)
    moves.push(move)
  }

  return moves.sort((a, b) =>
    isLevelUp ? a.level - b.level || a.name.localeCompare(b.name, 'ko') : a.name.localeCompare(b.name, 'ko'),
  )
}
