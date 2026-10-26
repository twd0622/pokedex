import { describe, it, expect } from 'vitest'
import { groupEncounters } from './encounters'

const row = ({ versionId = 12, order = 12, version = ['diamond', '디아루가'], location = ['trophy-garden', null], method = 'walk' } = {}) => ({
  version: {
    id: versionId,
    name: version[0],
    versionnames: version[1] ? [{ name: version[1] }] : [],
    versiongroup: { order },
  },
  locationarea: {
    location: {
      name: location[0],
      locationnames: location[1] ? [{ name: location[1] }] : [],
    },
  },
  encounterslot: { encountermethod: { name: method } },
})

describe('groupEncounters', () => {
  it('빈 배열이면 빈 배열', () => {
    expect(groupEncounters([])).toEqual([])
  })

  it('같은 버전·장소·방법은 하나로 합친다', () => {
    const groups = groupEncounters([row(), row(), row()])
    expect(groups).toHaveLength(1)
    expect(groups[0].places).toHaveLength(1)
  })

  it('한국어 장소 이름이 없으면 영어 이름을 보기 좋게 바꾼다', () => {
    expect(groupEncounters([row()])[0].places[0]).toEqual({ location: 'Trophy Garden', method: '풀숲·동굴' })
  })

  it('한국어 장소 이름이 있으면 그것을 쓴다', () => {
    const groups = groupEncounters([row({ location: ['santalune-forest', '백단숲'] })])
    expect(groups[0].places[0].location).toBe('백단숲')
  })

  it('출시 순서(order)가 늦은 버전이 먼저', () => {
    const groups = groupEncounters([
      row({ versionId: 12, order: 12 }),
      row({ versionId: 30, order: 1, version: ['red-japan', '레드'] }),
      row({ versionId: 23, order: 17, version: ['x', 'X'] }),
    ])
    expect(groups.map((g) => g.versionId)).toEqual([23, 12, 30])
    expect(groups[0]).toMatchObject({ versionId: 23, versionLabel: 'X' })
  })

  it('모르는 방법은 영어 그대로', () => {
    expect(groupEncounters([row({ method: 'honey-tree' })])[0].places[0].method).toBe('honey-tree')
  })
})
