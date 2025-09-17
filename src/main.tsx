import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './global.css'
import App from './App.jsx'
import { EndPage } from './pages/EndPage'
import { TenantProvider } from './context/TenantProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TenantProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/bedankt" element={<EndPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TenantProvider>
  </StrictMode>,
)
