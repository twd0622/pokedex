import { Link } from 'react-router'

function NotFound() {
  return (
    <div className="status">
      <p>포켓몬을 찾을 수 없어요.</p>
      <Link to="/" className="back-link">
        ← 도감으로 돌아가기
      </Link>
    </div>
  )
}

export default NotFound
