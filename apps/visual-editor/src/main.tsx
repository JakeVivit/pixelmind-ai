import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { App } from './App'
import { GlobalProvider } from '@providers/GlobalProvider'
import { theme } from '@styles/theme'
import '@styles/global.css'

// Enable React strict mode for better development experience
const StrictMode = import.meta.env.DEV ? React.StrictMode : React.Fragment

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </ConfigProvider>
  </StrictMode>
)
