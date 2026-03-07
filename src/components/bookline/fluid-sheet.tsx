'use client';

import { useEffect, useState, useRef, type TouchEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FluidSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
    className?: string;
    'aria-labelledby'?: string;
}

export function FluidSheet({ open, onOpenChange, children, className, ...props }: FluidSheetProps) {
    const [isSheetMounted, setIsSheetMounted] = useState(open);
    const [isAnimationOpen, setIsAnimationOpen] = useState(false);
    const [animationCurve, setAnimationCurve] = useState('cubic-bezier(0.32, 0.72, 0, 1)');

    const sheetRef = useRef<HTMLDivElement>(null);
    const [translateY, setTranslateY] = useState(0);
    const dragState = useRef({ isDragging: false, startY: 0, isSheetDrag: false });

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            setIsSheetMounted(true);
            setAnimationCurve('cubic-bezier(0.32, 0.72, 0, 1)');
            const timer = setTimeout(() => {
                setIsAnimationOpen(true);
                setTranslateY(0);
            }, 10);
            return () => clearTimeout(timer);
        } else {
            if (!isSheetMounted) return;
            document.body.style.overflow = 'auto';
            setAnimationCurve('cubic-bezier(0.55, 0.085, 0.68, 0.53)');
            setIsAnimationOpen(false);
            const timer = setTimeout(() => {
                setIsSheetMounted(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [open, isSheetMounted]);

    const closeSheet = () => {
        onOpenChange(false);
    };

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        if (dragState.current.isDragging) return;
        dragState.current = { isDragging: true, startY: e.touches[0].clientY, isSheetDrag: false };
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        if (!dragState.current.isDragging) return;

        const currentY = e.touches[0].clientY;
        const deltaY = currentY - dragState.current.startY;

        const target = e.target as HTMLElement;
        const scrollableContent = target.closest<HTMLElement>('[data-scrollable-sheet="true"]');
        const isAtTop = !scrollableContent || scrollableContent.scrollTop <= 0;

        if (isAtTop && deltaY > 0) {
            dragState.current.isSheetDrag = true;
            if (sheetRef.current) {
                sheetRef.current.style.transition = 'none';
            }
            setTranslateY(deltaY);
            
            if (e.cancelable) e.preventDefault(); 
        } 
        else {
            dragState.current.isSheetDrag = false;
        }
    };
    
    const handleTouchEnd = () => {
        if (!dragState.current.isDragging) return;

        if (sheetRef.current) {
            sheetRef.current.style.transition = '';
        }

        if (dragState.current.isSheetDrag) {
            const sheetHeight = sheetRef.current?.clientHeight || 0;
            if (translateY > sheetHeight / 4) {
                closeSheet();
            } else {
                setTranslateY(0);
            }
        }
        
        dragState.current = { isDragging: false, startY: 0, isSheetDrag: false };
    };

    if (!isSheetMounted) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby={props['aria-labelledby']}
        >
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 transition-opacity duration-500",
                    isAnimationOpen ? 'opacity-100' : 'opacity-0'
                )}
                onClick={closeSheet}
            />
            <div
                ref={sheetRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={cn("absolute bottom-0 left-0 right-0 flex h-[80vh] w-full flex-col bg-background rounded-t-[50px] pt-2", className)}
                style={{
                    transform: `translateY(${isAnimationOpen ? translateY : window.innerHeight}px)`,
                    transition: `transform 0.8s ${animationCurve}`,
                }}
            >
                <div className="flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        </div>
    );
}
