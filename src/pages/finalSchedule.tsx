import { getLocalStorage } from '@/lib/LocalStorage';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import styles from '@/styles/finalSchedule.module.css';
import Navbar from "@/components/Navbar/Navbar";
import { sendQuery } from '@/lib/dbclient';
import { useRouter } from 'next/router';


interface ScheduleProps {
  seasons: string[];
  loggedInUser: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

function TermTable({ parsedTerms }: { parsedTerms: string[][] }) {
  // Ensure parsedTerms has at least 12 elements
  const filledParsedTerms: Array<string[]> = [
    ...parsedTerms,
    ...Array(12 - parsedTerms.length).fill([]),
  ];

  return (
    <tbody>
      {
        /**
         * Sets up the structure a 3D array for all 4 years
         * Starts by creating a sliced array from parsed terms containing 1 year (3 terms)
         * This repeats 4 times, 1 for each year
         * Each iteration returns the row for that year as a <tr>
         * The overall resulting array follows the structure of a 3D array, like Plan[year[term[class]]]
         */
        Array.from({ length: 4 }, (_, yearIndex) => {
          const slicedArray = filledParsedTerms.slice(
            yearIndex * 3,
            (yearIndex + 1) * 3
          );

          return (
            <tr key={yearIndex}>
              {slicedArray.map((term, termIndex) => (
                <td key={termIndex} className={styles['schedule-cell']}>
                  {term.map((className, index) => (
                    <React.Fragment key={index}>
                      <p>{className}</p>
                    </React.Fragment>
                  ))}
                </td>
              ))}
            </tr>
          );
        })
      }
    </tbody>
  );
}

function Schedule({ seasons, loggedInUser, setErrorMessage }: ScheduleProps) {
  const [parsedTerms, setParsedTerms] = useState<Array<string[]>>([]);

  useEffect(() => {
    // Fetch and parse the terms data on the client side
    async function fetchSchedule() {
      if (loggedInUser) {
        const termsContent = "SELECT `schedule` FROM `Users` WHERE username = ?";
        const termsObject = await sendQuery(termsContent, loggedInUser);
        if (!termsObject.response.error) {
          const terms = termsObject.response[0].schedule;
          const parsedTerms = terms ? JSON.parse(terms) : [];
          setParsedTerms(parsedTerms);
        } else {
          console.error(termsObject.response.error);
          setErrorMessage("Unexpected internal error, see console and report the issue by contacting us.");
        }
      }

    }
    fetchSchedule();
  }, [loggedInUser, setErrorMessage]);

  return (
    <div className={styles['schedule-container']}>
      <table className={styles['schedule-table']}>
        <thead>
          <tr>
            {seasons.map((season, index) => (
              <th key={index} className={styles['schedule-title-row']}>
                {season}
              </th>
            ))}
          </tr>
        </thead>
        <TermTable parsedTerms={parsedTerms} />
      </table>
    </div>
  );
};

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
