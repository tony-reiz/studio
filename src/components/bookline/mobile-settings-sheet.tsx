'use client';

import { useEffect, useState, useRef, type TouchEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SettingsList } from './settings-list';
import { ChevronLeft, Check } from 'lucide-react';

type View = 'main' | 'language';

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
];

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

    const [view, setView] = useState<View>('main');
    const [selectedLanguage, setSelectedLanguage] = useState('fr');

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
                setView('main'); // Reset view when sheet is fully closed
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

    const handleMobileItemClick = (id: string) => {
        if (id === 'language') {
            setView('language');
        }
    };

    const handleLanguageSelect = (code: string) => {
        setSelectedLanguage(code);
        closeSheet();
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
                        
                        <div className="flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className={cn(
                                "flex h-full w-[200%] transition-transform duration-500 ease-in-out",
                                view === 'language' ? "-translate-x-1/2" : "translate-x-0"
                            )}>
                                <div className="w-1/2 h-full overflow-y-auto px-4">
                                    <SettingsList onMobileItemClick={handleMobileItemClick} />
                                </div>
                                <div className="w-1/2 h-full overflow-y-auto px-4">
                                     <div className="flex items-center justify-center relative mb-4">
                                        <button onClick={() => setView('main')} className="absolute left-0 p-2 -ml-2 text-muted-foreground">
                                            <ChevronLeft className="h-6 w-6" />
                                        </button>
                                        <h1 className="text-xl font-bold text-center">Langue</h1>
                                    </div>
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

                    </div>
                </div>
            )}
        </>
    );
}
