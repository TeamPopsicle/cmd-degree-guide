import { getLocalStorage } from '@/lib/LocalStorage';
import React, { useState, useEffect } from 'react';

interface ScheduleProps {
  seasons: string[];
}

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

const Schedule: React.FC<ScheduleProps> = ({ seasons }) => {
  const [parsedTerms, setParsedTerms] = useState<Array<string[]>>([]);

  useEffect(() => {
    // Fetch and parse the terms data on the client side
    const terms = getLocalStorage("schedule");
    const parsedTerms = terms ? JSON.parse(terms) : [];
    setParsedTerms(parsedTerms);
  }, []);
  
  const containerStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    margin: '20px',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
  };

  const tableStyle: React.CSSProperties = {
    borderCollapse: 'collapse',
    width: '90%',
    border: '1px solid #333',
    backgroundColor: 'rgb(252, 252, 215)',
  };

  const cellStyle: React.CSSProperties = {
    border: '2px solid darkgreen',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    height: '100px', // Adjusted height for better visibility
    width: "33.33%",
  };

  const titleRowStyle: React.CSSProperties = {
    ...cellStyle,
    backgroundColor: 'rgb(87, 125, 65)',
    color: '#fbf4cf',
    fontSize: '20px',
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {seasons.map((season, index) => (
              <th key={index} style={titleRowStyle}>
                {season}
              </th>
            ))}
          </tr>
        </thead>
        <TermTable parsedTerms={parsedTerms} />
      </table>
    </div>
  );
};

const App: React.FC = () => {
  const seasons = ['Fall', 'Winter', 'Spring'];

  return (
    <div style={{ backgroundColor: '#fbf4cf', padding: '20px', textAlign: 'center', minHeight: '100vh', }}>
      <h1 style={{ color: 'darkgreen', marginTop: '10px', fontSize: '35px', borderBottom: '10px solid rgb(87, 125, 65)'}}>
        Your 4-year Degree Plan</h1>
        <a href="https://catalog.uoregon.edu/genedcourses/#text" target="_blank" rel="noopener noreferrer"
        style={{         
        color: 'darkgreen',
        textDecoration: 'underline',
        fontStyle: 'italic',
        display: 'inline-block',
        margin: '10px', }}>
          Explore general education courses
        </a>
        <a href="https://catalog.uoregon.edu/courses/" target="_blank" rel="noopener noreferrer"
        style={{         
        color: 'darkgreen',
        textDecoration: 'underline',
        fontStyle: 'italic',
        display: 'inline-block',
        margin: '10px', }}>
          All courses
        </a>
        <a href="https://catalog.uoregon.edu/admissiontograduation/bachelorrequirements/" target="_blank" rel="noopener noreferrer"
        style={{         
        color: 'darkgreen',
        textDecoration: 'underline',
        fontStyle: 'italic',
        display: 'inline-block',
        margin: '10px', }}>
          Bachelor requirements
        </a>
        <a href="https://advising.uoregon.edu/" target="_blank" rel="noopener noreferrer"
        style={{         
        color: 'darkgreen',
        textDecoration: 'underline',
        fontStyle: 'italic',
        display: 'inline-block',
        margin: '10px', }}>
          Contact advisors
        </a>
        <a href="https://www.uoregon.edu/" target="_blank" rel="noopener noreferrer"
        style={{         
        color: 'darkgreen',
        textDecoration: 'underline',
        fontStyle: 'italic',
        display: 'inline-block',
        margin: '10px', }}>
          Others
        </a>
      <Schedule seasons={seasons} />
    </div>
  );
};

export default App;
