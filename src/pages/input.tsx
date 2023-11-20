import { runGenAlg } from "@/lib/GenAlg";
import { saveToLocalStorage } from "@/lib/LocalStorage";
import { useRouter } from "next/router";
import { useState } from "react";

export default function UserInput() {
    const [termsLeft, setTermsLeft] = useState(0);
    const [coursesTaken, setCoursesTaken] = useState("");
    const router = useRouter();
    const [major, setMajor] = useState("");

    // TODO: Check to make sure user is logged in, redirect back to login if not on open.
    // Proposal: Use useEffect()
    // FIX ME: Need a different way to delimit the courses input by the user. Commas instead? 

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

            <label style={{color: "darkgreen", textAlign: "center", fontSize: "26px" }}>
                What is your major?
                <br />
                <input
                    type="text"
                    value={major}
                    onChange={e => setMajor(e.target.value)}
                     style={{
                        border: "2px solid darkgreen", // Set the same color as the text
                        borderRadius: "10px",
                        padding: "8px",
                        marginTop: "5px", // Add margin to separate from the label
                        fontSize: "20px",
                    }}
                />
                <br />
            </label>

            <label style={{color: "darkgreen", textAlign: "center", fontSize: "26px" }}>
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
                        fontSize: "20px",
                    }}
                />
                <br />
            </label>
            <label style= {{marginBottom: "60px", color: "darkgreen", textAlign: "center", fontSize: "20px" }}>
                    (e.g: 210 211 212)
                </label>
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
        </form>
    );
}
