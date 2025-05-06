import { useState } from 'react';
import Calendar from './Calendar';
import ClockApp from './ClockApp';
import ShellEmulator from './Shell';
import Calculator from './Calculator';
import PaintCanvas from './Paint';
import Snake from './Snake';
import React from 'react';

export default function StartMenu() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [showShell, setShowShell] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPaint, setShowPaint] = useState(false);
  const [showSnake, setShowSnake] = useState(false);

  return (
    <div className="w-64 max-h-250 bg-white text-black rounded-md shadow-lg p-4 overflow-y-auto">
      <ul className="space-y-2">

        {/* Calendar Menu Item */}
        <li
          onClick={() => {
            setShowCalendar(!showCalendar);
          }}
          className="hover:bg-indigo-700 hover:text-white p-2 rounded cursor-pointer"
        >
          Calendar
        </li>

        {/* Clock Menu Item */}
        <li
          onClick={() => {
            setShowClock(!showClock);
          }}
          className="hover:bg-indigo-700 hover:text-white p-2 rounded cursor-pointer"
        >
          Clock
        </li>

        {/* Calculator Menu Item */}
        <li
          onClick={() => {
            setShowCalculator(!showCalculator);
          }}
          className="hover:bg-indigo-700 hover:text-white p-2 rounded cursor-pointer"
        >
          Calculator
        </li>

        {/* Paint Menu Item */}
        <li
          onClick={() => {
            setShowPaint(!showPaint);
          }}
          className="hover:bg-indigo-700 hover:text-white p-2 rounded cursor-pointer"
        >
          Paint
        </li>

        {/* Snake Menu Item */}
        <li
          onClick={() => {
            setShowSnake(!showSnake);
          }}
          className="hover:bg-indigo-700 hover:text-white p-2 rounded cursor-pointer"
        >
          Snake
        </li>

        {/* Shell Menu Item */}
        <li
          onClick={() => {
            setShowShell(!showShell);
          }}
          className="hover:bg-indigo-700 hover:text-white p-2 rounded cursor-pointer"
        >
          Shell
        </li>

        <li className="hover:bg-indigo-700 hover:text-white p-2 rounded cursor-pointer">Settings</li>
      </ul>

      {/* Render Calendar Component */}
      {showCalendar && (
        <div className="fixed top-16 left-16 z-50 bg-white shadow-lg rounded-md">
          <Calendar />
        </div>
      )}

      {/* Render ClockApp Component */}
      {showClock && (
        <div className="fixed top-16 left-16 z-50 bg-white shadow-lg rounded-md">
          <ClockApp />
        </div>
      )}

      {/* Render Calculator Component */}
      {showCalculator && (
        <div className="fixed top-16 left-16 z-50 bg-white shadow-lg rounded-md">
          <Calculator />
        </div>
      )}

      {/* Render PaintCanvas Component */}
      {showPaint && (
        <div className="fixed top-16 left-16 z-50 bg-white shadow-lg rounded-md">
          <PaintCanvas />
        </div>
      )}

      {/* Render SnakeComponent */}
      {showSnake && (
        <div className="fixed top-16 left-16 z-50 bg-black shadow-lg rounded-md">
          <Snake />
        </div>
      )}

      {/* Render Shell Emulator Component */}
      {showShell && (
        <div className="fixed top-16 left-16 z-50 bg-black shadow-lg rounded-md">
          <ShellEmulator />
        </div>
      )}

    </div>
  );
}
