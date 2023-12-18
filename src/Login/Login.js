import React, {useState} from 'react';
import "./Login.css";
import axios from 'axios';
import qs from 'qs';

import { useNavigate } from 'react-router-dom';

const LoginPage = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const goToRegister = () => {
        props.goToRegister();
    };


    const handleLogin = async () => {
        try {
            const response = await axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/auth/token',
                data: qs.stringify({
                    username,
                    password,
                }),
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });

            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                props.onLogin();  // Notify the parent component that the login was successful
            }

        } catch (error) {
            console.error(error);
            setErrorMessage('Invalid username or password');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            {errorMessage && <p>{errorMessage}</p>}
            <button onClick={goToRegister}>Go to Register</button>
        </div>
    );
};

export default LoginPage;

