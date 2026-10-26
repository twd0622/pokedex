import PokemonCard from './PokemonCard'
import './PokemonGrid.css'

// 포켓몬 배열을 받아 카드를 격자로 늘어놓는다.
function PokemonGrid({ pokemonList }) {
  return (
    <div className="pokemon-grid">
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  )
}

export default PokemonGrid
