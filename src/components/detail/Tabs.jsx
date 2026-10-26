import './Tabs.css'

// 탭 버튼 줄. 어떤 탭이 선택됐는지는 부모가 가지고 있다.
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === active}
          className={tab.id === active ? 'tabs__tab is-active' : 'tabs__tab'}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default Tabs
