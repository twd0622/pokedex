import Header from './components/Header'
import PokemonGrid from './components/PokemonGrid'
import './App.css'

// 지금은 직접 적은 샘플 3마리. 다음 단계에서 API 데이터로 바꾼다.
const samplePokemon = [
  { id: 1, name: '이상해씨', generation: 1, types: ['grass', 'poison'] },
  { id: 4, name: '파이리', generation: 1, types: ['fire'] },
  { id: 6, name: '리자몽', generation: 1, types: ['fire', 'flying'] },
]

function App() {
  return (
    <div className="app">
      <Header />
      <PokemonGrid pokemonList={samplePokemon} />
    </div>
  )
}

export default App
