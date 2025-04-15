import { AnimatePresence } from 'framer-motion'
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';

import Login from './components/auth/Login.tsx'

export const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence  mode= "wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login/>}></Route>
      </Routes>
    </AnimatePresence>
  );
}