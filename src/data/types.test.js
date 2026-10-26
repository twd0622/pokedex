import { describe, it, expect } from 'vitest'
import { TYPES, TYPE_ORDER } from './types'

describe('TYPES', () => {
  it('18개 타입이 공식 순서로 있다', () => {
    expect(TYPE_ORDER).toHaveLength(18)
    expect(TYPE_ORDER[0]).toBe('normal')
    expect(TYPE_ORDER[17]).toBe('fairy')
  })

  it('순서에 있는 모든 타입에 한국어 이름과 색이 있다', () => {
    for (const type of TYPE_ORDER) {
      expect(TYPES[type].ko).toBeTruthy()
      expect(TYPES[type].color).toMatch(/^#[0-9a-f]{6}$/)
    }
  })

  it('한국어 이름이 맞다', () => {
    expect(TYPES.fire.ko).toBe('불꽃')
    expect(TYPES.psychic.ko).toBe('에스퍼')
    expect(TYPES.dark.ko).toBe('악')
  })
})
