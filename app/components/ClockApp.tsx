'use client';
import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';

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
    <div className="relative w-full h-screen">
      <Rnd
        default={{
          x: 100,
          y: 100,
          width: 420,
          height: 320,
        }}
        minWidth={320}
        minHeight={320}
        dragHandleClassName="drag-handle"
      >
        <div className="flex flex-col h-full bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Window Title Bar */}
          <div className="drag-handle flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 cursor-move">
            <span className="text-2x1 font-semibold">🕒 Clock </span>
            <span className="text-gray-400 text-xs"></span>
          </div>

          {/* Clock Content */}
          <div className="flex flex-col justify-between flex-grow p-6 space-y-6">
            <div className="text-center">
              <div className="text-5xl font-mono">{currentTime || '--:--'}</div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
              <h2 className="text-base font-semibold mb-3">Set Alarm</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <input
                  type="time"
                  value={tempAlarm}
                  onChange={(e) => setTempAlarm(e.target.value)}
                  className="px-3 py-2 text-black rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={() => {
                    setAlarmTime(tempAlarm);
                    setAlarmTriggered(false);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow transition"
                >
                  Set Alarm
                </button>
              </div>
              {alarmTime && (
                <p className="text-sm text-gray-300 mt-3">
                  Alarm set for: <span className="font-bold">{alarmTime}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  );
}
