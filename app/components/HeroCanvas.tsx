'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 100;

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const images: HTMLImageElement[] = [];
    const penState = { frame: 0 };

    const getFrameUrl = (index: number) =>
      `/frames/pen_${(index + 1).toString().padStart(4, '0')}.webp`;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      images.push(img);
    }

    const render = () => {
      if (!images[penState.frame]?.complete) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[penState.frame], 0, 0, canvas.width, canvas.height);
    };

    images[0].onload = render;

    const ctx = gsap.context(() => {
      gsap.to(penState, {
        frame: TOTAL_FRAMES - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=2500',
          pin: true,
          scrub: 0.5,
          onUpdate: render,
        },
      });

      gsap.to('.hero-text-overlay', {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400',
          scrub: true,
        },
      });
    }, containerRef);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#0b0b0b]">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />
      
      <div className="hero-text-overlay relative z-10 flex flex-col items-center justify-center h-full text-center pointer-events-none px-4">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white">NŌTA</h1>
        <p className="mt-4 text-lg md:text-xl text-neutral-400 max-w-lg">
          Writing Infrastructure for Modern Thinking
        </p>
      </div>
    </section>
  );
}