import { useState } from "react";

export default function UserInput() {
    const [termsLeft, setTermsLeft] = useState(0);
    const [coursesTaken, setCoursesTaken] = useState("");

    function handleSubmit() {
        console.log("to next page!");
    }

    return (
        <form
        onSubmit={e => {
            e.preventDefault();
            console.log("to next page!");
        }}
        >
            <label>
                How many terms do you have until expected graduation?
                <input
                    type="number"
                    value={termsLeft}
                    onChange={e => setTermsLeft(Number(e.target.value))}
                    required
                />
            </label>

            <label>
                Enter courses taken, each separated by space
                <input
                    type="text"
                    value={coursesTaken}
                    onChange={e => setCoursesTaken(e.target.value)}
                    required
                />
            </label>
            <button onClick={handleSubmit}>Submit</button>
        </form>
    );
}
