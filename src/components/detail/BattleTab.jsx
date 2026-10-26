import { STAT_LABELS } from '../../data/labels'
import { getDefensiveMultipliers, groupByMultiplier } from '../../lib/typeMatchup'
import TypeBadge from '../TypeBadge'
import './BattleTab.css'

const MAX_STAT = 255

// 받는 피해 표의 줄 순서와 표시 글자
const MULTIPLIER_ROWS = [
  { value: 4, label: '×4' },
  { value: 2, label: '×2' },
  { value: 0.5, label: '×½' },
  { value: 0.25, label: '×¼' },
  { value: 0, label: '×0' },
]

function StatBars({ stats }) {
  const total = Object.values(stats).reduce((sum, value) => sum + value, 0)
  return (
    <section className="panel">
      <h3>
        기본 능력치 <span className="panel__sub">합계 {total}</span>
      </h3>
      {Object.entries(STAT_LABELS).map(([key, label]) => (
        <div key={key} className="stat">
          <span>{label}</span>
          <b>{stats[key]}</b>
          <div className="stat__bar">
            <i style={{ width: `${(stats[key] / MAX_STAT) * 100}%` }} />
          </div>
        </div>
      ))}
    </section>
  )
}

function Abilities({ abilities }) {
  return (
    <section className="panel">
      <h3>특성</h3>
      {abilities.map((ability) => (
        <div key={ability.name} className="ability">
          <div className="ability__name">
            {ability.name}
            {ability.isHidden && <span className="ability__hidden">숨겨진 특성</span>}
          </div>
          <p>{ability.description}</p>
        </div>
      ))}
    </section>
  )
}

function TypeMatchup({ types }) {
  const groups = groupByMultiplier(getDefensiveMultipliers(types))
  return (
    <section className="panel">
      <h3>타입 상성 <span className="panel__sub">받는 피해</span></h3>
      {MULTIPLIER_ROWS.filter((row) => groups[row.value].length > 0).map((row) => (
        <div key={row.value} className="matchup">
          <span className="matchup__label">{row.label}</span>
          <div className="matchup__types">
            {groups[row.value].map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

// 배틀 탭: 지금 보고 있는 모습(form)의 능력치·특성·상성
function BattleTab({ form }) {
  return (
    <div className="battle-tab">
      <StatBars stats={form.stats} />
      <div className="battle-tab__row">
        <Abilities abilities={form.abilities} />
        <TypeMatchup types={form.types} />
      </div>
    </div>
  )
}

export default BattleTab
