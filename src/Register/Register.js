import React, {useState} from 'react';
import axios from 'axios';
import qs from 'qs';
import {useNavigate} from "react-router-dom";

const RegisterPage = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const goToLogin = () => {
        props.goToLogin();
    };

    const handleRegister = async () => {
        try {
            const response = await axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/auth/',
                data: {
                    username,
                    password,
                    email,
                    role,
                },
                headers: {
                    'content-type': 'application/json'
                }
            });

            if (response.status === 201) {
                localStorage.setItem('token', response.data.access_token);
                props.onRegister();
            }

        } catch (error) {
            console.error(error);
            setErrorMessage('Registration failed');
        }
    };


    return (
        <div>
            <h2>Register</h2>
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
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
            {errorMessage && <p>{errorMessage}</p>}
            <button onClick={goToLogin}>Go to Login</button>
        </div>
    );
};

export default RegisterPage;
