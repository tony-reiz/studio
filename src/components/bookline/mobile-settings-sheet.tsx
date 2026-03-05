'use client';

import { useEffect, useState, useRef, type TouchEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SettingsList } from './settings-list';
import { ChevronLeft, Check, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { languages } from '@/lib/languages';
import { useMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

type View = 'main' | 'language';

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
    const [searchQuery, setSearchQuery] = useState('');
    
    const isMobile = useMobile();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

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
                setSearchQuery('');
            }, 500); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const closeSheet = () => {
        setIsOpen(false);
    };
    
    const openSheet = () => {
        setIsOpen(true);
    }
    
    const handleOpenChange = (open: boolean) => {
        if (open) {
            openSheet();
        } else {
            closeSheet();
        }
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

    const onItemClick = (id: string) => {
        if (id === 'language') {
            setView('language');
        }
    };

    const handleLanguageSelect = (code: string) => {
        setSelectedLanguage(code);
        setSearchQuery('');
        closeSheet();
    };

    const filteredLanguages = searchQuery
      ? languages.filter(
          (lang) =>
            lang.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
            lang.nativeName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
            lang.flag.includes(searchQuery)
        )
      : [];

    const selectedLanguageObject = languages.find(lang => lang.code === selectedLanguage);

    const SettingsContent = (
        <div className="flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={cn(
                "flex h-full w-[200%] transition-transform duration-500 ease-in-out",
                view === 'language' ? "-translate-x-1/2" : "translate-x-0"
            )}>
                <div className="w-1/2 h-full flex flex-col">
                    {isMobile && <h2 id="sheet-title" className="sr-only">Paramètres</h2>}
                    {!isMobile && <h2 className="text-xl font-bold text-center p-4 pt-6">Paramètres</h2>}
                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                        <SettingsList onItemClick={onItemClick} />
                    </div>
                </div>

                <div className="w-1/2 h-full flex flex-col">
                    <div className="px-4 pt-6">
                        <div className="flex items-center justify-center relative mb-2">
                            <button onClick={() => setView('main')} className="absolute left-0 p-2 -ml-2 text-muted-foreground">
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <h1 className="text-xl font-bold text-center">Langue</h1>
                        </div>
                        <div className="relative w-full mb-2">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                            <Input
                                type="search"
                                placeholder="Rechercher..."
                                className="pl-11 pr-4 h-12 w-full text-base glass-form-element bg-transparent border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-full text-center py-2">
                            <p className="text-sm text-muted-foreground">Langue sélectionnée</p>
                            <div className="text-lg font-semibold text-foreground flex justify-center items-center gap-2">
                                <span>{selectedLanguageObject?.flag}</span>
                                <span>{selectedLanguageObject?.name || 'Français'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                        {searchQuery && (
                            <ul className="w-full space-y-2">
                                {filteredLanguages.map((lang) => (
                                    <li key={lang.code}>
                                        <button 
                                        onClick={() => handleLanguageSelect(lang.code)}
                                        className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl">{lang.flag}</span>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-foreground">{lang.name}</span>
                                                    <span className="text-sm text-muted-foreground">{lang.nativeName}</span>
                                                </div>
                                            </div>
                                        {selectedLanguage === lang.code && <Check className="h-6 w-6 text-foreground" />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
    
    if (!isClient) {
        return <div onClick={openSheet}>{children}</div>;
    }

    if (isMobile) {
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
                            className="absolute bottom-4 left-4 right-4 flex max-h-[70vh] w-auto flex-col bg-background rounded-[40px] touch-none"
                            style={{
                                transform: `translateY(${isAnimationOpen ? translateY : window.innerHeight}px)`,
                                transition: isDragging ? 'none' : 'transform 0.5s ease-in-out',
                            }}
                        >
                            <div className="mx-auto w-20 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/50 my-3" />
                            {SettingsContent}
                        </div>
                    </div>
                )}
            </>
        );
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild onClick={openSheet}>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full p-0 rounded-[40px] overflow-hidden border-none bg-background shadow-xl fixed bottom-0 left-1/2 -translate-x-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full">
                 <DialogTitle className="sr-only">Paramètres</DialogTitle>
                 <div className="h-[65vh] bg-background rounded-[40px] overflow-hidden flex flex-col">
                    {SettingsContent}
                 </div>
            </DialogContent>
        </Dialog>
    );
}