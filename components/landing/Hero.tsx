'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, Check } from 'lucide-react';

export default function Hero() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;

    setRotation({
      x: y * -8,
      y: x * 8
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-32 pb-20 overflow-hidden bg-zinc-50 min-h-screen flex flex-col justify-center transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-8 tracking-wide uppercase fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          New AI Engine Available
        </div>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-zinc-900 mb-6 max-w-4xl mx-auto leading-[1.1] fade-in-up delay-100">
          Insurance affordability. <br/>
          <span className="text-zinc-400">Simplified.</span>
        </h1>

        <p className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed fade-in-up delay-200">
          Calculate discretionary cash flow and determine sustainable premium payments with professional precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 fade-in-up delay-300">
          <Link
            href="/register"
            className="group bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            Start Free Trial
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="text-zinc-600 hover:text-zinc-900 px-8 py-4 font-medium transition-colors flex items-center gap-2">
            <span className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center bg-white">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-zinc-900 border-b-[5px] border-b-transparent ml-1"></div>
            </span>
            Watch the film
          </button>
        </div>

        {/* Abstract 3D Dashboard Mockup with Dynamic Parallax */}
        <div className="relative mx-auto max-w-5xl fade-in-up delay-500 perspective-1000">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-zinc-200/50 p-2 transition-transform duration-100 ease-out overflow-hidden will-change-transform"
            style={{
              transform: `rotateX(${10 + rotation.x}deg) rotateY(${rotation.y}deg)`,
            }}
          >
            {/* Mock Window Controls */}
            <div className="h-8 bg-zinc-50 border-b border-zinc-100 flex items-center px-4 gap-2 rounded-t-xl">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
            </div>

            {/* Mock UI Content */}
            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 bg-zinc-50 border-r border-zinc-100 p-6 hidden md:block h-[500px]">
                <div className="space-y-4">
                  <div className="h-2 w-24 bg-zinc-200 rounded"></div>
                  <div className="h-2 w-32 bg-zinc-200 rounded"></div>
                  <div className="h-2 w-20 bg-zinc-200 rounded"></div>
                </div>
                <div className="mt-12 space-y-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center gap-3 opacity-60">
                      <div className="w-8 h-8 rounded-lg bg-zinc-200"></div>
                      <div className="h-2 w-24 bg-zinc-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-8 bg-white">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <div className="h-8 w-64 bg-zinc-900 rounded-lg mb-2"></div>
                    <div className="h-3 w-48 bg-zinc-200 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-full bg-zinc-100"></div>
                    <div className="w-10 h-10 rounded-full bg-blue-600"></div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="bg-zinc-50 rounded-xl p-6 border border-zinc-100">
                        <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Metric {i}</div>
                        <div className="text-2xl font-bold text-zinc-900 mb-4">$420,00{i}</div>
                        <div className="flex items-end gap-1 h-12">
                           {[40, 70, 50, 90, 60, 80].map((h, idx) => (
                             <div key={idx} style={{height: `${h}%`}} className="flex-1 bg-blue-500/20 rounded-t-sm"></div>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>

                <div className="bg-zinc-900 text-white rounded-xl p-8 flex justify-between items-center">
                    <div>
                        <div className="text-zinc-400 mb-1">Affordability Analysis</div>
                        <div className="text-3xl font-bold">Safe to Proceed</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500">
                        <Check className="w-6 h-6" />
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reflection Glow */}
          <div
            className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl -z-10 opacity-40 transition-transform duration-100 ease-out"
            style={{
                transform: `translateX(${rotation.y * -2}px) translateY(${rotation.x * -2}px)`
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}
