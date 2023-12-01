/*
    i. a statement of what it represents or implements,
    ii. the group name,
    iii. the names of all authors (alphabetically by last name),
    iv. the product’s author information should be clear, i.e., what each
        component is or implements, who created or last updated it, and
        when.
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