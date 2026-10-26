import { Fragment } from 'react'
import { Link, useLocation } from 'react-router'
import { fetchEvolutionChain } from '../../api/pokemon'
import { useAsync } from '../../hooks/useAsync'
import { buildEvolutionStages } from '../../lib/evolution'
import { artworkUrl } from '../../lib/format'
import { formLabel } from '../../lib/normalize'
import TypeBadge from '../TypeBadge'
import './EvolutionTab.css'

function EvolutionChain({ chainId, currentId }) {
  const location = useLocation()
  const { data, loading, error, retry } = useAsync(
    () => fetchEvolutionChain(chainId),
    [chainId],
  )

  if (loading) return <p className="status">불러오는 중…</p>
  if (error) {
    return (
      <div className="status">
        <p>진화 정보를 불러오지 못했어요.</p>
        <button type="button" onClick={retry}>
          다시 시도
        </button>
      </div>
    )
  }

  const stages = buildEvolutionStages(data)
  if (stages.length <= 1) return <p className="evolution__none">진화하지 않는 포켓몬이에요.</p>

  // 진화 단계를 눌러 이동할 때도 "몇 번째 상세 페이지인지"를 이어서 센다. (BackLink 참고)
  const linkState = location.state && {
    ...location.state,
    depth: (location.state.depth ?? 1) + 1,
  }

  return (
    <div className="evolution">
      {stages.map((stage, index) => (
        <Fragment key={index}>
          {index > 0 && <div className="evolution__arrow">→</div>}
          <div className="evolution__stage">
            {stage.map((pokemon) => (
              <Link
                key={pokemon.id}
                to={`/pokemon/${pokemon.id}`}
                state={linkState}
                className={
                  pokemon.id === currentId ? 'evolution__pokemon is-current' : 'evolution__pokemon'
                }
              >
                <img src={artworkUrl(pokemon.id)} alt={pokemon.name} width="80" height="80" />
                <span>{pokemon.name}</span>
                {pokemon.condition && <small>{pokemon.condition}</small>}
              </Link>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  )
}

function FormPicker({ forms, selectedIndex, onSelect }) {
  return (
    <div className="forms">
      {forms.map((form, index) => (
        <button
          key={form.pokemonId}
          type="button"
          className={index === selectedIndex ? 'forms__card is-selected' : 'forms__card'}
          onClick={() => onSelect(index)}
        >
          <img src={artworkUrl(form.pokemonId)} alt="" width="88" height="88" loading="lazy" />
          <span>{formLabel(form)}</span>
          <span className="forms__types">
            {form.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </span>
        </button>
      ))}
    </div>
  )
}

// 진화·모습 탭
function EvolutionTab({ detail, selectedFormIndex, onSelectForm }) {
  return (
    <div className="evolution-tab">
      <section className="panel">
        <h3>진화</h3>
        <EvolutionChain chainId={detail.evolutionChainId} currentId={detail.id} />
      </section>
      {detail.forms.length > 1 && (
        <section className="panel">
          <h3>
            모습 바꾸기 <span className="panel__sub">누르면 위쪽 정보와 배틀 탭이 바뀌어요</span>
          </h3>
          <FormPicker
            forms={detail.forms}
            selectedIndex={selectedFormIndex}
            onSelect={onSelectForm}
          />
        </section>
      )}
    </div>
  )
}

export default EvolutionTab
