'use client';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';
import { cn } from '@/lib/utils';

export default function BlankPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center relative bg-black">
      <DarkFluidBackground isActive={true} className="absolute inset-0 z-0" />
      <div className={cn(
        "relative z-10 w-72 h-72 shadow-2xl rounded-full"
      )}></div>
    </div>
  );
}
