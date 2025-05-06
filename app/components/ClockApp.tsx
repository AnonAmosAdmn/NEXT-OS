'use client';
import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd'; // Import Rnd from react-rnd

export default function ClockApp() {
  const [currentTime, setCurrentTime] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const [tempAlarm, setTempAlarm] = useState('');
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      setCurrentTime(formattedTime);

      if (alarmTime === formattedTime && !alarmTriggered) {
        setAlarmTriggered(true);
        alert('⏰ Alarm ringing!');
        const audio = new Audio('/alarm.mp3');
        audio.play();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarmTime, alarmTriggered]);

  return (
    <div className="relative w-full h-screen"> {/* Ensure parent div has full width */}
      <Rnd
        default={{
          x: 50, // Initial horizontal position
          y: 50, // Initial vertical position
          width: 400, // Initial width
          height: 350, // Initial height
        }}
        minWidth={300} // Minimum width
        minHeight={200} // Minimum height
      >
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-6 text-black">🕒 Digital Alarm Clock</h1>

          {/* Current Time Display */}
          <div className="text-6xl font-mono text-black mb-6">
            {currentTime || '--:--'}
          </div>

          {/* Alarm Setter */}
          <div className="bg-indigo-600 rounded-xl p-4 shadow-inner">
            <h2 className="text-lg font-semibold text-black mb-2">Set Alarm</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <input
                type="time"
                value={tempAlarm}
                onChange={(e) => setTempAlarm(e.target.value)}
                className="px-4 py-2 border border-indigo-500 rounded-md text-black shadow-sm focus:ring-indigo-300 focus:border-indigo-300 w-full sm:w-auto"
              />
              <button
                onClick={() => {
                  setAlarmTime(tempAlarm);
                  setAlarmTriggered(false);
                }}
                className="bg-white text-indigo-700 px-6 py-2 rounded-md shadow hover:bg-gray-200 transition"
              >
                Set Alarm
              </button>
            </div>
            {alarmTime && (
              <p className="text-sm text-white mt-3">
                Alarm set for: <span className="font-semibold">{alarmTime}</span>
              </p>
            )}
          </div>
        </div>
      </Rnd>
    </div>
  );
}
