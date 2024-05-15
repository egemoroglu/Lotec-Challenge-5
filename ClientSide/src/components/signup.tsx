import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {Button, Input} from 'antd';
import FrontendAdapter from '../../../ServerSide/UserServer/src/adapters/FrontendAdapter/FrontendAdapter'

const frontAdapter: FrontendAdapter = new FrontendAdapter();

export const SignUpPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async () => {
        try{
            await frontAdapter.signupUser(username, password);
        }catch(err){
            alert('Error: User cannot be signed up');
        }
        setUsername("");
        setPassword("");
    }

    return(
        <div className='signup-div'>
            <h1>Sign Up</h1>
            <Input
                type="text"
                className='username-input'
                placeholder="Username"
                required={true}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                className='password-input'
                value={password}
                required={true}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button className='btn' onClick={handleSignUp}>Sign Up</Button>
            {/**If the user already have an account link to signin page */}
            <Link to="/signin">Already have an account? Sign in</Link>
        </div>

    )

}