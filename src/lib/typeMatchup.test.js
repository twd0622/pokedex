import { describe, it, expect } from 'vitest'
import { getDefensiveMultipliers, groupByMultiplier } from './typeMatchup'

const groups = (types) => groupByMultiplier(getDefensiveMultipliers(types))

describe('getDefensiveMultipliers', () => {
  it('18개 타입 모두의 배율을 돌려준다', () => {
    const multipliers = getDefensiveMultipliers(['normal'])
    expect(Object.keys(multipliers)).toHaveLength(18)
    expect(multipliers.water).toBe(1)
  })
})

describe('groupByMultiplier', () => {
  it('리자몽(불꽃/비행): 두 타입의 배율을 곱한다', () => {
    expect(groups(['fire', 'flying'])).toEqual({
      4: ['rock'],
      2: ['water', 'electric'],
      0.5: ['fire', 'fighting', 'steel', 'fairy'],
      0.25: ['grass', 'bug'],
      0: ['ground'],
    })
  })

  it('이상해씨(풀/독)', () => {
    const result = groups(['grass', 'poison'])
    expect(result[2]).toEqual(['fire', 'ice', 'flying', 'psychic'])
    expect(result[0.5]).toEqual(['water', 'electric', 'fighting', 'fairy'])
    expect(result[0.25]).toEqual(['grass'])
  })

  it('팬텀(고스트/독): 무효가 하나라도 있으면 0배', () => {
    const result = groups(['ghost', 'poison'])
    expect(result[0]).toEqual(['normal', 'fighting'])
    expect(result[2]).toEqual(['ground', 'psychic', 'ghost', 'dark'])
  })

  it('노말 단일 타입', () => {
    expect(groups(['normal'])).toEqual({
      4: [],
      2: ['fighting'],
      0.5: [],
      0.25: [],
      0: ['ghost'],
    })
  })
})
