import React, { useState } from 'react';
import { FaUser, FaEyeSlash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import hospitalBg from "../../assets/hospital.jpg";
import ErrorMessage from '../custom/ErrorMessage';
import { isAdmin, isNurse, isSecretary, login } from '../services/LoginServices';

function Login() {
    const navigation = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [seePassword, setSeePassword] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            await login(username,password);
            const user = localStorage.getItem("user");
            console.log("Login successful: ", user);
            if(isAdmin()) {
                navigation("/admin/inicio");
            }
            if(isSecretary()) {
                navigation("/secretaria/inicio");
            }
            if(isNurse()) {
                navigation("/enfermera/inicio");
            }
        } catch (error) {
            console.log('Error: ', error)
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${hospitalBg})`}}>
            <div className="w-[420px] bg-white/10 border border-white/20 backdrop-blur-lg shadow-lg text-white rounded-lg p-10">
                <form onSubmit={handleLogin} className='flex flex-col space-y-4'>
                    <h1 className='text-3xl font-bold text-black text-center'>Iniciar Sesion</h1>

                    <div className='relative'>
                        <input 
                            type="text" 
                            placeholder="Usuario" 
                            required 
                            name="username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className='w-full h-12 bg-transparent border border-black/50 rounded-full text-black px-5 pr-12 placeholder-black outline-none'
                        />
                        <FaUser className='absolute right-4 top-1/2 transform -translate-y-1/2 text-black'/>
                    </div>

                    <div className='relative'>
                        <input 
                            type={seePassword ? "text" : "password"} 
                            placeholder="Contraseña" 
                            required 
                            name="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            autoComplete="new-password"
                            className='w-full h-12 bg-transparent border border-black/50 rounded-full text-black px-5 pr-12 placeholder-black outline-none'
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" 
                            onClick={() => setSeePassword(!seePassword)}>
                            {seePassword ? <FaEye className="text-black" /> : <FaEyeSlash className="text-black" />}
                        </span>
                    </div>
                    
                    <button type="submit" 
                            className="w-full h-12 bg-white text-gray-800 font-bold rounded-full shadow-md hover:bg-gray-300 transition">
                        Iniciar sesión
                    </button>
                </form>
            </div>

            {error && <ErrorMessage message={error}/>}
        </div>
    );
};

export default Login;
