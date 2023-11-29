import { useRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar/Navbar";
import Schedule from '@/components/Schedule';
import { sendQuery } from '@/lib/dbclient';
import { getLocalStorage } from '@/lib/LocalStorage';
import styles from '@/styles/finalSchedule.module.css';

export default function App() {
  const seasons = ['Fall', 'Winter', 'Spring'];
  const loggedInUser = getLocalStorage("loggedInUser");
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (loggedInUser === "") {
      router.push("/login");
    }
  }, [loggedInUser, router])

  async function handleBack() {
    // Delete user schedule so they can properly go back to /input
    const scheduleContent = "UPDATE `Users` SET `schedule` = NULL WHERE (`username` = ?);";
    const scheduleResponseObject = await sendQuery(scheduleContent, loggedInUser);
    if (!scheduleResponseObject.response.error) {
      router.push("/input");
    } else {
      console.error(scheduleResponseObject.response.error);
      setErrorMessage("Unexpected internal error, see console and report the issue by contacting us.");
    }
  }

  return (
    <div className={styles['container']}>
      <Navbar />
      <h1 className={styles['page-title']}>
        4-Year Degree Plan
      </h1>
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
      <Schedule seasons={seasons} loggedInUser={loggedInUser} setErrorMessage={setErrorMessage} />
      <button className={styles['back-button']} onClick={handleBack}>Delete Schedule and Go Back to Schedule Input</button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};
