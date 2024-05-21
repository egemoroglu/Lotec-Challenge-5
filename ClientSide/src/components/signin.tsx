import React, {useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Button, Input } from "antd";

const baseUrl = "https://hf6ib46e75.execute-api.us-east-1.amazonaws.com";

export const SignInPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const response = await axios.post(`${baseUrl}/signin`, {
                username: username,
                password: password
            });
            console.log(response.data);
            navigate("/todos", {state: {username: username}});
               
        } catch (error) {
            alert('Error: User cannot be signed in')
        }
        setUsername("");
        setPassword("");
    }

    return(
        <div className='signin-div'>
            <h1>Sign In</h1>
            <Input
                type="text"
                className='username-input'
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                className='password-input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button className='btn' onClick={handleSignIn}>Sign In</Button>
            {/**If the user already have an account link to signin page */}
            <Link to="/">Don't have an account? Sign up</Link>
        </div>

    )


}