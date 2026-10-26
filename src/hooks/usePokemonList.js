import { useEffect, useState } from 'react'
import { fetchPokemonList } from '../api/pokemon'
import { readListCache, writeListCache } from '../lib/listCache'
import { normalizeList } from '../lib/normalize'

// 포켓몬 전체 목록을 불러온다.
// 저장해 둔 목록이 있으면 그것을 바로 쓰고, 없으면 API에서 받아 저장한다.
export function usePokemonList() {
  const [list, setList] = useState(() => readListCache(localStorage) ?? [])
  const [loading, setLoading] = useState(list.length === 0)
  const [error, setError] = useState(null)
  // 이 숫자가 바뀌면 아래 effect가 다시 실행된다. 「다시 시도」에 쓴다.
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (list.length > 0) return

    // 화면이 사라진 뒤에 응답이 오면 무시하기 위한 표시
    let ignore = false

    fetchPokemonList()
      .then((raw) => {
        if (ignore) return
        const normalized = normalizeList(raw)
        writeListCache(localStorage, normalized)
        setList(normalized)
      })
      .catch((err) => {
        if (!ignore) setError(err)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [attempt, list.length])

  // 로딩·오류 상태는 버튼을 누른 순간(이벤트)에 바꾸고, effect는 요청만 담당한다.
  const retry = () => {
    setError(null)
    setLoading(true)
    setAttempt((n) => n + 1)
  }

  return { list, loading, error, retry }
}
