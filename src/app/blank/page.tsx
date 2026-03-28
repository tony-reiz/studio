'use client';
import { IridescentBackground } from '@/components/bookline/iridescent-background';
import { cn } from '@/lib/utils';

export default function BlankPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center relative">
      <IridescentBackground className="absolute inset-0 z-0" />
      <div className={cn(
        "relative z-10 w-96 h-96 bg-black/10 backdrop-blur-xl shadow-2xl"
      )}></div>
    </div>
  );
}
