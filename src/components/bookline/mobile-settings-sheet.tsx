'use client';

import { useEffect, useState, useRef, type TouchEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SettingsList } from './settings-list';

interface MobileSettingsSheetProps {
    children: ReactNode;
}

export function MobileSettingsSheet({ children }: MobileSettingsSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isSheetMounted, setIsSheetMounted] = useState(false);
    const [isAnimationOpen, setIsAnimationOpen] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStartY, setDragStartY] = useState(0);
    const [translateY, setTranslateY] = useState(0);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsSheetMounted(true);
            const timer = setTimeout(() => {
                setIsAnimationOpen(true);
                setTranslateY(0);
            }, 10);
            return () => clearTimeout(timer);
        } else {
            document.body.style.overflow = 'auto';
            setIsAnimationOpen(false);
            const timer = setTimeout(() => {
                setIsSheetMounted(false);
            }, 400); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const closeSheet = () => {
        setIsOpen(false);
    };
    
    const openSheet = () => {
        setIsOpen(true);
    }

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        if (!sheetRef.current) return;
        setIsDragging(true);
        setDragStartY(e.touches[0].clientY);
        const style = window.getComputedStyle(e.currentTarget);
        const matrix = new DOMMatrix(style.transform);
        setTranslateY(matrix.m42);
    };
    
    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const currentY = e.touches[0].clientY;
        let deltaY = currentY - dragStartY;
        if (deltaY < 0) {
            deltaY = 0;
        }
        setTranslateY(deltaY);
    };
    
    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        
        const sheetHeight = sheetRef.current?.clientHeight || 0;
        if (translateY > sheetHeight / 4) {
            closeSheet();
        } else {
            setTranslateY(0);
        }
    };

    return (
        <>
            <div onClick={openSheet}>
                {children}
            </div>
            {isSheetMounted && (
                <div 
                    className="fixed inset-0 z-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="sheet-title"
                >
                    <div
                        className={cn(
                            "fixed inset-0 bg-black/60 transition-opacity duration-300",
                            isAnimationOpen ? 'opacity-100' : 'opacity-0'
                        )}
                        onClick={closeSheet}
                    />
                    <div
                        ref={sheetRef}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="absolute bottom-0 left-0 right-0 flex max-h-[70vh] w-full flex-col bg-background rounded-t-[50px] touch-none"
                        style={{
                            transform: `translateY(${isAnimationOpen ? translateY : window.innerHeight}px)`,
                            transition: isDragging ? 'none' : 'transform 0.4s ease-in-out',
                        }}
                    >
                        <h2 id="sheet-title" className="sr-only">Paramètres</h2>
                        <div className="mx-auto w-20 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/50 my-3" />
                        <div className="overflow-y-auto px-4" onClick={(e) => e.stopPropagation()}>
                            <SettingsList />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
