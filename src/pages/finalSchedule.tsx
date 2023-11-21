import React from 'react';

interface ScheduleProps {
  seasons: string[];
}

const Schedule: React.FC<ScheduleProps> = ({ seasons }) => {
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
        <tbody>
          {Array.from({ length: 4 }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: 3 }, (_, colIndex) => (
                <td key={colIndex} style={cellStyle}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const App: React.FC = () => {
  const seasons = ['Fall', 'Winter', 'Spring'];

  return (
    <div style={{ backgroundColor: '#fbf4cf', padding: '20px', textAlign: 'center', height: '100vh', }}>
      <h1 style={{ color: 'darkgreen', marginTop: '10px', fontSize: '35px', borderBottom: '10px solid rgb(87, 125, 65)'}}>
        Your 4-year Degree Plan</h1>
      <Schedule seasons={seasons} />
    </div>
  );
};

export default App;
