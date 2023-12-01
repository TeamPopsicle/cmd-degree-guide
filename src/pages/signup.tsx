/*
    i. a statement of what it represents or implements,
    ii. the group name,
    iii. the names of all authors (alphabetically by last name),
    iv. the product’s author information should be clear, i.e., what each
        component is or implements, who created or last updated it, and
        when.
*/

import Navbar from "@/components/Navbar/Navbar";
import Form from "@/components/Form";
import { sendQuery } from "@/lib/dbclient";
import { useRouter } from "next/router";
import { useState } from "react";
import { saveToLocalStorage } from "@/lib/LocalStorage";

export default function Signup() {
    const [registrationMessage, setRegistrationMessage] = useState("");
    const router = useRouter();

    async function handleLogin(username: string, password: string) {
        if (username.length > 0 && password.length > 0) {
            // Check if user already exists
            const existingUserCheckQuery = "SELECT * FROM `cmd_degree_guide`.`Users` WHERE `username` = ?;";
            const existingUserResponseObject = await sendQuery(existingUserCheckQuery, username);

            // Check if database connection was successful
            if (!existingUserResponseObject.response.error) {
                if (existingUserResponseObject.response.length === 0) {
                    // User doesn't exist, register
                    const registerUserContent = "INSERT INTO `cmd_degree_guide`.`Users` (`username`, `password`) VALUES (?, ?)";
                    const registerResponseObject = await sendQuery(registerUserContent, username, password);
                    if (registerResponseObject) {
                        saveToLocalStorage("loggedInUser", username);
                        setRegistrationMessage("New account created successfully! Redirecting in 3 seconds...");
                        // Wait 3 seconds, then redirect
                        setTimeout(() => {
                            router.push("/input");
                        }, 3000);
                    }
                } else {
                    // User does exist, stop
                    setRegistrationMessage("An account under that name already exists.");
                }
            } else {
                console.error(existingUserResponseObject.response.error);
                setRegistrationMessage("Unexpected internal error, see console and report the issue by contacting us.");
            }
        } else {
            // Empty username or password
            setRegistrationMessage("Please enter a valid username and/or password");
        }
    }

    return (
        <>
            <Navbar />
            <h1>Sign Up</h1>
            <div className="displayBox">
                {/* If we want to tell users about any username/password requirements, put them here, 
                put them here. */}
                <Form name="Login" onLogin={handleLogin} />
                {registrationMessage && <p className="text-red-500">{registrationMessage}</p>}
            </div>
        </>
    )
}