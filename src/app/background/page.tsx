'use client';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';

export default function BackgroundPage() {
  return (
    <div className="h-screen w-full relative bg-black flex items-center justify-center p-8">
      <DarkFluidBackground isActive={true} className="absolute inset-0 z-0" />
      <div className="w-72 h-72 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-sm"></div>
    </div>
  );
}
