import { runGenAlg } from "@/lib/GenAlg";
import { saveToLocalStorage } from "@/lib/LocalStorage";
import { useRouter } from "next/router";
import { useState } from "react";

export default function UserInput() {
    const [termsLeft, setTermsLeft] = useState(0);
    const [coursesTaken, setCoursesTaken] = useState("");
    const router = useRouter();

    function handleSubmit() {
        // Calculate algorithm here, then save the result of the algorithm to localStorage
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
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}
