import { AnimatePresence } from 'framer-motion'
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';

import Login from './Login/Login'
import Nurses from './Nurses/Nurses';
import MenuTop from './Menu/MenuTop';

export const AnimatedRoutes = () => {
    const location = useLocation();
    console.log("location.pathname: ", location.pathname);

    return (
        <AnimatePresence mode= "wait">
            {location.pathname !== "/" && location.pathname !== "/login" && <MenuTop />}
            
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/nurses" element={<Nurses/>}></Route>
            </Routes>
        </AnimatePresence>
    );
}