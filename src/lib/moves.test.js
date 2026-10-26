import { describe, it, expect } from 'vitest'
import { normalizeMoves, toVersionGroupOptions } from './moves'

// (버전 그룹, 배우는 방법) 한 쌍
const pair = (id, order, method, versions) => ({
  version_group_id: id,
  movelearnmethod: { name: method },
  versiongroup: {
    order,
    versions: versions.map(([name, ko]) => ({
      name,
      versionnames: ko ? [{ name: ko }] : [],
    })),
  },
})
const sv = [['scarlet', '스칼렛'], ['violet', '바이올렛']]
const redGreenJapan = [['red-japan', '레드'], ['green-japan', '그린']]

describe('toVersionGroupOptions', () => {
  const options = toVersionGroupOptions([
    pair(28, 1, 'level-up', redGreenJapan),
    pair(25, 27, 'machine', sv),
    pair(25, 27, 'level-up', sv),
    pair(32, 32, 'train', [['champions', null]]),
  ])

  it('출시 순서(order)가 늦은 버전이 먼저, 번호(id)와는 상관없다', () => {
    expect(options.map((o) => o.id)).toEqual([25, 28])
  })

  it('버전 이름을 한국어로 잇는다', () => {
    expect(options[0].label).toBe('스칼렛·바이올렛')
  })

  it('버전마다 배우는 방법을 정해진 순서로 모은다', () => {
    expect(options[0].methods).toEqual(['level-up', 'machine'])
  })

  it('우리가 보여 주는 방법이 하나도 없는 버전은 뺀다', () => {
    expect(options.some((o) => o.id === 32)).toBe(false)
  })

  it('한국어 이름이 없으면 영어 이름', () => {
    const [option] = toVersionGroupOptions([pair(30, 30, 'level-up', [['legends-za', null]])])
    expect(option.label).toBe('legends-za')
  })
})

// 기술 한 줄
const row = (level, name, power = 40) => ({
  level,
  move: { power, accuracy: 100, type: { name: 'fire' }, movenames: [{ name }] },
})

describe('normalizeMoves', () => {
  it('레벨업은 레벨 순서, 진화 시(0)가 맨 앞', () => {
    const moves = normalizeMoves([row(12, '용의숨결'), row(1, '할퀴기'), row(0, '에어슬래시')], 'level-up')
    expect(moves.map((m) => m.level)).toEqual([0, 1, 12])
  })

  it('레벨업이 아니면 가나다순이고 레벨은 없다', () => {
    const moves = normalizeMoves([row(0, '화염방사'), row(0, '공중날기'), row(0, '지진')], 'machine')
    expect(moves.map((m) => m.name)).toEqual(['공중날기', '지진', '화염방사'])
    expect(moves[0].level).toBeNull()
  })

  it('위력이 없는 기술은 null', () => {
    expect(normalizeMoves([row(1, '울음소리', null)], 'level-up')[0].power).toBeNull()
  })

  it('같은 기술이 중복되면 하나만', () => {
    const moves = normalizeMoves([row(0, '지진'), row(0, '지진')], 'machine')
    expect(moves).toHaveLength(1)
  })

  it('화면용 모양', () => {
    expect(normalizeMoves([row(19, '불꽃엄니', 65)], 'level-up')).toEqual([
      { level: 19, name: '불꽃엄니', type: 'fire', power: 65, accuracy: 100 },
    ])
  })
})
