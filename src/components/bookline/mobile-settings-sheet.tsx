'use client';

import { useState, useEffect, useRef, type ReactNode, type TouchEvent } from "react";
import { SettingsList } from "./settings-list";
import { cn } from "@/lib/utils";

interface MobileSettingsSheetProps {
    children: ReactNode;
}

export function MobileSettingsSheet({ children }: MobileSettingsSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const timer = setTimeout(() => {
        setTranslateY(0);
      }, 10); // Small delay for mount
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setIsMounted(false), 500); // Wait for close animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const closeSheet = () => {
    setIsOpen(false);
  };
  
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Only allow dragging from the handle
    if (target.id !== 'drag-handle') return;

    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
    if (sheetRef.current) {
        const style = window.getComputedStyle(sheetRef.current);
        const matrix = new DOMMatrix(style.transform);
        setTranslateY(matrix.m42);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - dragStartY;
    // Only allow dragging down
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const sheetHeight = sheetRef.current?.clientHeight || 0;
    // If dragged more than a quarter of the way down, close it
    if (translateY > sheetHeight / 4) {
      closeSheet();
    } else {
      // Otherwise, snap it back to the top
      setTranslateY(0);
    }
  };

  // Wrap the trigger to handle opening the sheet
  const trigger = children ? (
    <div className="inline-block" onClick={() => setIsOpen(true)}>
      {children}
    </div>
  ) : null;


  return (
    <>
      {trigger}
      {isMounted && (
        <div 
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
        >
          <div
            className={cn(
              "fixed inset-0 bg-black/60 transition-opacity duration-500",
              isOpen ? 'opacity-100' : 'opacity-0'
            )}
            onClick={closeSheet}
          />
          
          <div
            ref={sheetRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => e.stopPropagation()}
            className={cn(
                "absolute bottom-0 left-0 right-0 flex max-h-[70vh] w-full flex-col bg-background rounded-t-[50px] touch-none",
                isDragging ? 'transition-none' : 'transition-transform duration-500 ease-in-out'
            )}
            style={{ transform: `translateY(${isOpen ? translateY : window.innerHeight}px)` }}
          >
            <h2 id="sheet-title" className="sr-only">Paramètres</h2>
            <div
                id="drag-handle"
                className="mx-auto w-20 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/50 my-3 cursor-grab active:cursor-grabbing"
            />
            <div className="overflow-y-auto px-4 pb-4">
                <SettingsList />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
