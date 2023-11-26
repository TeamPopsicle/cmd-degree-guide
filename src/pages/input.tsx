import { runGenAlg } from "@/lib/GenAlg";
import { getLocalStorage, saveToLocalStorage } from "@/lib/LocalStorage";
import { sendQuery } from "@/lib/dbclient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function ClassesTakenTable({ major, coursesTaken, setCoursesTaken }:
    {
        major: string
        coursesTaken: string[]
        setCoursesTaken: React.Dispatch<React.SetStateAction<string[]>>
    }
){
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
        <div style={{ backgroundColor: '#fbf4cf', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: '500px', overflowY: 'auto' }}>
            <table>
                <thead>
                    <tr>
                        <th style={{ color: 'darkgreen', fontWeight: 'bold' }}>Taken/Not Taken</th>
                        <th style={{ color: 'darkgreen', fontWeight: 'bold' }}>Courses</th>
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
                            <td style={{ color: 'darkgreen' }}>{classData.FullClassName}</td>
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
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "#fbf4cf", // Set the background color for the entire webpage
                padding: "20px", // Add some padding to the form
                position: "relative", // Position relative for absolute positioning of the image
                borderRadius: "15px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
        >
            <label style={{ marginBottom: "10px", color: "darkgreen", textAlign: "center", fontSize: "26px" }}>
                How many terms do you have until expected graduation? (max 12)
                <br />
                <input
                    type="number"
                    onChange={e => {
                        const inputValue = e.target.value;
                        setTermsLeft(inputValue === '' ? 0 : Number(inputValue));
                    }}
                    required
                    style={{
                        border: "2px solid darkgreen", // Set green color outline for the input box
                        borderRadius: "10px", // Add some border radius for a rounded look
                        padding: "8px", // Add padding for better visual appeal
                        marginTop: "5px", // Add margin to separate from the label
                        fontSize: "20px",
                    }}
                />
            </label>

            <label style={{ color: "darkgreen", textAlign: "center", fontSize: "26px" }}>
                What is your major?
                <br />
                <select
                    value={major}
                    onChange={handleMajorChange}
                    style={{
                        border: "2px solid darkgreen", // Set the same color as the text
                        borderRadius: "10px",
                        padding: "8px",
                        marginTop: "5px", // Add margin to separate from the label
                        fontSize: "20px",
                    }}
                >
                    <option value="" disabled>--Choose a Major--</option>
                    <option value={"CS"}>Computer Science</option>
                    <option value={"DS"}>Data Science</option>
                    <option value={"MA"}>Math</option>
                </select>
                <br />
            </label>

            {showClassesTable && <ClassesTakenTable major={major} coursesTaken={coursesTaken} setCoursesTaken={setCoursesTaken} />}

            <button type="submit"
                style={{
                    backgroundColor: "darkgreen",
                    color: "#fbf4cf",
                    padding: "12px 24px",
                    fontSize: "20px",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    marginTop: "15px",
                    transition: "background-color 0.3s", // Add transition effect on hover
                }}
                onMouseOver={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = "green"; // Change background color on hover
                }}
                onMouseOut={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = "darkgreen"; // Revert back to the original color on mouse out
                }}
            >Submit</button>
            {warningMessage && <p className="text-red-500">{warningMessage}</p>}
        </form>
    );
}