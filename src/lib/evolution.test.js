import { describe, it, expect } from 'vitest'
import { buildEvolutionStages, formatEvolutionCondition } from './evolution'

// 테스트용 진화 정보 만들기
const evo = (fields) => ({
  min_level: null,
  min_happiness: null,
  min_affection: null,
  time_of_day: '',
  evolutiontrigger: { name: 'level-up' },
  item: null,
  move: null,
  ...fields,
})
const species = (id, name, from, evolutions = []) => ({
  id,
  evolves_from_species_id: from,
  pokemonspeciesnames: [{ name }],
  pokemonevolutions: evolutions,
})
const useItem = (itemName) =>
  evo({ evolutiontrigger: { name: 'use-item' }, item: { itemnames: [{ name: itemName }] } })

describe('formatEvolutionCondition', () => {
  it('레벨', () => {
    expect(formatEvolutionCondition(evo({ min_level: 16 }))).toBe('Lv.16')
  })

  it('아이템 사용', () => {
    expect(formatEvolutionCondition(useItem('불꽃의돌'))).toBe('불꽃의돌 사용')
  })

  it('통신교환', () => {
    expect(formatEvolutionCondition(evo({ evolutiontrigger: { name: 'trade' } }))).toBe('통신교환')
  })

  it('친밀도와 시간대', () => {
    expect(formatEvolutionCondition(evo({ min_happiness: 220 }))).toBe('친밀도 220 이상')
    expect(formatEvolutionCondition(evo({ min_happiness: 220, time_of_day: 'night' }))).toBe(
      '친밀도 220 이상 (밤)',
    )
    expect(formatEvolutionCondition(evo({ min_happiness: 160, time_of_day: 'day' }))).toBe(
      '친밀도 160 이상 (낮)',
    )
  })

  it('알 수 없는 조건', () => {
    expect(formatEvolutionCondition(evo({}))).toBe('특수 조건')
  })
})

describe('buildEvolutionStages', () => {
  it('파이리 → 리자드 → 리자몽', () => {
    const raw = [
      species(4, '파이리', null),
      species(5, '리자드', 4, [evo({ min_level: 16 })]),
      species(6, '리자몽', 5, [evo({ min_level: 36 })]),
    ]
    expect(buildEvolutionStages(raw)).toEqual([
      [{ id: 4, name: '파이리', condition: '' }],
      [{ id: 5, name: '리자드', condition: 'Lv.16' }],
      [{ id: 6, name: '리자몽', condition: 'Lv.36' }],
    ])
  })

  it('이브이처럼 갈래가 나뉘면 같은 단계에 여러 마리', () => {
    const raw = [
      species(133, '이브이', null),
      species(134, '샤미드', 133, [useItem('물의돌')]),
      species(135, '쥬피썬더', 133, [useItem('천둥의돌')]),
      species(136, '부스터', 133, [useItem('불꽃의돌')]),
    ]
    const stages = buildEvolutionStages(raw)
    expect(stages).toHaveLength(2)
    expect(stages[1].map((p) => p.id)).toEqual([134, 135, 136])
  })

  it('진화 방법이 여러 개면 알아볼 수 있는 조건을 고른다', () => {
    const raw = [
      species(133, '이브이', null),
      species(470, '리피아', 133, [evo({}), evo({}), useItem('리프의돌'), evo({})]),
    ]
    expect(buildEvolutionStages(raw)[1][0].condition).toBe('리프의돌 사용')
  })

  it('진화하지 않으면 한 단계뿐', () => {
    expect(buildEvolutionStages([species(128, '켄타로스', null)])).toHaveLength(1)
  })
})
