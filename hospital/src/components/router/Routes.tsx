
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from '../auth/Login'
import Nurses from '../Nurses/Nurses';

import Tablepacients from '../components/nurses-pacients';
import HomeNurses from '../components/home-nurses';
import { isAdmin, isLoggedIn, isNurse, isSecretary } from '../services/LoginServices';
import Admin from '../admin/admin';
import Secretary from '../secretary/Secretary';

export const AnimatedRoutes = () => {
    const location = useLocation();
    const loggedIn = isLoggedIn();
    const admin = isAdmin();
    const secretary = isSecretary();
    const nurse = isNurse();
    console.log("location.pathname: ", location.pathname);

    return (
        <AnimatePresence mode="wait" className="min-h-screen w-full flex">
            <Routes location={location} key={location.pathname}>

            <Route path="/" element={loggedIn ? <Navigate to={admin ? "/admin" : secretary ? "/secretaria" : nurse ? "/enfermera" : "/login"} /> : <Login />} />

                <Route path="/login" element={<Login />} />

                {admin && loggedIn && (
                <Route path='/admin' element={<Admin/>} >
                    <Route path='' />
                    <Route path='enfermeras' />
                    <Route path='secretarias' />
                    <Route path='pisos' />
                </Route>
                )}

                {secretary && loggedIn && (
                <Route path='/secretaria' element={<Secretary/>}>
                    <Route path='' />
                    <Route path='enfermeras' />
                    <Route path='camas' />                
                </Route>
                )}

                {nurse && loggedIn && (
                <Route path="/enfermera" element={<Nurses />} >
                    <Route path='' element={<HomeNurses/>} />
                    <Route path='pacientes' element={<Tablepacients/>} />
                </Route>
                )}



            </Routes>
        </AnimatePresence>
    );
}