import { TYPE_CHART } from '../data/typeChart'
import { TYPE_ORDER } from '../data/types'

// 이 타입(들)의 포켓몬이 각 공격 타입에게 받는 피해 배율.
// 타입이 두 개면 두 배율을 곱한다. 예: 바위 → 불꽃 ×2, 비행 ×2 = ×4
export function getDefensiveMultipliers(defenseTypes) {
  const multipliers = {}
  for (const attackType of TYPE_ORDER) {
    multipliers[attackType] = defenseTypes.reduce(
      (total, defenseType) => total * (TYPE_CHART[attackType][defenseType] ?? 1),
      1,
    )
  }
  return multipliers
}

// 배율별로 공격 타입을 묶는다. 1배는 화면에 보여 주지 않으니 뺀다.
export function groupByMultiplier(multipliers) {
  const groups = { 4: [], 2: [], 0.5: [], 0.25: [], 0: [] }
  for (const attackType of TYPE_ORDER) {
    groups[multipliers[attackType]]?.push(attackType)
  }
  return groups
}
