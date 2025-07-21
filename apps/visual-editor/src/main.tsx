import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { GlobalProvider } from '@providers/GlobalProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import '@styles/global.css'
import './styles/globals.css'

// Enable React strict mode for better development experience
const StrictMode = import.meta.env.DEV ? React.StrictMode : React.Fragment

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </ThemeProvider>
  </StrictMode>
)
