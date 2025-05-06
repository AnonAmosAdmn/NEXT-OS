'use client';

import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Desktop />
      <Taskbar />
    </div>
  );
}
