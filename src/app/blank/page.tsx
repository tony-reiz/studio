'use client';
import { IridescentBackground } from '@/components/bookline/iridescent-background';

export default function BlankPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <IridescentBackground />
      <div className="w-96 h-96 bg-black rounded-lg shadow-2xl"></div>
    </div>
  );
}
