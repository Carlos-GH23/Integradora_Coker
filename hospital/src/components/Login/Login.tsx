import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEyeSlash, FaEye } from 'react-icons/fa';
import './LoginView.css';
import { useNavigate } from 'react-router-dom'

function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(false);
    const [seePassword, setSeePassword] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const navigation = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post<{ token: string }>('http://localhost:8080/api/auth/login', {
                username,
                password
            });

            console.log("Respuesta del servidor:", response.data);

            if (response.status === 200) {
                if (remember) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                localStorage.setItem('token', response.data.token);
                navigation('/nurses');
            }
        } catch (error) {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div className="login">
            <form onSubmit={handleLogin}>
                <h1>Iniciar sesión</h1>

                {error && <p className="error">{error}</p>}

                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder="Usuario" 
                        required 
                        name="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <input 
                        type={seePassword ? "text" : "password"} 
                        placeholder="Contraseña" 
                        required 
                        name="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        autoComplete="new-password"
                    />
                    <span className="toggle-password" onClick={() => setSeePassword(!seePassword)}>
                        {seePassword ? <FaEye className="icon"/> : <FaEyeSlash className="icon"/>}
                    </span>
                </div>

                <div className="remember-forgot">
                    <label>
                        <input 
                            type="checkbox" 
                            name="remember" 
                            checked={remember} 
                            onChange={(e) => setRemember(e.target.checked)} 
                        />
                        Recuérdame
                    </label>
                    <a href="#">¿Olvidaste tu contraseña?</a>
                </div>
                <button type="submit">Iniciar sesión</button>
            </form>
        </div>
    );
};

export default Login;
