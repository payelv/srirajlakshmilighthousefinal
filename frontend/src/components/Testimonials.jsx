import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Quote } from 'lucide-react';
import { useContent } from '../context/ContentContext';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export default function Testimonials() {
  const { content } = useContent();
  const items = content.testimonials || [];
  const videoRefs = useRef([]);
  const [playing, setPlaying] = useState({});
  const [muted, setMuted] = useState({});

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
        <div className="text-center mb-14">
          <span className="text-xs tracking-[0.35em] uppercase text-amber-400">Testimonials</span>
          <h2 className="mt-4 font-serif text-4xl lg:text-6xl">
            What our <span className="gold-gradient-text italic">customers say</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((t, i) =>
            t.video ? (
              <div
                key={`${t.name || 'testimonial'}-${i}`}
                className="relative rounded-2xl overflow-hidden bg-neutral-800 aspect-[9/16]"
              >
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
                {t.quote ? (
                  <div className="absolute left-[18px] right-[18px] bottom-[76px] text-white italic text-sm leading-relaxed z-10">
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
            ) : (
              <div
                key={`${t.name || 'testimonial'}-${i}`}
                className="flex flex-col rounded-2xl border border-border bg-card/40 backdrop-blur p-7 card-hover"
              >
                <Quote className="w-7 h-7 text-amber-500/50 mb-4" />
                {t.quote ? (
                  <p className="text-muted-foreground italic leading-relaxed text-[15px] flex-1">"{t.quote}"</p>
                ) : (
                  <div className="flex-1" />
                )}
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-border/60">
                  <span className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-semibold text-sm flex-shrink-0">
                    {initials(t.name)}
                  </span>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    {t.role ? (
                      <div className="text-amber-500 text-[11px] tracking-widest uppercase mt-0.5">{t.role}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
