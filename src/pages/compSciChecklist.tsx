import React, { useState } from 'react';
import { useRouter } from "next/router";

interface Item {
  id: number;
  description: string;
  checked: boolean;
}

const generateItems = (): Item[] => {
  const itemNames = [
    'math series 1',
    'math series 2',
    'math elective 1',
    'math elective 2',
    'science series 1',
    'science series 2',
    'CS210',
    'CS211',
    'CS212',
    'MATH231',
    'MATH232',
    'CS313',
    'CS314',
    'CS330',
    'CS315',
    'CS415',
    'CS422',
    'CS425',
    'CS Elective Above 300_1',
    'CS Elective Above 300_2',
    'CS Elective Above 410_1',
    'CS Elective Above 410_2',
    'CS Elective Above 410_3',
    'Scientific and Technical Writing/Business Communications',
  ];

  return itemNames.map((name, index) => ({
    id: index + 1,
    description: name,
    checked: false,
  }));
};

const initialItems: Item[] = generateItems();

function ChecklistTable() {
  const [data, setData] = useState(initialItems);
  const router = useRouter();

  function handleClick(id: number) {
    const newData = data.map((item) => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setData(newData);
  }

  function handleSubmit() {
    router.push('/compSciSchedule');
  }

  return (
    <div style={{ backgroundColor: '#fbf4cf', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div 
          style={{
          backgroundColor: 'rgb(250, 228, 117)',
          padding: '10px',
          borderRadius: '20px', // Border radius for top corners
          marginTop: '20px',
          marginBottom: '40px',
          width: '650px',
          height: '90px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid darkgreen',
        }}
      >
        <h1 style= {{ color: 'darkgreen', textAlign: 'center', marginBottom: '50px' }}>
          Computer Science Courses Checklist
        </h1>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ color: 'darkgreen', fontWeight: 'bold' }}>Courses</th>
            <th style={{ color: 'darkgreen', fontWeight: 'bold' }}>Taken/Not Taken</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td style={{ color: 'darkgreen' }}>{item.description}</td>
              <td
                onClick={() => handleClick(item.id)}
                style={{ color: 'darkgreen', cursor: 'pointer', width: '30px',}}
              >
                {item.checked ? '✅' : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="submit"
        onClick={handleSubmit}
        style={{
          backgroundColor: "darkgreen",
          color: "#fbf4cf",
          padding: "12px 24px",
          fontSize: "20px",
          border: "none",
          borderRadius: "20px",
          cursor: "pointer",
          marginTop: "35px",
          transition: "background-color 0.3s", // Add transition effect on hover
        }}
        onMouseOver={(e) => {
          (e.target as HTMLElement).style.backgroundColor = "green"; // Change background color on hover
        }}
        onMouseOut={(e) => {
          (e.target as HTMLElement).style.backgroundColor = "darkgreen"; // Revert back to the original color on mouse out
        }}
      >
        Submit
      </button>

    </div>
  );
}

export default ChecklistTable;
