import { useMemo, useState } from 'react'
import Header from '../components/Header'
import PokemonGrid from '../components/PokemonGrid'
import Sidebar from '../components/Sidebar'
import { usePokemonList } from '../hooks/usePokemonList'
import { filterPokemon } from '../lib/filter'
import './ListPage.css'

// 목록 화면 전체. 검색어와 필터 상태를 여기서 가지고 자식에게 나눠 준다.
function ListPage() {
  const { list, loading, error, retry } = usePokemonList()
  const [query, setQuery] = useState('')
  const [generation, setGeneration] = useState(null)
  const [type, setType] = useState(null)

  // 목록이나 조건이 바뀔 때만 다시 거른다.
  const filtered = useMemo(
    () => filterPokemon(list, { query, generation, type }),
    [list, query, generation, type],
  )

  return (
    <>
      <Header>
        <input
          className="search"
          type="search"
          placeholder="이름이나 번호로 검색 (예: 피카츄, 25)"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </Header>

      {loading && <p className="status">불러오는 중…</p>}
      {error && (
        <div className="status">
          <p>데이터를 불러오지 못했어요.</p>
          <button type="button" onClick={retry}>
            다시 시도
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="list-page">
          <Sidebar
            generation={generation}
            type={type}
            onGenerationChange={setGeneration}
            onTypeChange={setType}
          />
          <main className="list-page__main">
            <p className="list-page__count">{filtered.length}마리</p>
            {filtered.length > 0 ? (
              <PokemonGrid pokemonList={filtered} />
            ) : (
              <p className="status">조건에 맞는 포켓몬이 없어요.</p>
            )}
          </main>
        </div>
      )}
    </>
  )
}

export default ListPage
