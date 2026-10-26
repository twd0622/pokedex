import { useState } from 'react'
import { fetchMoves, fetchMoveVersionGroups } from '../../api/pokemon'
import { LEARN_METHODS } from '../../data/labels'
import { useAsync } from '../../hooks/useAsync'
import { normalizeMoves, toVersionGroupOptions } from '../../lib/moves'
import TypeBadge from '../TypeBadge'
import './MovesTab.css'

function LoadError({ retry }) {
  return (
    <div className="status">
      <p>기술 정보를 불러오지 못했어요.</p>
      <button type="button" onClick={retry}>
        다시 시도
      </button>
    </div>
  )
}

// 고른 버전·방법의 기술 표
function MoveTable({ pokemonId, versionGroupId, method }) {
  const { data, loading, error, retry } = useAsync(
    () => fetchMoves(pokemonId, versionGroupId, method),
    [pokemonId, versionGroupId, method],
  )

  if (loading) return <p className="status">불러오는 중…</p>
  if (error) return <LoadError retry={retry} />

  const moves = normalizeMoves(data, method)
  if (moves.length === 0) {
    return <p className="status">이 버전에서 이 방법으로 배우는 기술이 없어요.</p>
  }

  const isLevelUp = method === 'level-up'
  return (
    <table className="moves-table">
      <thead>
        <tr>
          {isLevelUp && <th>레벨</th>}
          <th>기술</th>
          <th>타입</th>
          <th>위력</th>
          <th>명중</th>
        </tr>
      </thead>
      <tbody>
        {moves.map((move) => (
          <tr key={`${move.level}-${move.name}`}>
            {isLevelUp && <td>{move.level === 0 ? '진화 시' : move.level}</td>}
            <td>{move.name}</td>
            <td>
              <TypeBadge type={move.type} />
            </td>
            <td>{move.power ?? '—'}</td>
            <td>{move.accuracy ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// 기술 탭. 탭을 열 때(이 컴포넌트가 화면에 나올 때) 처음으로 요청한다.
function MovesTab({ pokemonId }) {
  const { data, loading, error, retry } = useAsync(
    () => fetchMoveVersionGroups(pokemonId),
    [pokemonId],
  )
  // 사용자가 고른 값. 고른 적이 없거나 다른 모습의 선택이면 기본값을 쓴다.
  const [choice, setChoice] = useState({ pokemonId: null, versionGroupId: null, method: null })

  if (loading) return <p className="status">불러오는 중…</p>
  if (error) return <LoadError retry={retry} />

  const options = toVersionGroupOptions(data)
  if (options.length === 0) return <p className="status">배우는 기술 정보가 없어요.</p>

  // 기본 버전: 레벨업 기술이 있는 가장 최신 버전
  const defaultVersion = options.find((o) => o.methods.includes('level-up')) ?? options[0]
  const chosenVersion =
    choice.pokemonId === pokemonId ? options.find((o) => o.id === choice.versionGroupId) : undefined
  const version = chosenVersion ?? defaultVersion
  // 방법은 그 버전에 있는 것 중에서. 고른 방법이 없으면 첫 번째(대개 레벨업).
  const method = version.methods.includes(choice.method) ? choice.method : version.methods[0]

  const choose = (changes) => setChoice({ pokemonId, versionGroupId: version.id, method, ...changes })

  return (
    <section className="panel">
      <div className="moves-filters">
        <label>
          게임 버전
          <select
            value={version.id}
            onChange={(event) => choose({ versionGroupId: Number(event.target.value) })}
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          배우는 방법
          <select value={method} onChange={(event) => choose({ method: event.target.value })}>
            {version.methods.map((m) => (
              <option key={m} value={m}>
                {LEARN_METHODS[m]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <MoveTable pokemonId={pokemonId} versionGroupId={version.id} method={method} />
    </section>
  )
}

export default MovesTab
