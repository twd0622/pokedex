import { describe, it, expect } from 'vitest'
import { filterPokemon } from './filter'

const list = [
  { id: 1, name: '이상해씨', generation: 1, types: ['grass', 'poison'] },
  { id: 5, name: '리자드', generation: 1, types: ['fire'] },
  { id: 6, name: '리자몽', generation: 1, types: ['fire', 'flying'] },
  { id: 155, name: '브케인', generation: 2, types: ['fire'] },
]

const ids = (result) => result.map((p) => p.id)
const empty = { query: '', generation: null, type: null }

describe('filterPokemon', () => {
  it('조건이 비어 있으면 전부 보여 준다', () => {
    expect(ids(filterPokemon(list, empty))).toEqual([1, 5, 6, 155])
  })

  it('이름 일부로 찾는다', () => {
    expect(ids(filterPokemon(list, { ...empty, query: '리자' }))).toEqual([5, 6])
  })

  it('숫자는 도감 번호와 정확히 일치해야 한다', () => {
    expect(ids(filterPokemon(list, { ...empty, query: '6' }))).toEqual([6])
  })

  it('검색어 앞뒤 공백은 무시한다', () => {
    expect(ids(filterPokemon(list, { ...empty, query: '  리자몽 ' }))).toEqual([6])
  })

  it('두 번째 타입도 타입 필터에 걸린다', () => {
    expect(ids(filterPokemon(list, { ...empty, type: 'flying' }))).toEqual([6])
  })

  it('세대와 타입을 함께 적용한다', () => {
    expect(ids(filterPokemon(list, { ...empty, type: 'fire', generation: 2 }))).toEqual([155])
  })

  it('검색어와 타입을 함께 적용한다', () => {
    expect(ids(filterPokemon(list, { ...empty, query: '리자', type: 'flying' }))).toEqual([6])
  })
})
