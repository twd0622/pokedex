import { useState } from 'react'
import { fetchEncounters } from '../../api/pokemon'
import { useAsync } from '../../hooks/useAsync'
import { groupEncounters } from '../../lib/encounters'
import './DetailsTab.css'

function genderText(femalePercent) {
  if (femalePercent === null) return '성별 없음'
  return `♂ ${100 - femalePercent}% · ♀ ${femalePercent}%`
}

function Facts({ detail }) {
  const facts = [
    ['성비', genderText(detail.genderFemalePercent)],
    ['포획률', detail.captureRate],
    ['알 그룹', detail.eggGroups.join(' · ')],
    ['부화 걸음 수', `약 ${detail.hatchSteps.toLocaleString('ko-KR')}걸음`],
    ['성장 속도', detail.growthRate],
    ['서식지', detail.habitat ?? '정보 없음'],
    ['색깔', detail.color],
  ]
  return (
    <section className="panel">
      <h3>세부 데이터</h3>
      <dl className="facts">
        {facts.map(([label, value]) => (
          <div key={label} className="facts__item">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

const ALL = 'all'

function PlaceTable({ places }) {
  return (
    <table className="moves-table">
      <thead>
        <tr>
          <th>장소</th>
          <th>방법</th>
        </tr>
      </thead>
      <tbody>
        {places.map((place) => (
          <tr key={`${place.location}|${place.method}`}>
            <td>{place.location}</td>
            <td>{place.method}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Encounters({ pokemonId }) {
  const { data, loading, error, retry } = useAsync(() => fetchEncounters(pokemonId), [pokemonId])
  // 고른 버전. 고른 적이 없거나 다른 모습의 선택이면 기본값(가장 최신)을 쓴다.
  const [choice, setChoice] = useState({ pokemonId: null, versionId: null })

  if (loading) return <p className="status">불러오는 중…</p>
  if (error) {
    return (
      <div className="status">
        <p>출현 장소를 불러오지 못했어요.</p>
        <button type="button" onClick={retry}>
          다시 시도
        </button>
      </div>
    )
  }

  const groups = groupEncounters(data)
  if (groups.length === 0) return <p className="status">야생에서 만나는 기록이 없어요.</p>

  const chosen = choice.pokemonId === pokemonId ? choice.versionId : null
  const selected =
    chosen === ALL || groups.some((g) => g.versionId === chosen) ? chosen : groups[0].versionId
  const shown = selected === ALL ? groups : groups.filter((g) => g.versionId === selected)

  return (
    <>
      <div className="moves-filters">
        <label>
          게임 버전
          <select
            value={selected}
            onChange={(event) => {
              const value = event.target.value
              setChoice({ pokemonId, versionId: value === ALL ? ALL : Number(value) })
            }}
          >
            <option value={ALL}>전체</option>
            {groups.map((g) => (
              <option key={g.versionId} value={g.versionId}>
                {g.versionLabel}
              </option>
            ))}
          </select>
        </label>
      </div>
      {shown.map((group) => (
        <div key={group.versionId} className="encounter-group">
          {selected === ALL && <h4>{group.versionLabel}</h4>}
          <PlaceTable places={group.places} />
        </div>
      ))}
    </>
  )
}

// 세부 데이터 탭: 종 정보(detail)와 지금 모습의 출현 장소
function DetailsTab({ detail, pokemonId }) {
  return (
    <div className="details-tab">
      <Facts detail={detail} />
      <section className="panel">
        <h3>출현 장소</h3>
        <Encounters pokemonId={pokemonId} />
      </section>
    </div>
  )
}

export default DetailsTab
