import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Bootstrap's stylesheet must be imported once for React Bootstrap components to be styled.
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

// HashRouter keeps the route after a "#" in the URL (e.g. .../#/favorites).
// GitHub Pages only serves real files, so this avoids 404 errors when a page is refreshed.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
      <Toaster position="bottom-center" />
    </HashRouter>
  </StrictMode>
)
