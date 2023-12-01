/*
    i. User sets parameters for the generative algorithm for their schedule
    ii. Popsicle
    iii. Ethan Cha, Peyton Elebash, Haley Figone, Yaya Yao
*/

// Importing necessary modules and components
import { runGenAlg } from "@/lib/GenAlg";
import { getLocalStorage } from "@/lib/LocalStorage";
import { sendQuery } from "@/lib/dbclient";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/input.module.css";

/**
 * JSX component for the table/checklist of classes in their major,
 * where the user can select which classes they have already taken
 * The parameters are states and state setters passed as props to this component,
 * They will act like pointers to the original state variables in a sense
 */
function ClassesTakenTable({ major, coursesTaken, setCoursesTaken, setWarningMessage }:
    {
        major: string
        coursesTaken: string[]
        setCoursesTaken: React.Dispatch<React.SetStateAction<string[]>>
        setWarningMessage: React.Dispatch<React.SetStateAction<string>>
    }
) {
    const [classesInMajor, setClassesInMajor] = useState<{ FullClassName: string, ClassNumber: string }[]>([]);
    // Any time the user sets their major, update the classesInMajor array
    useEffect(() => {
        async function fetchClasses() {
            const classesContent = "SELECT `FullClassName`, `ClassNumber` FROM `Classes` WHERE Major = ?";
            const classesResponseObject = await sendQuery(classesContent, major);
            if (!classesResponseObject.response.error) {
                console.log(classesResponseObject.response)
                setClassesInMajor(classesResponseObject.response);
            } else {
                console.error(classesResponseObject.response.error);
                setWarningMessage("Unexpected internal error, see console and report the issue by contacting us.");
            }
        }
        fetchClasses();
    }, [major, setWarningMessage]);

 /**
   * Handles checkbox change for each class.
   * Updates the state to reflect the checkbox state and adds or removes it from coursesTaken array.
   * @param classNumber - ClassNumber of the selected class
   */
    function handleCheckboxChange(classNumber: string) {
        // Update the state to reflect the checkbox state, then adds or removes it to coursesTaken array
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
                    {/* Maps classesInMajor array as a table checklist, 
                    showing the user the FullClassName column in database and each checkbox
                    corresponding to the appropriate ClassNumber in database */}
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
    const loggedInUser = getLocalStorage("loggedInUser");
    const [termsLeft, setTermsLeft] = useState(0);
    const [coursesTaken, setCoursesTaken] = useState<string[]>([]);
    const router = useRouter();
    const [major, setMajor] = useState("");
    const [showClassesTable, setShowClassesTable] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

    // Check on visit if user is logged in first, redirect to login if not
    useEffect(() => {
        if (loggedInUser === "") {
            router.push("/login");
        }
    }, [loggedInUser, router]);

    async function handleSubmit() {
        // Calculate algorithm here, then save the result of the algorithm to database as string
        if (major !== "") {
            const schedule = await runGenAlg(termsLeft, coursesTaken.join(" "), major);
            if (schedule !== "") {
                const scheduleContent = "UPDATE `Users` SET `schedule` = ? WHERE (`username` = ?);";
                const scheduleResponseObject = await sendQuery(scheduleContent, schedule, loggedInUser);
                if (scheduleResponseObject) {
                    router.push("/finalSchedule")
                }
            } else {
                setWarningMessage("You cannot graduate in that number of terms. Please see an advisor for further help.")
            }
        } else {
            setWarningMessage("Please choose a major before submitting.");
        }
    }

    function handleMajorChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setShowClassesTable(e.target.value !== '');
        setMajor(e.target.value);
        setCoursesTaken([]); // Clears courses taken array to avoid stray classes, i.e if the user checks a class, then changes majors
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
                    min={0}
                    max={12}
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
                    <option value={"MA"}>Math</option>
                    <option value={"DS"}>Data Science</option>
                </select>
                <br />
            </label>

            {showClassesTable && <ClassesTakenTable major={major} coursesTaken={coursesTaken} setCoursesTaken={setCoursesTaken} setWarningMessage={setWarningMessage} />}

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