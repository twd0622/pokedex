import { useEffect, useState } from 'react'

// 비동기 함수를 실행하고 { data, loading, error, retry }를 돌려준다.
// deps가 바뀌면 다시 실행하고, 늦게 도착한 이전 응답은 버린다.
export function useAsync(asyncFn, deps) {
  const [attempt, setAttempt] = useState(0)
  // 결과마다 "어떤 요청의 결과인지"를 key로 붙여 둔다.
  const [result, setResult] = useState({ key: null, data: null, error: null })

  const key = JSON.stringify([...deps, attempt])

  useEffect(() => {
    let ignore = false
    asyncFn()
      .then((data) => {
        if (!ignore) setResult({ key, data, error: null })
      })
      .catch((error) => {
        if (!ignore) setResult({ key, data: null, error })
      })
    return () => {
      ignore = true
    }
    // key 안에 deps와 attempt가 모두 들어 있다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // 지금 요청(key)에 대한 결과가 아직 없으면 로딩 중이다.
  const loading = result.key !== key

  return {
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    loading,
    retry: () => setAttempt((n) => n + 1),
  }
}
