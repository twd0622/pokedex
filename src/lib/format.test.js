import { describe, it, expect } from 'vitest'
import { formatNumber, artworkUrl } from './format'

describe('formatNumber', () => {
  it('4자리로 0을 채운다', () => {
    expect(formatNumber(6)).toBe('#0006')
    expect(formatNumber(1025)).toBe('#1025')
  })
})

describe('artworkUrl', () => {
  it('공식 일러스트 주소를 만든다', () => {
    expect(artworkUrl(10034)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10034.png',
    )
  })
})
