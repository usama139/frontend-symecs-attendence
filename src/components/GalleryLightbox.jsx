import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

const GalleryLightbox = ({ item, isOpen, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !item) return null;

  const isVideo = item.src?.endsWith('.mp4') || item.type === 'video';

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-xl animate-modal"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-950/80 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              {item.category || 'SYMECS Institute'}
            </span>
            <h4 className="text-sm font-bold text-white mt-1">
              {item.title || 'Institute Campus Activity'}
            </h4>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Media Viewing Area */}
        <div className="relative flex items-center justify-center min-h-[300px] max-h-[70vh] bg-black">
          
          {/* Navigation Arrows */}
          <button
            onClick={onPrev}
            className="absolute left-4 z-10 p-3 rounded-full bg-slate-900/80 text-white hover:bg-cyan-600 transition border border-slate-700 backdrop-blur-md"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>

          {isVideo ? (
            <video 
              src={item.src} 
              controls 
              autoPlay 
              className="max-h-[65vh] w-auto max-w-full object-contain"
            />
          ) : (
            <img 
              src={item.src} 
              alt={item.title || 'Gallery Preview'} 
              className="max-h-[65vh] w-auto max-w-full object-contain"
            />
          )}

          <button
            onClick={onNext}
            className="absolute right-4 z-10 p-3 rounded-full bg-slate-900/80 text-white hover:bg-cyan-600 transition border border-slate-700 backdrop-blur-md"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>

        </div>

        {/* Caption Overlay */}
        <div className="p-4 bg-slate-950/90 text-center text-xs text-slate-400 border-t border-slate-800">
          <p>{item.description || 'Sardar Yaseen Malik Institute of Information Technology - Mirpurkhas'}</p>
        </div>
      </div>
    </div>
  );
};

export default GalleryLightbox;
