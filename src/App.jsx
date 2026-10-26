import { Route, Routes } from 'react-router'
import DetailPage from './pages/DetailPage'
import ListPage from './pages/ListPage'
import NotFound from './pages/NotFound'
import './App.css'

// 주소에 따라 어떤 화면을 보여 줄지 정한다.
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/pokemon/:id" element={<DetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
