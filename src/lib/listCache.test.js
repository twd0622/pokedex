import { describe, it, expect } from 'vitest'
import { readListCache, writeListCache } from './listCache'

// localStorage 대신 쓰는 가짜 저장소
function fakeStorage(initial = {}) {
  const data = { ...initial }
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value)
    },
  }
}

const list = [{ id: 6, name: '리자몽', generation: 1, types: ['fire', 'flying'] }]

describe('listCache', () => {
  it('저장한 목록을 그대로 읽어 온다', () => {
    const storage = fakeStorage()
    writeListCache(storage, list)
    expect(readListCache(storage)).toEqual(list)
  })

  it('저장된 값이 없으면 null', () => {
    expect(readListCache(fakeStorage())).toBeNull()
  })

  it('깨진 JSON이면 오류 없이 null', () => {
    const storage = fakeStorage({ 'pokedex:list:v1': '{oops' })
    expect(readListCache(storage)).toBeNull()
  })

  it('예전 형식처럼 항목 모양이 다르면 null', () => {
    const old = JSON.stringify([{ id: 1, name: '이상해씨' }])
    expect(readListCache(fakeStorage({ 'pokedex:list:v1': old }))).toBeNull()
  })

  it('배열이 아니거나 비어 있으면 null', () => {
    expect(readListCache(fakeStorage({ 'pokedex:list:v1': '{"a":1}' }))).toBeNull()
    expect(readListCache(fakeStorage({ 'pokedex:list:v1': '[]' }))).toBeNull()
  })
})
