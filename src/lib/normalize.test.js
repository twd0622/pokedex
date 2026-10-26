import { describe, it, expect } from 'vitest'
import { normalizeList } from './normalize'

// 목록 쿼리 응답에서 리자몽 한 마리만 떼어 온 모양
const rawCharizard = {
  id: 6,
  generation_id: 1,
  pokemonspeciesnames: [{ name: '리자몽' }],
  pokemons: [
    {
      pokemontypes: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
    },
  ],
}

describe('normalizeList', () => {
  it('API 응답을 화면용 모양으로 바꾼다', () => {
    expect(normalizeList([rawCharizard])).toEqual([
      { id: 6, name: '리자몽', generation: 1, types: ['fire', 'flying'] },
    ])
  })

  it('한국어 이름이 없으면 도감 번호를 이름으로 쓴다', () => {
    const noName = { ...rawCharizard, pokemonspeciesnames: [] }
    expect(normalizeList([noName])[0].name).toBe('#0006')
  })
})
