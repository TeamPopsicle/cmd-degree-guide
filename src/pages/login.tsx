/*
    i. Login page for existing users to view or edit their schedules
    ii. Popsicle
    iii. Ethan Cha, Peyton Elebash, Haley Figone, Yaya Yao
*/

import Navbar from "@/components/Navbar/Navbar";
import Form from "@/components/Form";
import { sendDbCommand } from "@/lib/dbclient";
import { useRouter } from "next/router";
import { useState } from "react";
import { saveToLocalStorage } from "@/lib/LocalStorage";


export default function Login() {
    const [loginMessage, setLoginMessage] = useState("");
    const router = useRouter();

    async function handleLogin(username: string, password: string) {
        if (username.length > 0 && password.length > 0) {
            // Check if user already exists
            const existingUserResponseObject = await sendDbCommand("getuser", username);
            // Check if database connection was successful
            if (!existingUserResponseObject.response.error) {
                if (existingUserResponseObject.response.length > 0
                && existingUserResponseObject.response[0].password === password) {
                    let scheduleExists = false;
                    // User exists, login
                    saveToLocalStorage("loggedInUser", existingUserResponseObject.response[0].username);
                    setLoginMessage("Log in success! Redirecting in 3 seconds...");
                    // Check if schedule exists under user exists first
                    const getScheduleObject = await sendDbCommand("getschedule", username);
                    if (getScheduleObject.response[0].schedule) {
                        scheduleExists = true;
                    } else {
                        scheduleExists = false;
                    }
                    // Wait 3 seconds, then redirect to final schedule if a schedule exists (not null), otherwise redirect to input
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