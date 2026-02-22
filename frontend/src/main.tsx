import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e1e2e',
            color: '#f8fafc',
            border: '1px solid #27273a',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#1e1e2e',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1e1e2e',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
