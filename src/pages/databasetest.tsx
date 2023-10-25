import { sendQuery } from "@/lib/dbclient";
import { useState } from "react";

export default function DBTesting() {
    const [classListShown, setClassListShown] = useState(false);
    const [classes, setClasses] = useState<{ Major: string; ClassNumber: string; Prereqs: string }[]>([]);

    async function handleInsertQuery() {
        const queryContent = "INSERT INTO Classes (Major, ClassNumber, Prereqs) VALUES ('CS', '422', 'CS 315')";
        const responseObject = await sendQuery(queryContent);
        console.log('Response:', responseObject);
    }

    async function handleSelectQuery() {
        const queryContent = "SELECT * FROM Classes";
        const responseObject = await sendQuery(queryContent);
        // Put whatever code to handle it below this, the first two lines and import above are all that's necessary
        console.log('Response:', responseObject);
        setClasses(responseObject.response); // Set the classes in state
        console.log(classes);
        setClassListShown(true);
    }

    return (
        <>
            <h1>Database query testing</h1>
            <button onClick={handleInsertQuery} className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded p-1">INSERT INTO query</button>
            <br />
            <button onClick={handleSelectQuery} className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded p-1">SELECT query</button>
            {classListShown && (
                <ul>
                    {classes.map((classItem, index) => (
                        <li key={index}>
                            <strong>Major:</strong> {classItem.Major}<br />
                            <strong>Class Number:</strong> {classItem.ClassNumber}<br />
                            <strong>Prerequisites:</strong> {classItem.Prereqs}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
