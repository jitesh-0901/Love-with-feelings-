import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, ChevronLeft, ChevronRight, Settings, Sparkles } from 'lucide-react';
import { STORY_CHAPTERS } from '../utils/types';
import { storyAudio } from '../utils/audioController';
import { sound } from '../utils/soundEffects';

interface StoryProgressNavProps {
  currentChapter: number;
  totalChapters: number;
  onSelectChapter: (id: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isReducedMotion: boolean;
  onToggleReducedMotion: () => void;
  onOpenSettings: () => void;
}

export const StoryProgressNav: React.FC<StoryProgressNavProps> = ({
  currentChapter,
  totalChapters,
  onSelectChapter,
  onNext,
  onPrev,
  isReducedMotion,
  onToggleReducedMotion,
  onOpenSettings,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = storyAudio.subscribe((time, playing) => {
      setCurrentTime(time);
      setIsPlaying(playing);
      setIsMuted(storyAudio.getIsMuted());
    });
    return unsubscribe;
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      storyAudio.pause();
    } else {
      storyAudio.play();
    }
  };

  const handleToggleMute = () => {
    storyAudio.toggleMute();
    setIsMuted(storyAudio.getIsMuted());
  };

  const formatTime = (secs: number) => {
    const clamped = Math.min(120, Math.floor(secs));
    const m = Math.floor(clamped / 60);
    const s = Math.floor(clamped % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentChapterInfo = STORY_CHAPTERS.find((c) => c.id === currentChapter) || STORY_CHAPTERS[0];
  const audioProgressPercent = Math.min(100, (currentTime / 120) * 100);

  // Opening page (Chapter 1) must be completely clean and cinematic without top nav clutter
  if (currentChapter === 1) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-2 py-2 sm:px-6 sm:py-3 pointer-events-auto">
      {/* Crisp White Capsule Header with Real Rose Accents */}
      <div className="max-w-4xl mx-auto rounded-full bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-5 sm:py-2 flex items-center justify-between shadow-md border-2 border-rosePetal-200">
        
        {/* Left: Brand "FOR OVI MA" & Chapter Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectChapter(1)}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-cinzel font-black text-roseDark-950 hover:text-velvetRose-600 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-velvetRose-600 animate-ping inline-block" />
            <span className="tracking-widest">FOR OVI MA 🌹</span>
          </button>

          <span className="text-rosePetal-300 text-xs hidden sm:inline">|</span>

          {/* Title tag in dark, clear contrast without "CH X" */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-roseDark-850 font-medium">
            <span className="truncate max-w-[150px] md:max-w-[200px] font-bold text-velvetRose-700 font-cinzel">
              {currentChapterInfo.title}
            </span>
          </div>
        </div>

        {/* Center: Chapter Dots */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {STORY_CHAPTERS.map((chap) => {
            const isActive = chap.id === currentChapter;
            const isCompleted = chap.id < currentChapter;

            return (
              <button
                key={chap.id}
                onClick={() => {
                  sound.playChime(600 + chap.id * 60, 0.25);
                  onSelectChapter(chap.id);
                }}
                title={`Chapter ${chap.id}: ${chap.title}`}
                className="p-1 group"
              >
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-6 sm:w-8 bg-gradient-to-r from-velvetRose-500 to-velvetRose-700 shadow-md'
                      : isCompleted
                      ? 'w-2.5 bg-rosePetal-400'
                      : 'w-2 bg-rosePetal-200 group-hover:bg-rosePetal-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right: Master Audio Timeline & Story Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Synchronized Play / Pause Story Audio Controller */}
          <button
            onClick={handleTogglePlay}
            title={isPlaying ? 'Pause Audio & Story' : 'Play Audio & Story'}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rosePetal-100 hover:bg-rosePetal-200 border border-rosePetal-300 text-roseDark-950 text-[11px] font-mono transition-all font-bold"
          >
            {isPlaying ? <Pause size={12} className="text-velvetRose-600" /> : <Play size={12} className="ml-0.5 text-velvetRose-600" />}
            <span className="hidden md:inline">{formatTime(currentTime)}</span>
            <span className="hidden lg:inline text-[9px] text-velvetRose-600">
              {currentTime < 60 ? 'Song 1' : currentTime < 120 ? 'Song 2' : 'Done'}
            </span>
          </button>

          {/* Previous Chapter */}
          <button
            onClick={onPrev}
            disabled={currentChapter <= 1}
            title="Previous Chapter"
            className="p-1 rounded-full hover:bg-rosePetal-100 text-roseDark-900 disabled:opacity-20 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Next Chapter */}
          <button
            onClick={onNext}
            disabled={currentChapter >= totalChapters}
            title="Next Chapter"
            className="p-1 rounded-full hover:bg-rosePetal-100 text-roseDark-900 disabled:opacity-20 transition-colors"
          >
            <ChevronRight size={16} />
          </button>

          <div className="w-[1px] h-3.5 bg-rosePetal-200 mx-0.5" />

          {/* Mute Toggle */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-1.5 rounded-full hover:bg-rosePetal-100 text-velvetRose-600 transition-colors"
          >
            {isMuted ? <VolumeX size={15} className="text-gray-400" /> : <Volume2 size={15} />}
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={onToggleReducedMotion}
            title={isReducedMotion ? 'Reduced Motion: ON' : 'Reduced Motion: OFF'}
            className={`p-1 rounded-full hover:bg-rosePetal-100 transition-colors hidden sm:block ${
              isReducedMotion ? 'text-velvetRose-600' : 'text-gray-400 hover:text-velvetRose-600'
            }`}
          >
            <Sparkles size={14} />
          </button>

          {/* Settings / Google Sheets modal trigger */}
          <button
            onClick={onOpenSettings}
            title="Google Sheets Settings"
            className="p-1 rounded-full hover:bg-rosePetal-100 text-roseDark-700 hover:text-velvetRose-600 transition-colors"
          >
            <Settings size={15} />
          </button>
        </div>
      </div>

      {/* Synchronized 2-minute Audio Timeline Bar at top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-rosePetal-200 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-velvetRose-500 via-rosePetal-500 to-velvetRose-700 transition-all duration-300 shadow-[0_0_8px_rgba(217,37,90,0.6)]"
          style={{ width: `${audioProgressPercent}%` }}
        />
      </div>
    </header>
  );
};
