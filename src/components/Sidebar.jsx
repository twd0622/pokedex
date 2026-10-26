import { GENERATIONS } from '../data/generations'
import { TYPES, TYPE_ORDER } from '../data/types'
import './Sidebar.css'

// 선택 목록 하나. 맨 위 「전체」는 value가 null이다.
function FilterGroup({ title, options, selected, onChange }) {
  return (
    <section className="sidebar__group">
      <h4>{title}</h4>
      <ul>
        {[{ value: null, label: '전체' }, ...options].map((option) => (
          <li key={option.value ?? 'all'}>
            <button
              type="button"
              className={option.value === selected ? 'is-selected' : ''}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

const generationOptions = GENERATIONS.map((g) => ({ value: g.id, label: g.label }))
const typeOptions = TYPE_ORDER.map((t) => ({ value: t, label: TYPES[t].ko }))

// 세대·타입 선택. 선택한 값은 부모(ListPage)가 가지고 있다.
function Sidebar({ generation, type, onGenerationChange, onTypeChange }) {
  return (
    <aside className="sidebar">
      <FilterGroup
        title="세대"
        options={generationOptions}
        selected={generation}
        onChange={onGenerationChange}
      />
      <FilterGroup
        title="타입"
        options={typeOptions}
        selected={type}
        onChange={onTypeChange}
      />
    </aside>
  )
}

export default Sidebar
