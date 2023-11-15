import Navbar from "@/components/Navbar/Navbar";
import Form from "@/components/Form";
import { sendQuery } from "@/lib/dbclient";
import { useRouter } from "next/router";
import { useState } from "react";
import { saveToLocalStorage } from "@/lib/LocalStorage";


export default function Login() { 
    const [loginMessage, setLoginMessage] = useState("");
    const router = useRouter();

    async function handleLogin(username: string, password: string) {
        if (username.length > 0 && password.length > 0) {
            // Check if user already exists
            const existingUserCheckQuery = "SELECT * FROM `cmd_degree_guide`.`Users` WHERE `username` = ?;"
            const existingUserResponseObject = await sendQuery(existingUserCheckQuery, username);

            if (existingUserResponseObject.response.length > 0
                && existingUserResponseObject.response[0].password === password) {
                // User exists, login
                saveToLocalStorage("loggedInUser", existingUserResponseObject.response[0].username);
                setLoginMessage("Log in success! Redirecting in 3 seconds...");
                // Wait 3 seconds, then redirect
                setTimeout(() => {
                    router.push("/input");
                }, 3000)
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
            <Navbar/>
            <h1> Log In </h1> 
            <div className="displayBox">
                <Form name="Login" onLogin={handleLogin}/>
                {loginMessage && <p className="text-red-500">{loginMessage}</p>}
            </div> 
        </>

    )


}