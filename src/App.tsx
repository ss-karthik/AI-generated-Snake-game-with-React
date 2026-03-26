import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00FFFF] font-vt overflow-hidden relative flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 static-noise z-0"></div>
      <div className="absolute inset-0 scanlines z-10 pointer-events-none"></div>

      <div className="z-20 w-full max-w-6xl flex flex-col xl:flex-row items-center justify-center gap-8">
        <div className="flex-1 w-full flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-pixel text-[#FF00FF] mb-6 glitch-text uppercase text-center" data-text="SYS.SNAKE_PROTOCOL">
            SYS.SNAKE_PROTOCOL
          </h1>
          <SnakeGame />
        </div>
        <div className="w-full xl:w-96 flex flex-col items-center shrink-0">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}
