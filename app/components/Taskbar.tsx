'use client';

import { useState, useEffect } from 'react';
import StartMenu from './StartMenu';

export default function Taskbar() {
  const [time, setTime] = useState('');
  const [showStart, setShowStart] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Taskbar */}
      <div className="fixed bottom-0 w-full bg-gray-900 text-white h-12 flex items-center justify-between px-2 z-50">
        {/* Start Button */}
        <div
          onClick={() => setShowStart(!showStart)}
          className="cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
        >
          Apps
        </div>

        {/* Clock */}
        <div
          className="text-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md cursor-pointer"
        >
          {time}
        </div>
      </div>

      {/* Start Menu */}
      {showStart && (
        <div className="fixed bottom-12 left-2 z-40">
          <StartMenu />
        </div>
      )}

    </>
  );
}