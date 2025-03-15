import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter as Router} from 'react-router-dom';
import { AnimatedRoutes } from './components/Routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AnimatedRoutes />
    </Router>
  </StrictMode>
)
