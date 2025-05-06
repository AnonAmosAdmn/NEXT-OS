'use client';

import { useState } from 'react';
import { Rnd } from 'react-rnd'; // Import Rnd from react-rnd

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getDaysArray = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const daysArray = Array(firstDay).fill(null); // Empty slots for days before the 1st
    for (let i = 1; i <= days; i++) {
      daysArray.push(i);
    }
    return daysArray;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="relative w-full h-screen"> {/* Ensure parent div has full width */}
      <Rnd
        default={{
          x: 50, // Initial horizontal position
          y: 50, // Initial vertical position
          width: 400, // Initial width
          height: 400, // Initial height
        }}
        minWidth={300} // Minimum width
        minHeight={300} // Minimum height
      >
        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">📅 Calendar</h1>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonth}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition"
            >
              Prev
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={handleNextMonth}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition"
            >
              Next
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="font-bold text-gray-600">
                {day}
              </div>
            ))}
            {getDaysArray().map((day, index) => (
              <div
                key={index}
                className={`p-2 text-center rounded ${
                  day ? 'bg-indigo-100 text-gray-800' : ''
                }`}
              >
                {day || ''}
              </div>
            ))}
          </div>
        </div>
      </Rnd>
    </div>
  );
}
