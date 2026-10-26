import { artworkUrl, formatNumber } from '../lib/format'
import TypeBadge from './TypeBadge'
import './PokemonCard.css'

// 포켓몬 한 마리를 카드로 보여 준다.
function PokemonCard({ pokemon }) {
  return (
    <div className="pokemon-card">
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
    </div>
  )
}

export default PokemonCard
