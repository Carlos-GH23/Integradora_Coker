
import { AnimatePresence } from 'framer-motion'
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';

import Login from './Login/Login'
import Nurses from './Nurses/Nurses';

export const AnimatedRoutes = () => {
    const location = useLocation();
    console.log("location.pathname: ", location.pathname);

    return (
        <div className={`flex ${location.pathname !== "/" ? "p-6" : ""}`}>
            <AnimatePresence mode="wait" className="min-h-screen w-full flex">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/nurses" element={<Nurses />} />
                </Routes>
            </AnimatePresence>
        </div>
    );
}