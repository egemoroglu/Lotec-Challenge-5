import React, {useState} from 'react';
import { Link } from 'react-router-dom';

export const SignUpPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async () => {
        
    }

    return(
        <div className='signup-div'>
            <h1>Sign Up</h1>
            <input
                type="text"
                className='username-input'
                placeholder="Username"
                required={true}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className='password-input'
                value={password}
                required={true}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className='signup-btn' onClick={handleSignUp}>Sign Up</button>
            {/**If the user already have an account link to signin page */}
            <Link to="/signin">Already have an account? Sign in</Link>
        </div>

    )

}