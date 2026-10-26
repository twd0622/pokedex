import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import Header from '../components/Header'
import PokemonGrid from '../components/PokemonGrid'
import Sidebar from '../components/Sidebar'
import { GENERATIONS } from '../data/generations'
import { TYPES } from '../data/types'
import { usePokemonList } from '../hooks/usePokemonList'
import { filterPokemon } from '../lib/filter'
import './ListPage.css'

// 목록 화면 전체. 검색어와 필터는 주소의 쿼리(?q=리자&gen=1&type=fire)에 둔다.
// 그래서 상세 페이지에 갔다가 돌아와도, 새로고침해도 조건이 남아 있다.
function ListPage() {
  const { list, loading, error, retry } = usePokemonList()
  const [searchParams, setSearchParams] = useSearchParams()

  // 주소의 글자를 읽어서 쓸 수 있는 값만 받아들인다. 이상한 값은 「전체」로 친다.
  const query = searchParams.get('q') ?? ''
  const genParam = Number(searchParams.get('gen'))
  const generation = GENERATIONS.some((g) => g.id === genParam) ? genParam : null
  const typeParam = searchParams.get('type')
  const type = typeParam in TYPES ? typeParam : null

  // 쿼리 하나를 바꾼다. 빈 값이면 주소에서 지운다.
  // replace: 글자를 칠 때마다 방문 기록이 쌓이지 않게 한다.
  function updateParam(name, value) {
    const next = new URLSearchParams(searchParams)
    if (value === null || value === '') next.delete(name)
    else next.set(name, String(value))
    setSearchParams(next, { replace: true })
  }

  const setQuery = (value) => updateParam('q', value)
  const setGeneration = (value) => updateParam('gen', value)
  const setType = (value) => updateParam('type', value)

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
