import Form from "@/components/Form";
import { sendQuery } from "@/lib/dbclient";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() { 
    const [loginMessage, setLoginMessage] = useState("");
    const router = useRouter();

    async function handleLogin(username: string, password: string) {
        if (username.length > 0 && password.length > 0) {
            // Check if user already exists
            const existingUserCheckContent = "SELECT * FROM `cmd_degree_guide`.`Users` WHERE `username` = ?;"
            const existingUserCheckResponseObject = await sendQuery(existingUserCheckContent, username);

            if (existingUserCheckResponseObject.response.length > 0
                && existingUserCheckResponseObject.response[0].password === password) {
                // User exists, login
                // TODO: Save username to localStorage or cookie
                setLoginMessage("Log in success! Redirecting in 3 seconds...");
                // TODO: Set redirect
            } else {
                // Username and password are incorrect, stop
                setLoginMessage("Incorrect username and/or password.")
            }
        } else {
            // Empty username or password
            setLoginMessage("Please enter a valid username and/or password");
        }
    }

    return ( 
        <>
            <h1> Log In </h1> 
            <div className="displayBox">
                <Form name="Login" onLogin={handleLogin}/>
                {loginMessage && <p className="text-red-500">{loginMessage}</p>}
            </div> 
        </>

    )


}