import React, {useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import { Button, Input } from "antd";
import FrontendAdapter from "../../../ServerSide/UserServer/src/FrontendAdapter/FrontendAdapter"

const frontAdapter: FrontendAdapter = new FrontendAdapter();


export const SignInPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            await frontAdapter.signinUser(username, password);
            console.log("Sending the request");
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