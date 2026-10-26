const UNKNOWN = '특수 조건'
const TIME_OF_DAY = { day: '낮', night: '밤' }

// 진화 방법 하나를 '불꽃의돌 사용', '친밀도 220 이상 (밤)' 같은 글로 바꾼다.
export function formatEvolutionCondition(evo) {
  const parts = []
  const trigger = evo.evolutiontrigger?.name

  if (trigger === 'trade') parts.push('통신교환')
  if (evo.min_level) parts.push(`Lv.${evo.min_level}`)
  if (trigger === 'use-item' && evo.item) {
    parts.push(`${evo.item.itemnames[0]?.name ?? '아이템'} 사용`)
  }
  if (evo.min_happiness) parts.push(`친밀도 ${evo.min_happiness} 이상`)
  if (evo.min_affection) parts.push(`애정 ${evo.min_affection} 이상`)
  if (evo.move) parts.push(`${evo.move.movenames[0]?.name ?? '특정 기술'} 배운 상태`)

  if (parts.length === 0) return UNKNOWN

  const time = TIME_OF_DAY[evo.time_of_day]
  return parts.join(' + ') + (time ? ` (${time})` : '')
}

// 진화 방법이 여러 개(게임마다 다름)면 알아볼 수 있는 첫 번째 조건을 쓴다.
function pickCondition(evolutions) {
  const conditions = evolutions.map(formatEvolutionCondition)
  return conditions.find((c) => c !== UNKNOWN) ?? UNKNOWN
}

// 진화 계열의 종 목록을 단계별 배열로 묶는다.
// [[파이리], [리자드], [리자몽]] / [[이브이], [샤미드, 쥬피썬더, ...]]
export function buildEvolutionStages(rawSpecies) {
  const stageOf = {}
  const stages = []

  // 원본은 진화 순서(order)대로 정렬되어 있어서, 부모가 항상 자식보다 먼저 나온다.
  for (const species of rawSpecies) {
    const parentId = species.evolves_from_species_id
    const stage = parentId === null || stageOf[parentId] === undefined ? 0 : stageOf[parentId] + 1
    stageOf[species.id] = stage

    stages[stage] ??= []
    stages[stage].push({
      id: species.id,
      name: species.pokemonspeciesnames[0]?.name ?? '',
      condition: stage === 0 ? '' : pickCondition(species.pokemonevolutions),
    })
  }
  return stages
}
