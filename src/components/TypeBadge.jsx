import { TYPES } from '../data/types'
import './TypeBadge.css'

// 타입 하나를 색 배지로 보여 준다. 예: <TypeBadge type="fire" />
function TypeBadge({ type }) {
  const { ko, color } = TYPES[type]
  return (
    <span className="type-badge" style={{ background: color }}>
      {ko}
    </span>
  )
}

export default TypeBadge
