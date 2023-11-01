import React from 'react';
import {useState} from "react";
import './CourseSelectionPage.module.css'; 
import { stringify } from 'querystring';

function CourseSelectionPage() {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  const buttonClick = (button: string) => {
    setSelectedButton(button);
  }



  return (
    <div className="body">
      <div className="button-container">
      <button
          className={`button button-1 ${selectedButton === 'button-1' ? 'selected' : ''}`}
          onClick={() => buttonClick('button-1')}
        >
          Computer Science
        </button>
        <button
          className={`button button-2 ${selectedButton === 'button-2' ? 'selected' : ''}`}
          onClick={() => buttonClick('button-2')}
        >
          Math
        </button>
        <button
          className={`button button-3 ${selectedButton === 'button-3' ? 'selected' : ''}`}
          onClick={() => buttonClick('button-3')}
        >
          Data Science
        </button>
      </div>
      <div className="table-container">
        <table>
          <tr>
            <th>Fall</th>
            <th>Winter</th>
            <th>Spring</th>
            <th>Summer</th>
          </tr>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
            <td>Data 3</td>
            <td>Data 4</td>
          </tr>
          <tr>
            <td>Data 5</td>
            <td>Data 6</td>
            <td>Data 7</td>
            <td>Data 8</td>
          </tr>
          <tr>
            <td>Data 9</td>
            <td>Data 10</td>
            <td>Data 11</td>
            <td>Data 12</td>
          </tr>
          <tr>
            <td>Data 13</td>
            <td>Data 14</td>
            <td>Data 15</td>
            <td>Data 16</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default CourseSelectionPage;
