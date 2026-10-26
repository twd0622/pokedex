import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { fetchPokemonDetail } from '../api/pokemon'
import BattleTab from '../components/detail/BattleTab'
import EvolutionTab from '../components/detail/EvolutionTab'
import Hero from '../components/detail/Hero'
import Tabs from '../components/detail/Tabs'
import { useAsync } from '../hooks/useAsync'
import { normalizeDetail, parsePokemonId } from '../lib/normalize'
import NotFound from './NotFound'

async function loadDetail(id) {
  if (id === null) return null
  const raw = await fetchPokemonDetail(id)
  return raw && normalizeDetail(raw)
}

// 목록에서 왔으면 브라우저 「뒤로」처럼 돌아가서 필터와 스크롤 위치를 지킨다.
// depth는 목록 이후 상세 페이지를 몇 개 거쳤는지다. (진화 단계를 누르면 1씩 늘어난다)
// 주소를 직접 열었으면 목록 첫 화면으로 간다.
function BackLink() {
  const location = useLocation()
  const navigate = useNavigate()

  if (location.state?.fromList !== undefined) {
    return (
      <button
        type="button"
        className="back-link"
        onClick={() => navigate(-(location.state.depth ?? 1))}
      >
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

const TABS = [
  { id: 'battle', label: '배틀' },
  { id: 'evolution', label: '진화·모습' },
  { id: 'moves', label: '기술' },
  { id: 'details', label: '세부 데이터' },
]

function DetailPage() {
  const params = useParams()
  const id = parsePokemonId(params.id)
  const { data: detail, loading, error, retry } = useAsync(() => loadDetail(id), [id])

  // 선택한 탭은 주소(?tab=moves)에 둔다. 없거나 이상한 값이면 배틀 탭.
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab = TABS.some((t) => t.id === tabParam) ? tabParam : 'battle'
  // state: 탭을 바꿔도 "목록에서 왔다"는 쪽지(fromList)를 잃지 않게 그대로 넘긴다.
  const location = useLocation()
  const changeTab = (tab) =>
    setSearchParams({ tab }, { replace: true, state: location.state })

  // 선택한 모습. 어느 포켓몬에서 고른 것인지(id)도 함께 기억해서,
  // 다른 포켓몬으로 이동하면 자동으로 기본 모습(0)이 된다.
  const [formChoice, setFormChoice] = useState({ id, index: 0 })
  const formIndex = formChoice.id === id ? formChoice.index : 0
  const selectForm = (index) => setFormChoice({ id, index })

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

  const form = detail.forms[formIndex] ?? detail.forms[0]

  return (
    <>
      <BackLink />
      <Hero detail={detail} form={form} />
      <Tabs tabs={TABS} active={activeTab} onChange={changeTab} />
      {activeTab === 'battle' && <BattleTab form={form} />}
      {activeTab === 'evolution' && (
        <EvolutionTab detail={detail} selectedFormIndex={formIndex} onSelectForm={selectForm} />
      )}
      {(activeTab === 'moves' || activeTab === 'details') && (
        <p className="status">준비 중이에요.</p>
      )}
    </>
  )
}

export default DetailPage
