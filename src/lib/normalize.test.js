import { describe, it, expect } from 'vitest'
import { normalizeDetail, normalizeList, parsePokemonId } from './normalize'

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

describe('parsePokemonId', () => {
  it('1~1025 사이 정수만 받아들인다', () => {
    expect(parsePokemonId('6')).toBe(6)
    expect(parsePokemonId('1025')).toBe(1025)
  })

  it('범위 밖이거나 숫자가 아니면 null', () => {
    for (const bad of ['0', '1026', 'abc', '6.5', '', '06a']) {
      expect(parsePokemonId(bad)).toBeNull()
    }
  })
})

// 상세 쿼리 응답(리자몽)을 줄인 것. 메가리자몽X를 일부러 앞에 둬서 기본 모습 정렬을 확인한다.
const charizardForm = {
  id: 6,
  is_default: true,
  height: 17,
  weight: 905,
  pokemontypes: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
  pokemonstats: [
    { base_stat: 78, stat: { name: 'hp' } },
    { base_stat: 84, stat: { name: 'attack' } },
    { base_stat: 78, stat: { name: 'defense' } },
    { base_stat: 109, stat: { name: 'special-attack' } },
    { base_stat: 85, stat: { name: 'special-defense' } },
    { base_stat: 100, stat: { name: 'speed' } },
  ],
  pokemonabilities: [
    {
      is_hidden: false,
      ability: {
        abilitynames: [{ name: '맹화' }],
        abilityflavortexts: [{ flavor_text: 'HP가 줄었을 때\n불꽃타입 기술의\n위력이 올라간다.' }],
      },
    },
    {
      is_hidden: true,
      ability: {
        abilitynames: [{ name: '선파워' }],
        abilityflavortexts: [{ flavor_text: '날씨가 맑으면\n특수공격이 올라가지만\n매 턴 HP가 줄어든다.' }],
      },
    },
  ],
  pokemonforms: [{ form_name: '', pokemonformnames: [] }],
}

const megaXForm = {
  ...charizardForm,
  id: 10034,
  is_default: false,
  weight: 1105,
  pokemontypes: [{ type: { name: 'fire' } }, { type: { name: 'dragon' } }],
  pokemonforms: [{ form_name: 'mega-x', pokemonformnames: [{ name: '메가리자몽X' }] }],
}

const rawCharizardDetail = {
  id: 6,
  is_legendary: false,
  is_mythical: false,
  gender_rate: 1,
  capture_rate: 45,
  hatch_counter: 20,
  evolution_chain_id: 2,
  generation_id: 1,
  pokemonspeciesnames: [{ name: '리자몽', genus: '화염포켓몬' }],
  pokemonspeciesflavortexts: [{ flavor_text: '지상 1400m까지\n날개를 사용해\f날 수 있다.' }],
  growthrate: { name: 'medium-slow' },
  pokemonhabitat: { name: 'mountain' },
  pokemoncolor: { pokemoncolornames: [{ name: '빨강' }] },
  pokemonegggroups: [
    { egggroup: { egggroupnames: [{ name: '괴수' }] } },
    { egggroup: { egggroupnames: [{ name: '드래곤' }] } },
  ],
  pokemons: [megaXForm, charizardForm],
}

describe('normalizeDetail', () => {
  const detail = normalizeDetail(rawCharizardDetail)

  it('이름과 분류', () => {
    expect(detail.name).toBe('리자몽')
    expect(detail.genus).toBe('화염포켓몬')
    expect(detail.generation).toBe(1)
    expect(detail.evolutionChainId).toBe(2)
  })

  it('성비: gender_rate는 8분의 몇이 암컷인지, -1은 무성', () => {
    expect(detail.genderFemalePercent).toBe(12.5)
    expect(normalizeDetail({ ...rawCharizardDetail, gender_rate: -1 }).genderFemalePercent).toBeNull()
  })

  it('세부 데이터를 한국어로 바꾼다', () => {
    expect(detail.captureRate).toBe(45)
    expect(detail.hatchSteps).toBe(5140)
    expect(detail.growthRate).toBe('중간 느림')
    expect(detail.habitat).toBe('산')
    expect(detail.color).toBe('빨강')
    expect(detail.eggGroups).toEqual(['괴수', '드래곤'])
  })

  it('서식지가 없으면 null', () => {
    expect(normalizeDetail({ ...rawCharizardDetail, pokemonhabitat: null }).habitat).toBeNull()
  })

  it('도감 설명의 줄바꿈 문자를 공백으로 바꾼다', () => {
    expect(detail.flavorText).toBe('지상 1400m까지 날개를 사용해 날 수 있다.')
  })

  it('한국어 도감 설명이 없으면 빈 문자열', () => {
    const noText = { ...rawCharizardDetail, pokemonspeciesflavortexts: [] }
    expect(normalizeDetail(noText).flavorText).toBe('')
  })

  it('기본 모습이 항상 첫 번째', () => {
    expect(detail.forms.map((f) => f.pokemonId)).toEqual([6, 10034])
    expect(detail.forms[0].isDefault).toBe(true)
  })

  it('모습마다 키·몸무게·타입·능력치·특성을 정리한다', () => {
    const form = detail.forms[0]
    expect(form.heightM).toBe(1.7)
    expect(form.weightKg).toBe(90.5)
    expect(form.types).toEqual(['fire', 'flying'])
    expect(form.stats).toEqual({
      hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100,
    })
    expect(form.abilities[1]).toEqual({
      name: '선파워',
      description: '날씨가 맑으면 특수공격이 올라가지만 매 턴 HP가 줄어든다.',
      isHidden: true,
    })
  })

  it('모습 이름 재료를 남겨 둔다', () => {
    expect(detail.forms[1].formName).toBe('mega-x')
    expect(detail.forms[1].koFormName).toBe('메가리자몽X')
    expect(detail.forms[0].koFormName).toBeNull()
  })
})
