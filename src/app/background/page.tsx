'use client';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';

export default function BackgroundPage() {
  return (
    <div className="h-screen w-full relative bg-black">
      <DarkFluidBackground isActive={true} className="absolute inset-0 z-0" />
    </div>
  );
}
