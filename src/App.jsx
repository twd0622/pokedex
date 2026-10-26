import Header from './components/Header'
import PokemonGrid from './components/PokemonGrid'
import { usePokemonList } from './hooks/usePokemonList'
import './App.css'

function App() {
  const { list, loading, error, retry } = usePokemonList()

  return (
    <div className="app">
      <Header />
      {loading && <p className="status">불러오는 중…</p>}
      {error && (
        <div className="status">
          <p>데이터를 불러오지 못했어요.</p>
          <button type="button" onClick={retry}>
            다시 시도
          </button>
        </div>
      )}
      {!loading && !error && <PokemonGrid pokemonList={list} />}
    </div>
  )
}

export default App
