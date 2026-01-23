// Polyfills must be imported first
import './polyfills'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { initPromise } from './i18n' // i18n initialization with promise
import App from './App.tsx'

const root = createRoot(document.getElementById('root')!)

// i18n 초기화가 완료된 후 앱 렌더링
initPromise.then(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
