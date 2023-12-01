/*
    i. a statement of what it represents or implements,
    ii. the group name,
    iii. the names of all authors (alphabetically by last name),
    iv. the product’s author information should be clear, i.e., what each
        component is or implements, who created or last updated it, and
        when.
*/

import { sendQuery } from "@/lib/dbclient";
import { useState } from "react";

export default function DBTesting() {
    const [classListShown, setClassListShown] = useState(false);
    const [classes, setClasses] = useState<{ Major: string; ClassNumber: string; PrereqFor: string }[]>([]);

    async function handleInsertQuery() {
        const queryContent = "INSERT INTO Classes (Major, ClassNumber, PrereqFor) VALUES ('CS', '210', 'CS 211')";
        const responseObject = await sendQuery(queryContent);
        console.log('Response:', responseObject);
    }

    async function handleSelectQuery() {
        const queryContent = "SELECT * FROM Classes WHERE Major = 'CS'";
        const responseObject = await sendQuery(queryContent);
        // Put whatever code to handle it below this, the first two lines and import above are all that's necessary
        console.log('Response:', responseObject);
        setClasses(responseObject.response); // Set the classes in state
        console.log(classes);
        setClassListShown(true);
        const dagQuery = await sendQuery("SELECT ClassNumber, PrereqFor FROM Classes WHERE Major = 'CS'");
        const dag: { ClassNumber: string; PrereqFor: string[]; }[] = dagQuery.response.map((item: { ClassNumber: string; PrereqFor: string; }) => ({
            ClassNumber: item.ClassNumber,
            PrereqFor: JSON.parse(item.PrereqFor)
        }));
        console.log(dag);
        const dagObject: Record<string, string[]> = dag.reduce((acc: any, item) => {
            acc[item.ClassNumber] = item.PrereqFor;
            return acc;
        }, {});

        console.log(dagObject);
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
                            <br />
                            <strong>Major:</strong> {classItem.Major}<br />
                            <strong>Class Number:</strong> {classItem.ClassNumber}<br />
                            <strong>Prerequisite For:</strong> {JSON.parse(classItem.PrereqFor).join(', ')}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
