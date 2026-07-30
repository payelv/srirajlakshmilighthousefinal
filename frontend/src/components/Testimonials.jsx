import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Testimonials() {
  const { content } = useContent();
  const items = content.testimonials || [];
  const videoRefs = useRef([]);
  const trackRef = useRef(null);
  const [playing, setPlaying] = useState({});
  const [muted, setMuted] = useState({});

  useEffect(() => {
    if (!items.length) return undefined;
    const interval = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 5) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: 304, behavior: 'smooth' });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items.length) return null;

  const togglePlay = (i) => {
    const v = videoRefs.current[i];
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying((p) => ({ ...p, [i]: true }));
    } else {
      v.pause();
      setPlaying((p) => ({ ...p, [i]: false }));
    }
  };

  const toggleMute = (i) => {
    const v = videoRefs.current[i];
    if (!v) return;
    v.muted = !v.muted;
    setMuted((m) => ({ ...m, [i]: v.muted }));
  };

  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto no-scrollbar"
          style={{ scrollBehavior: 'smooth' }}
        >
          {items.map((t, i) => (
            <div
              key={`${t.name || 'testimonial'}-${i}`}
              className="relative flex-shrink-0 w-[280px] h-[500px] rounded-[20px] overflow-hidden bg-neutral-800"
            >
              {t.video ? (
                <video
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={t.video}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  onPlay={() => setPlaying((p) => ({ ...p, [i]: true }))}
                  onPause={() => setPlaying((p) => ({ ...p, [i]: false }))}
                />
              ) : null}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.78) 100%)' }}
              />

              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <button
                  type="button"
                  onClick={() => togglePlay(i)}
                  className="w-7 h-7 rounded-full bg-black/55 flex items-center justify-center text-white"
                >
                  {playing[i] === false ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => toggleMute(i)}
                  className="inline-flex items-center gap-1 bg-black/50 rounded-full px-3 py-1.5 text-white text-[11px]"
                >
                  {muted[i] === false ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  {muted[i] === false ? 'MUTE' : 'UNMUTE'}
                </button>
              </div>

              <div className="absolute top-4 right-4 bg-black/50 rounded-full px-3 py-1.5 text-white text-[11px] z-10">
                {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </div>

              {t.quote ? (
                <div className="absolute left-[18px] right-[18px] bottom-[82px] text-white italic text-sm leading-relaxed z-10">
                  "{t.quote}"
                </div>
              ) : null}

              <div className="absolute left-[18px] right-[18px] bottom-[18px] pt-2.5 border-t border-white/25 z-10">
                <div className="text-white font-semibold text-[15px]">{t.name}</div>
                {t.role ? (
                  <div className="text-amber-400 text-[11px] tracking-wide mt-0.5 uppercase">{t.role}</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
