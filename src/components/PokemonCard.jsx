import { Link, useLocation } from 'react-router'
import { artworkUrl, formatNumber } from '../lib/format'
import TypeBadge from './TypeBadge'
import './PokemonCard.css'

// 포켓몬 한 마리를 카드로 보여 준다. 누르면 상세 페이지로 간다.
function PokemonCard({ pokemon }) {
  const location = useLocation()

  return (
    // state: 상세 페이지가 "목록에서 왔다"는 걸 알 수 있게 지금 주소의 검색 조건을 실어 보낸다.
    <Link
      to={`/pokemon/${pokemon.id}`}
      state={{ fromList: location.search, depth: 1 }}
      className="pokemon-card"
    >
      <img
        src={artworkUrl(pokemon.id)}
        alt={pokemon.name}
        loading="lazy"
        width="96"
        height="96"
      />
      <div className="pokemon-card__number">{formatNumber(pokemon.id)}</div>
      <div className="pokemon-card__name">{pokemon.name}</div>
      <div className="pokemon-card__types">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
    </Link>
  )
}

export default PokemonCard
