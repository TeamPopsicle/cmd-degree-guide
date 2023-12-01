/*
    i. Form component for user name and password
    ii. Popsicle
    iii. Ethan Cha, Peyton Elebash, Haley Figone, Yaya Yao
*/

import { useState } from "react";

export default function Form( {name, onLogin} : {name: string, onLogin: (username: string, password: string) => void} ) { 

    /* 
    */ 

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return ( 
    <>
        <form
        action="" 
        name={name}
        onSubmit={e => {
            e.preventDefault();
            onLogin(username, password);
        }}> 
            <label>Username:</label>
            <p><input name="username" onChange={e => setUsername(e.target.value)} autoComplete="off" required/></p>
            <label>Password:</label>
            <p><input name="password" onChange={e => setPassword(e.target.value)} type="password" required/></p> 
            <button type="submit" className="submitButton">Submit</button>
        </form> 
    </>
    ) 
};