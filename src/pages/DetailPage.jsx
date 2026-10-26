import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { fetchPokemonDetail } from '../api/pokemon'
import Hero from '../components/detail/Hero'
import { useAsync } from '../hooks/useAsync'
import { normalizeDetail, parsePokemonId } from '../lib/normalize'
import NotFound from './NotFound'

async function loadDetail(id) {
  if (id === null) return null
  const raw = await fetchPokemonDetail(id)
  return raw && normalizeDetail(raw)
}

// 목록에서 왔으면 브라우저 「뒤로」처럼 돌아가서 필터와 스크롤 위치를 지킨다.
// 주소를 직접 열었으면 목록 첫 화면으로 간다.
function BackLink() {
  const location = useLocation()
  const navigate = useNavigate()

  if (location.state?.fromList !== undefined) {
    return (
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← 도감으로 돌아가기
      </button>
    )
  }
  return (
    <Link to="/" className="back-link">
      ← 도감으로 돌아가기
    </Link>
  )
}

function DetailPage() {
  const params = useParams()
  const id = parsePokemonId(params.id)
  const { data: detail, loading, error, retry } = useAsync(() => loadDetail(id), [id])

  if (id === null) return <NotFound />
  if (loading) return <p className="status">불러오는 중…</p>
  if (error) {
    return (
      <div className="status">
        <p>데이터를 불러오지 못했어요.</p>
        <button type="button" onClick={retry}>
          다시 시도
        </button>
      </div>
    )
  }
  if (!detail) return <NotFound />

  return (
    <>
      <BackLink />
      <Hero detail={detail} form={detail.forms[0]} />
    </>
  )
}

export default DetailPage
