import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* useTransitions={false}: 주소가 바뀔 때 바로 화면에 반영한다.
        기본값(transition)이면 주소 값으로 제어하는 검색창에서 한글 입력이 깨진다. */}
    <BrowserRouter useTransitions={false}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
