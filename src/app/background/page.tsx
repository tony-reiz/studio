'use client';
import { LiquidChronic } from '@/components/bookline/liquid-chronic';

export default function BackgroundPage() {
  return (
    <div className="h-screen w-full relative bg-black flex items-center justify-center p-8">
      <div className="w-28 h-28 relative">
        <LiquidChronic className="absolute inset-0 rounded-3xl" />
      </div>
      <div className="w-28 h-28 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-sm"></div>
    </div>
  );
}
