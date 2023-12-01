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


export default function Login() {
    const [loginMessage, setLoginMessage] = useState("");
    const router = useRouter();

    async function handleLogin(username: string, password: string) {
        if (username.length > 0 && password.length > 0) {
            // Check if user already exists
            const existingUserCheckQuery = "SELECT * FROM `cmd_degree_guide`.`Users` WHERE `username` = ?;"
            const existingUserResponseObject = await sendQuery(existingUserCheckQuery, username);

            // Check if database connection was successful
            if (!existingUserResponseObject.response.error) {
                if (existingUserResponseObject.response.length > 0
                && existingUserResponseObject.response[0].password === password) {
                    let scheduleExists = false;
                    // User exists, login
                    saveToLocalStorage("loggedInUser", existingUserResponseObject.response[0].username);
                    setLoginMessage("Log in success! Redirecting in 3 seconds...");
                    // Check if schedule exists under user exists first
                    const getScheduleContent = "SELECT `schedule` FROM `Users` WHERE username = ?";
                    const getScheduleObject = await sendQuery(getScheduleContent, username);
                    if (getScheduleObject.response[0].schedule) {
                        console.log("schedule exists!");
                        scheduleExists = true;
                    } else {
                        console.log("schedule do not exist!");
                        scheduleExists = false;
                    }
                    // Wait 3 seconds, then redirect
                    setTimeout(() => {
                        if (scheduleExists) {
                            router.push("/finalSchedule")
                        } else {
                            router.push("/input");
                        }
                    }, 3000)
                } else {
                    // Username and password are incorrect, stop
                    setLoginMessage("Incorrect username and/or password.")
                }
            } else {
                console.error(existingUserResponseObject.response.error);
                setLoginMessage("Unexpected internal error, see console and report the issue by contacting us.");
            }
        } else {
            // Empty username or password
            setLoginMessage("Please enter a valid username and/or password");
        }
    }

    return (
        <>
            <Navbar />
            <h1> Log In </h1>
            <div className="displayBox">
                <Form name="Login" onLogin={handleLogin} />
                {loginMessage && <p className="text-red-500">{loginMessage}</p>}
            </div>
        </>

    )


}