import { useEffect, useState } from "react";
import courses from "@/styles/CourseSelectionPage.module.css";
import { getLocalStorage } from "@/lib/LocalStorage";
import React from "react";

function CourseSelectionPage() {
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [tableColor, setTableColor] = useState<string | string>('#ffffff');
  const [parsedTerms, setParsedTerms] = useState<Array<string[]>>([]);

  useEffect(() => {
    // Fetch and parse the terms data on the client side
    const terms = getLocalStorage("schedule");
    const parsedTerms = terms ? JSON.parse(terms) : [];
    setParsedTerms(parsedTerms);
  }, []);

  const handleButtonClick = (buttonIndex: number) => {
    let csColor = 'rgb(182, 207, 235)';
    let mathColor = 'rgb(215, 201, 242)';
    let dsColor = 'rgb(219, 186, 186)';

    if (buttonIndex === 1) setTableColor(csColor);
    if (buttonIndex === 2) setTableColor(mathColor);
    if (buttonIndex === 3) setTableColor(dsColor);

    setSelectedButton(buttonIndex);
  };

  function TermTable({ parsedTerms }: { parsedTerms: string[][] }) {
    // Ensure parsedTerms has at least 12 elements
    const filledParsedTerms: Array<string[]> = [
      ...parsedTerms,
      ...Array(12 - parsedTerms.length).fill([]),
    ];

    return (
      <tbody>
        {
          /**
           * Sets up the structure a 3D array for all 4 years
           * Starts by creating a sliced array from parsed terms containing 1 year (3 terms)
           * This repeats 4 times, 1 for each year
           * Each iteration returns the row for that year as a <tr>
           * The overall resulting array follows the structure of a 3D array, like Plan[year[term[class]]]
           */
          Array.from({ length: 4 }, (_, yearIndex) => {
            const slicedArray = filledParsedTerms.slice(
              yearIndex * 3,
              (yearIndex + 1) * 3
            );

            return (
              <tr key={yearIndex}>
                {slicedArray.map((term, termIndex) => (
                  <td key={termIndex}>
                    {term.map((className, index) => (
                      <React.Fragment key={index}>
                        <p>{className}</p>
                      </React.Fragment>
                    ))}
                  </td>
                ))}
              </tr>
            );
          })
        }
      </tbody>
    );
  }

  return (
    <div className={courses.body}>
      <div className={courses.buttonContainer}>
        <div className={courses.button}>
          <div className={courses.button1} onClick={() => handleButtonClick(1)}>
            <button
              className={`button button1 ${
                selectedButton === 1 ? "active" : ""
              }`}
            >
              Computer Science
            </button>
          </div>
        </div>
        <div className={courses.button}>
          <div className={courses.button2} onClick={() => handleButtonClick(2)}>
            <button
              className={`button button2 ${
                selectedButton === 2 ? "active" : ""
              }`}
            >
              Math
            </button>
          </div>
        </div>
        <div className={courses.button}>
          <div className={courses.button3} onClick={() => handleButtonClick(3)}>
            <button
              className={`button button3 ${
                selectedButton === 3 ? "active" : ""
              }`}
            >
              Data Science
            </button>
          </div>
        </div>
      </div>
      <div
        className={`${courses.tableContainer} ${
          selectedButton ? "active" : ""
        }`}
      >
        <table
          className={`${courses.table}`}
          style={{ backgroundColor: tableColor }}
        >
          <thead>
            <tr>
              <th className={courses.th}>Fall</th>
              <th className={courses.th}>Winter</th>
              <th className={courses.th}>Spring</th>
            </tr>
          </thead>
          <TermTable parsedTerms={parsedTerms} />
        </table>
      </div>
    </div>
  );
}

export default CourseSelectionPage;
