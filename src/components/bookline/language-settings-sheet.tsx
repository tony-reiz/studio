'use client';

import { useEffect, useState, useRef, type TouchEvent } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
];

interface LanguageSettingsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LanguageSettingsSheet({ open, onOpenChange }: LanguageSettingsSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null);
    const [isSheetMounted, setIsSheetMounted] = useState(open);
    const [isAnimationOpen, setIsAnimationOpen] = useState(false);
    
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartY, setDragStartY] = useState(0);
    const [translateY, setTranslateY] = useState(0);

    const [selectedLanguage, setSelectedLanguage] = useState('fr'); // Default to French

    useEffect(() => {
        if (open) {
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
    }, [open]);

    const closeSheet = () => {
        onOpenChange(false);
    };

    const handleLanguageSelect = (code: string) => {
        setSelectedLanguage(code);
        // In a real app, this would be saved and i18n would be handled.
        // For now, it's a visual selection.
        closeSheet();
    };

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

    if (!isSheetMounted) {
        return null;
    }

    return (
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
                <h2 id="sheet-title" className="sr-only">Langue</h2>
                <div className="mx-auto w-20 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/50 my-3" />
                <div className="overflow-y-auto px-4 pb-4" onClick={(e) => e.stopPropagation()}>
                    <h1 className="text-2xl font-bold text-center mb-4">Langue</h1>
                    <ul className="w-full space-y-2">
                        {languages.map((lang) => (
                        <li key={lang.code}>
                            <button 
                            onClick={() => handleLanguageSelect(lang.code)}
                            className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors"
                            >
                            <span className="font-semibold text-foreground">
                                {lang.name}
                            </span>
                            {selectedLanguage === lang.code && <Check className="h-6 w-6 text-foreground" />}
                            </button>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
