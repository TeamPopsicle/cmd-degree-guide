/*
    i. Show the results of the generative algorithm in an easy to read visual page
    ii. Popsicle
    iii. Ethan Cha, Peyton Elebash, Haley Figone, Yaya Yao
*/

import { useRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar/Navbar";
import Schedule from '@/components/Schedule';
import { sendDbCommand } from '@/lib/dbclient';
import { getLocalStorage } from '@/lib/LocalStorage';
import styles from '@/styles/finalSchedule.module.css';

// Main App component
export default function App() {
  // Define the seasons
  const seasons = ['Fall', 'Winter', 'Spring'];

  // Retrieve the logged-in user from local storage
  const loggedInUser = getLocalStorage("loggedInUser");

  // Next.js router instance
  const router = useRouter();

  // State to handle error messages
  const [errorMessage, setErrorMessage] = useState("");

  // Check on visit if user is logged in first, redirect to login if not
  useEffect(() => {
    if (loggedInUser === "") {
      router.push("/login");
    }
  }, [loggedInUser, router])

  // Handle going back to the input page
  async function handleBack() {
    // Delete user schedule so they can properly go back to /input
    //const scheduleContent = "UPDATE `Users` SET `schedule` = NULL WHERE (`username` = ?);";
    const scheduleResponseObject = await sendDbCommand("deleteschedule", loggedInUser);
    if (!scheduleResponseObject.response.error) {
      router.push("/input");
    } else {
      console.error(scheduleResponseObject.response.error);
      setErrorMessage("Unexpected internal error, see console and report the issue by contacting us.");
    }
  }

  return (
    <div className={styles['container']}>
      {/* Render the Navbar component */}
      <Navbar />

      {/* Page title */}
      <h1 className={styles['page-title']}>
        4-Year Degree Plan
      </h1>

       {/* Render links to external resources */}
      <Link href="https://catalog.uoregon.edu/courses/" target="_blank" rel="noopener noreferrer" className={styles['link']}>
        Course Catalog
      </Link>
      <Link href="https://catalog.uoregon.edu/genedcourses/#text" target="_blank" rel="noopener noreferrer" className={styles['link']}>
        Core Education Courses
      </Link>
      <Link href="https://catalog.uoregon.edu/admissiontograduation/bachelorrequirements/" target="_blank" rel="noopener noreferrer" className={styles['link']}>
        Bachelor&apos;s Degree Requirements
      </Link>
      <Link href="https://advising.uoregon.edu/" target="_blank" rel="noopener noreferrer" className={styles['link']}>
        Advising
      </Link>
      <Link href="https://www.uoregon.edu/" target="_blank" rel="noopener noreferrer" className={styles['link']}>
        Others
      </Link>

      {/* Render the Schedule component */}
      <Schedule seasons={seasons} loggedInUser={loggedInUser} setErrorMessage={setErrorMessage} />

       {/* Button to go back to schedule input */}
      <button className={styles['back-button']} onClick={handleBack}>Delete Schedule and Go Back to Schedule Input</button>

      {/* Display error message if present */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};
