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
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#fbf4cf", // Set the background color for the entire webpage
            padding: "20px", // Add some padding to the form
        }}
        >
            <label style={{ marginBottom: "10px", color: "darkgreen", textAlign: "center", fontSize: "26px" }}>
                How many terms do you have until expected graduation?
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
                        
                    }}
                />
            </label>

            <label style={{ marginBottom: "10px", color: "darkgreen", textAlign: "center", fontSize: "26px" }}>
                Enter courses taken, each separated by space:
                <br />
                <input
                    type="text"
                    value={coursesTaken}
                    onChange={e => setCoursesTaken(e.target.value)}
                     style={{
                        border: "2px solid darkgreen", // Set the same color as the text
                        borderRadius: "10px",
                        padding: "8px",
                        marginTop: "5px", // Add margin to separate from the label
                    }}
                />
            </label>
            <button type="submit"
             style={{
                backgroundColor: "darkgreen",
                color: "#fbf4cf",
                padding: "10px 20px",
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
        </form>
    );
}
