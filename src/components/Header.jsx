import './Header.css'

// 맨 위 빨간 바. 검색창처럼 안에 넣을 내용은 children으로 받는다.
function Header({ children }) {
  return (
    <header className="header">
      <div className="header__logo">포켓몬 도감</div>
      {children}
    </header>
  )
}

export default Header
