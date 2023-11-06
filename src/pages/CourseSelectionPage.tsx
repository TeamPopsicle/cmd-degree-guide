import React, { useState } from 'react';
import courses from '@/components/CourseSelectionPage.module.css';

function CourseSelectionPage() {
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  
  const handleButtonClick = (buttonIndex: number) => {
    setSelectedButton(buttonIndex);
  };

  return (
    <div className={courses.body}>
    <div className= {courses.buttonContainer}>
      <div className={courses.button}>
        <div className= {courses.button1}>
        <button
          className={`button button1 ${selectedButton === 1 ? 'active' : ''}`}
          onClick={() => handleButtonClick(1)}
        >
          Computer Science
        </button>
        </div>
      </div>
      <div className={courses.button}>
      <div className= {courses.button2}>
        <button
          className={`button button2 ${selectedButton === 2 ? 'active' : ''}`}
          onClick={() => handleButtonClick(2)}
        >
          Math
        </button>
      </div>
      </div>
      <div className={courses.button}>
      <div className= {courses.button3}>
        <button
          className={`button button3 ${selectedButton === 3 ? 'active' : ''}`}
          onClick={() => handleButtonClick(3)}
        >
          Data Science
        </button>
      </div>
      </div>
      </div>
      <div className={`${courses.tableContainer} ${selectedButton ? 'active' : ''}`}>
        <table className={courses.table}>
          <tr>
            <th className={courses.th}>Fall</th>
            <th className={courses.th}>Winter</th>
            <th className={courses.th}>Spring</th>
            <th className={courses.th}>Summer</th>
          </tr>
        
          <tr>
            <td className={courses.td}>Data 1</td>
            <td className={courses.td}>Data 2</td>
            <td className={courses.td}>Data 3</td>
            <td className={courses.td}>Data 4</td>
          </tr>
          <tr>
            <td className={courses.td}>Data 5</td>
            <td className={courses.td}>Data 6</td>
            <td className={courses.td}>Data 7</td>
            <td className={courses.td}>Data 8</td>
          </tr>
          <tr>
            <td className={courses.td}>Data 9</td>
            <td className={courses.td}>Data 10</td>
            <td className={courses.td}>Data 11</td>
            <td className={courses.td}>Data 12</td>
          </tr>
          <tr>
            <td className={courses.td}>Data 13</td>
            <td className={courses.td}>Data 14</td>
            <td className={courses.td}>Data 15</td>
            <td className={courses.td}>Data 16</td>
          </tr>
        </table>
      </div>
    </div>
 
  );
}

export default CourseSelectionPage;
