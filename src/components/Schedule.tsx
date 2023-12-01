/*
    i. Schedule component used in /finalSchedule
    ii. Popsicle
    iii. Ethan Cha, Peyton Elebash, Haley Figone, Yaya Yao
*/

import { sendQuery } from "@/lib/dbclient";
import { useEffect, useState } from "react";
import styles from '@/styles/finalSchedule.module.css';
import React from "react";

interface ScheduleProps {
    seasons: string[];
    loggedInUser: string; // State passed as a prop
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>; // State setter passed as a prop
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
                 * Sets up the structure of a 3D array for all 4 years
                 * Starts by creating a sliced array from parsed terms containing 1 year (3 terms)
                 * This repeats 4 times, 1 for each year
                 * Each iteration returns a year as a row, aka a <tr>
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

export default function Schedule({ seasons, loggedInUser, setErrorMessage }: ScheduleProps) {
    const [parsedTerms, setParsedTerms] = useState<Array<string[]>>([]);

    useEffect(() => {
        // Fetch and parse the terms data on the client side
        async function fetchSchedule() {
            if (loggedInUser) {
                const termsContent = "SELECT `schedule` FROM `Users` WHERE username = ?";
                const termsObject = await sendQuery(termsContent, loggedInUser);
                if (!termsObject.response.error) {
                    console.log("terms", termsObject.response);
                    const terms = termsObject.response[0].schedule; // Get schedule from SQL response
                    const parsedTerms = terms ? JSON.parse(terms) : []; // Parse the string as JSON, turning it back into a 2D array
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