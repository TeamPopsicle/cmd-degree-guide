import { runGenAlg } from "@/lib/GenAlg";
import { getLocalStorage, saveToLocalStorage } from "@/lib/LocalStorage";
import { sendQuery } from "@/lib/dbclient";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/input.module.css";

function ClassesTakenTable({ major, coursesTaken, setCoursesTaken }:
    {
        major: string
        coursesTaken: string[]
        setCoursesTaken: React.Dispatch<React.SetStateAction<string[]>>
    }
) {
    const [classesInMajor, setClassesInMajor] = useState<{ FullClassName: string, ClassNumber: string }[]>([]);
    useEffect(() => {
        async function fetchClasses() {
            try {
                const classesContent = "SELECT `FullClassName`, `ClassNumber` FROM `Classes` WHERE Major = ?";
                const classesResponseObject = await sendQuery(classesContent, major);
                console.log(classesResponseObject.response)
                setClassesInMajor(classesResponseObject.response);
            } catch (error) {
                console.log("An error occured while fetching class data.");
            }
        }
        fetchClasses();
    }, [major]);

    function handleCheckboxChange(classNumber: string) {
        // Update the state to reflect the checkbox state
        if (coursesTaken.includes(classNumber)) {
            setCoursesTaken(coursesTaken.filter((takenClass) => takenClass !== classNumber));
        } else {
            setCoursesTaken([...coursesTaken, classNumber]);
        }
    };

    return (
        <div className={styles['classes-taken-container']}>
            <table className={styles['classes-taken-table']}>
                <thead>
                    <tr>
                        <th className={styles['classes-taken-th']}>Taken/Not Taken</th>
                        <th className={styles['classes-taken-th']}>Courses</th>
                    </tr>
                </thead>
                <tbody>
                    {classesInMajor.map((classData, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="checkbox"
                                    onChange={() => {
                                        handleCheckboxChange(classData.ClassNumber);
                                    }}
                                    checked={coursesTaken.includes(classData.ClassNumber)}
                                />
                            </td>
                            <td className={styles['classes-taken-td']}>{classData.FullClassName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default function UserInput() {
    const [termsLeft, setTermsLeft] = useState(0);
    const [coursesTaken, setCoursesTaken] = useState<string[]>([]);
    const router = useRouter();
    const [major, setMajor] = useState("");
    const [showClassesTable, setShowClassesTable] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

    // TODO: Check to make sure user is logged in, redirect back to login if not on open.
    // Proposal: Use useEffect()

    async function handleSubmit() {
        // Calculate algorithm here, then save the result of the algorithm to localStorage
        // TODO: Add error checking, e.g don't redirect and show error message if runGenAlg fails
        if (major !== "") {
            const schedule = runGenAlg(termsLeft, coursesTaken.join(" "), major);
            saveToLocalStorage("schedule", schedule);
            const username = getLocalStorage("loggedInUser");
            const scheduleContent = "UPDATE `Users` SET `schedule` = ? WHERE (`username` = ?);";
            const scheduleResponseObject = await sendQuery(scheduleContent, schedule, username);
            if (scheduleResponseObject) {
                router.push("/finalSchedule")
            }
        } else {
            setWarningMessage("Please choose a major before submitting.");
        }
    }

    function handleMajorChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setShowClassesTable(e.target.value !== '');
        setMajor(e.target.value);
        setCoursesTaken([]);
    }

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                handleSubmit();
            }}
            className={styles['form-container']}
        >
            <label className={styles['input-label']}>
                How many terms do you have until expected graduation? (max 12)
                <br />
                <input
                    type="number"
                    onChange={e => {
                        const inputValue = e.target.value;
                        setTermsLeft(inputValue === '' ? 0 : Number(inputValue));
                    }}
                    required
                    className={styles['input-field']}
                />
            </label>

            <label className={styles['input-label']}>
                What is your major?
                <br />
                <select
                    value={major}
                    onChange={handleMajorChange}
                    className={styles['select-field']}
                >
                    <option value="" disabled>--Choose a Major--</option>
                    <option value={"CS"}>Computer Science</option>
                    <option value={"DS"}>Data Science</option>
                    <option value={"MA"}>Math</option>
                </select>
                <br />
            </label>

            {showClassesTable && <ClassesTakenTable major={major} coursesTaken={coursesTaken} setCoursesTaken={setCoursesTaken} />}

            <Link
                href="https://catalog.uoregon.edu/arts-sciences/natural-sciences/computer-sci/ug-computer-science/#requirementstext"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['custom-link']}
            >
                Computer Science Requirements
            </Link>
            <Link
                href="https://catalog.uoregon.edu/arts-sciences/natural-sciences/data-sci/#requirementstext"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['custom-link']}
            >
                Data Science Requirements
            </Link>
            <Link
                href="https://catalog.uoregon.edu/arts-sciences/natural-sciences/mathematics/ug-mathematics/#requirementstext" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles['custom-link']}
            >
                Math Requirements
            </Link>
            <button type="submit" className={styles['submit-button']}>Submit</button>

            {warningMessage && <p className="text-red-500">{warningMessage}</p>}
        </form>
    );
}