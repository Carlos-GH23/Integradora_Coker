
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from '../auth/Login'
import Nurses from '../Nurses/Nurses';

import Tablepacients from '../components/nurses-pacients';
import HomeNurses from '../components/home-nurses';
import { isAdmin, isLoggedIn, isNurse, isSecretary } from '../services/LoginServices';
import Admin from '../admin/admin';
import Secretary from '../secretary/Secretary';
import ListNurses from '../components/table-nurses';
import ListSecretary from '../components/table-secretary';
import ListFloor from '../components/table-floors';
import ListBeds from '../components/table-beds';
import { AiFillHome } from 'react-icons/ai';

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
                    <Route path='inicio' element={<AiFillHome/>}/>
                    <Route path='enfermeras' element={<ListNurses/>}/>
                    <Route path='secretarias' element={<ListSecretary/>}/>
                    <Route path='pisos' element={<ListFloor/>} />
                    <Route path='camas' element={<ListBeds/>} />
                    <Route path='pacientes' element={<Tablepacients/>} />
                </Route>
                )}

                {secretary && loggedIn && (
                <Route path='/secretaria' element={<Secretary/>}>
                    <Route path='inicio' element={<AiFillHome/>}/>
                    <Route path='enfermeras' element={<ListNurses/>}/>
                    <Route path='camas' element={<ListBeds/>} />                
                </Route>
                )}

                {nurse && loggedIn && (
                <Route path="/enfermera" element={<Nurses />} >
                    <Route path='inicio' element={<HomeNurses/>} />
                    <Route path='pacientes' element={<Tablepacients/>} />
                </Route>
                )}



            </Routes>
        </AnimatePresence>
    );
}