import { runGenAlg } from "@/lib/GenAlg";
import { saveToLocalStorage } from "@/lib/LocalStorage";
import { useRouter } from "next/router";
import { useState } from "react";

export default function UserInput() {
    const [termsLeft, setTermsLeft] = useState(0);
    const [coursesTaken, setCoursesTaken] = useState("");
    const router = useRouter();

    // TODO: Check to make sure user is logged in, redirect back to login if not on open.
    // Proposal: Use useEffect()

    function handleSubmit() {
        // Calculate algorithm here, then save the result of the algorithm to localStorage
        // TODO: Also save to User Database
        // TODO: Add error checking, e.g don't redirect and show error message if runGenAlg fails
        saveToLocalStorage("schedule", runGenAlg(termsLeft, coursesTaken));
        router.push("/CourseSelectionPage");
    }

    return (
        <form
        onSubmit={e => {
            e.preventDefault();
            handleSubmit();
        }}
        >
            <label>
                How many terms do you have until expected graduation?
                <input
                    type="number"
                    onChange={e => {
                        const inputValue = e.target.value;
                        setTermsLeft(inputValue === '' ? 0 : Number(inputValue));
                    }}
                    required
                />
            </label>

            <label>
                Enter courses taken, each separated by space
                <input
                    type="text"
                    value={coursesTaken}
                    onChange={e => setCoursesTaken(e.target.value)}
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}
