import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'DATA_STREAM_01', artist: 'AI_CORE_ALPHA', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'VOID_RESONANCE', artist: 'NEURAL_NET_V2', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'CORRUPTED_SECTOR', artist: 'GHOST_IN_MACHINE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const prevTrack = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  return (
    <div className="w-full border-2 border-[#FF00FF] bg-black p-4 font-vt text-[#00FFFF] shadow-[4px_4px_0px_#00FFFF] relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#FF00FF] animate-pulse"></div>
      
      <audio ref={audioRef} src={currentTrack.url} onEnded={nextTrack} preload="auto" />
      
      <div className="text-xs font-pixel text-[#FF00FF] mb-4 border-b border-[#00FFFF] pb-2 uppercase">
        AUDIO_SUBSYSTEM_v1.0
      </div>

      <div className="mb-6">
        <div className="text-2xl truncate glitch-text" data-text={currentTrack.title}>
          {currentTrack.title}
        </div>
        <div className="text-lg opacity-70">
          SRC: {currentTrack.artist}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 border-y border-[#FF00FF] py-2">
        <button onClick={prevTrack} className="hover:bg-[#00FFFF] hover:text-black px-2 py-1 transition-none border border-transparent hover:border-[#FF00FF]">
          [PREV]
        </button>
        <button onClick={togglePlay} className="hover:bg-[#FF00FF] hover:text-black px-4 py-1 font-pixel text-sm transition-none border border-[#00FFFF]">
          {isPlaying ? 'HALT' : 'EXEC'}
        </button>
        <button onClick={nextTrack} className="hover:bg-[#00FFFF] hover:text-black px-2 py-1 transition-none border border-transparent hover:border-[#FF00FF]">
          [NEXT]
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-pixel text-[#FF00FF]">AMP_LEVEL: {Math.round(volume * 100)}%</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full appearance-none bg-transparent border border-[#00FFFF] h-4 cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#FF00FF]
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#FF00FF] [&::-moz-range-thumb]:border-none"
        />
      </div>
      
      <div className="mt-4 text-xs opacity-50 flex justify-between">
        <span>STATUS: {isPlaying ? 'ACTIVE' : 'STANDBY'}</span>
        <span className="animate-pulse">_</span>
      </div>
    </div>
  );
}
