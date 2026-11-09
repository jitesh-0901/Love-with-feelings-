import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Edit2, Calendar, MapPin, ZoomIn, ArrowRight } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import type { MemoryItem } from '../utils/types';

interface MemoryScrapbookProps {
  onNext: () => void;
  isReducedMotion: boolean;
}

const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'm1',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80',
    caption: 'Our Quiet Walks & Chats',
    date: 'A quiet evening',
    location: 'Un kooda nadandhadhu',
    rotationDeg: -2.5,
  },
  {
    id: 'm2',
    imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=700&q=80',
    caption: 'Your Beautiful Genuine Smile',
    date: 'That unforgettable day',
    location: 'Un siripu mattum podhum',
    rotationDeg: 2,
  },
  {
    id: 'm3',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
    caption: 'Sunset By The Shore',
    date: 'Golden hour moments',
    location: 'Amaithiyaana neram',
    rotationDeg: -1.5,
  },
  {
    id: 'm4',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80',
    caption: 'Starry Sky & Countless Talks',
    date: 'Late night laughter',
    location: 'Nee dhaan en bright star',
    rotationDeg: 2.5,
  },
];

export const MemoryScrapbook: React.FC<MemoryScrapbookProps> = ({ onNext, isReducedMotion: _isReducedMotion }) => {
  const [memories, setMemories] = useState<MemoryItem[]>(DEFAULT_MEMORIES);
  const [activePhoto, setActivePhoto] = useState<MemoryItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editLocation, setEditLocation] = useState<string>('');

  const handleStartEdit = (m: MemoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(m.id);
    setEditCaption(m.caption);
    setEditDate(m.date);
    setEditLocation(m.location);
    sound.playChime(660, 0.2);
  };

  const handleSaveEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemories((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              caption: editCaption || item.caption,
              date: editDate || item.date,
              location: editLocation || item.location,
            }
          : item
      )
    );
    setEditingId(null);
    sound.playChime(880, 0.3);
  };

  return (
    <div className="relative min-h-[88vh] flex flex-col items-center justify-center px-3 sm:px-4 py-6 max-w-lg mx-auto z-20">
      
      {/* Chapter header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <span className="text-[11px] font-cinzel tracking-[0.25em] text-velvetRose-600 uppercase bg-white px-3.5 py-1 rounded-full border border-rosePetal-300 shadow-sm font-bold">
          4 Moments Framed For Ovi Ma 📸
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-roseDark-950 mt-2">
          Memory Scrapbook
        </h2>
        <p className="text-xs text-roseDark-700 font-semibold mt-1">
          Tap any photo to enlarge and view our moments ♡
        </p>
      </motion.div>

      {/* 2x2 Polaroid Grid (Clean white frames with rose tape) */}
      <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 my-3">
        {memories.map((item) => {
          const isEditing = editingId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (!isEditing) {
                  sound.playChime(784, 0.2);
                  setActivePhoto(item);
                }
              }}
              style={{ transform: `rotate(${item.rotationDeg}deg)` }}
              className="rose-polaroid cursor-pointer group relative flex flex-col select-none"
            >
              {/* Cute Washi Tape Top Accent in Rose */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 rounded-sm bg-rosePetal-300/80 border-x border-rosePetal-400 opacity-90 pointer-events-none shadow-xs" />

              {/* Photo Area */}
              <div className="relative w-full aspect-square rounded overflow-hidden bg-rosePetal-100 mb-2 border border-rosePetal-200">
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 text-velvetRose-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <ZoomIn size={12} />
                </div>
              </div>

              {/* Caption & Date Details in Crisp High Contrast Text */}
              {isEditing ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col gap-1 text-left pt-1"
                >
                  <input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="Caption"
                    className="text-[11px] p-1 rounded bg-rosePetal-50 border border-rosePetal-300 text-roseDark-950 font-bold w-full"
                  />
                  <input
                    type="text"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    placeholder="Date"
                    className="text-[10px] p-1 rounded bg-rosePetal-50 border border-rosePetal-300 text-roseDark-800 w-full"
                  />
                  <div className="flex gap-1 mt-1">
                    <button
                      onClick={(e) => handleSaveEdit(item.id, e)}
                      className="px-2 py-0.5 rounded bg-velvetRose-600 text-white text-[10px] font-bold"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(null);
                      }}
                      className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-[10px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-left pt-0.5 flex flex-col justify-between flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-[11px] sm:text-xs font-serif font-black text-roseDark-950 leading-tight line-clamp-2">
                      {item.caption}
                    </p>
                    <button
                      onClick={(e) => handleStartEdit(item, e)}
                      title="Edit Caption / Date"
                      className="text-gray-400 hover:text-velvetRose-600 p-0.5"
                    >
                      <Edit2 size={11} />
                    </button>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[9px] sm:text-[10px] text-roseDark-700 font-sans font-medium">
                    <span className="flex items-center gap-0.5 truncate max-w-[80px]">
                      <Calendar size={10} className="text-velvetRose-500" />
                      <span>{item.date}</span>
                    </span>
                    <span className="flex items-center gap-0.5 truncate max-w-[80px]">
                      <MapPin size={10} className="text-velvetRose-500" />
                      <span>{item.location}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expandable Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-sm w-full mx-auto p-4 rounded-2xl relative shadow-2xl border-2 border-rosePetal-200"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center z-10 hover:bg-black"
              >
                <X size={15} />
              </button>

              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-rosePetal-50 border border-rosePetal-200">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-left px-1">
                <h3 className="text-base font-serif font-black text-roseDark-950 mb-1">
                  {activePhoto.caption}
                </h3>
                <div className="flex items-center gap-3 text-xs text-roseDark-700 mb-2 font-sans font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-velvetRose-600" />
                    <span>{activePhoto.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-velvetRose-600" />
                    <span>{activePhoto.location}</span>
                  </span>
                </div>
                <p className="text-xs text-velvetRose-700 font-serif italic border-t border-rosePetal-200 pt-2 flex items-center gap-1 font-bold">
                  <Heart size={12} className="fill-velvetRose-600 text-velvetRose-600" />
                  <span>&ldquo;A precious memory of us with Ovi ma...&rdquo;</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav to Chapter 8 (Summary) */}
      <div className="w-full flex justify-center mt-3">
        <button
          onClick={() => {
            sound.playChime(880, 0.4);
            onNext();
          }}
          className="w-full sm:w-auto px-7 py-3 rounded-full rose-btn-primary font-cinzel text-xs sm:text-sm tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
        >
          <span>CONTINUE TO FINAL MESSAGE</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
