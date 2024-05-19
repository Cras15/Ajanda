import { CssVarsProvider } from '@mui/joy'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { store } from './redux/store'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <CssVarsProvider disableTransitionOnChange>
        <Provider store={store}>
          <App />
        </Provider>
      </CssVarsProvider>
    </HashRouter>
  </React.StrictMode>
)
