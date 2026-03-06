'use client';

import { useEffect, useState, useRef, type TouchEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SettingsList } from './settings-list';
import { ChevronLeft, Check, Search, KeyRound, Smartphone, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { languages } from '@/lib/languages';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEbooks } from '@/context/ebook-provider';
import type { Locale } from '@/lib/translations';

type View = 'main' | 'language' | 'help' | 'security';

interface MobileSettingsSheetProps {
    children: ReactNode;
}

export function MobileSettingsSheet({ children }: MobileSettingsSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isSheetMounted, setIsSheetMounted] = useState(false);
    const [isAnimationOpen, setIsAnimationOpen] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStartY, setDragStartY] = useState(0);
    const [translateY, setTranslateY] = useState(0);

    const [view, setView] = useState<View>('main');
    const { locale, setLocale, t } = useEbooks();
    const [searchQuery, setSearchQuery] = useState('');
    
    const isMobile = useIsMobile();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsSheetMounted(true);
            setIsContentVisible(false);
            const timer = setTimeout(() => {
                setIsAnimationOpen(true);
                setTranslateY(0);
            }, 10);
            const contentTimer = setTimeout(() => {
                setIsContentVisible(true);
            }, 700);
            return () => {
                clearTimeout(timer);
                clearTimeout(contentTimer);
            };
        } else {
            document.body.style.overflow = 'auto';
            setIsAnimationOpen(false);
            setIsContentVisible(false);
            const timer = setTimeout(() => {
                setIsSheetMounted(false);
                setView('main'); // Reset view when sheet is fully closed
                setSearchQuery('');
            }, 800);
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
        const target = e.target as HTMLElement;
        const scrollableContent = target.closest('[data-scrollable-sheet="true"]');

        if (scrollableContent && scrollableContent.scrollTop > 0) {
            return;
        }

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
        const deltaY = currentY - dragStartY;

        if (deltaY < 0) {
            return;
        }
        e.preventDefault();
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
        } else if (id === 'help') {
            setView('help');
        } else if (id === 'security') {
            setView('security');
        }
    };

    const handleLanguageSelect = (code: Locale) => {
        setLocale(code);
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

    const selectedLanguageObject = languages.find(lang => lang.code === locale);

    const faqs = [
      { id: "faq-1", question: t('faq_q1'), answer: t('faq_a1') },
      { id: "faq-2", question: t('faq_q2'), answer: t('faq_a2') },
      { id: "faq-3", question: t('faq_q3'), answer: t('faq_a3') },
      { id: "faq-4", question: t('faq_q4'), answer: t('faq_a4') },
    ];
    
    const MainView = (
        <div className="w-full h-full flex flex-col flex-shrink-0">
            {isMobile && <h2 id="sheet-title" className="sr-only">{t('settings')}</h2>}
            {!isMobile && <h2 className="text-xl font-bold text-center p-4 pt-6">{t('settings')}</h2>}
            <div data-scrollable-sheet="true" className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
                <SettingsList onItemClick={onItemClick} />
            </div>
        </div>
    );

    const LanguageView = (
        <div className="w-full h-full flex flex-col flex-shrink-0">
            <div className="px-4 pt-6">
                <div className="flex items-center justify-center relative mb-2">
                    <button onClick={() => setView('main')} className="absolute left-0 p-2 -ml-2 text-muted-foreground">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold text-center">{t('language')}</h1>
                </div>
                <div className="relative w-full mb-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                    <Input
                        type="search"
                        placeholder={t('search_language')}
                        className="pl-11 pr-4 h-12 w-full text-base glass-form-element bg-transparent border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full text-center py-2">
                    <p className="text-sm text-muted-foreground">{t('selected_language')}</p>
                    <div className="text-lg font-semibold text-foreground flex justify-center items-center gap-2">
                        <span>{selectedLanguageObject?.flag}</span>
                        <span>{selectedLanguageObject?.name || 'Français'}</span>
                    </div>
                </div>
            </div>
            <div data-scrollable-sheet="true" className="flex-1 overflow-y-auto px-4 pb-4">
                {searchQuery && (
                    <ul className="w-full space-y-2">
                        {filteredLanguages.map((lang) => (
                            <li key={lang.code}>
                                <button 
                                onClick={() => handleLanguageSelect(lang.code as Locale)}
                                className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{lang.flag}</span>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{lang.name}</span>
                                            <span className="text-sm text-muted-foreground">{lang.nativeName}</span>
                                        </div>
                                    </div>
                                {locale === lang.code && <Check className="h-6 w-6 text-foreground" />}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
    
    const HelpView = (
        <div className="w-full h-full flex flex-col flex-shrink-0">
             <div className="px-4 pt-6">
                <div className="flex items-center justify-center relative mb-2">
                    <button onClick={() => setView('main')} className="absolute left-0 p-2 -ml-2 text-muted-foreground">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold text-center">{t('help')}</h1>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold">{t('help_center_title')}</h2>
                    <p className="text-muted-foreground text-sm mt-1">{t('help_center_subtitle')}</p>
                </div>
            </div>
            <div data-scrollable-sheet="true" className="flex-1 overflow-y-auto px-4 pb-4">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map(faq => (
                      <AccordionItem value={faq.id} key={faq.id}>
                        <AccordionTrigger className="text-left font-semibold text-sm">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );

    const SecurityView = (
        <div className="w-full h-full flex flex-col flex-shrink-0">
             <div className="px-4 pt-6">
                <div className="flex items-center justify-center relative mb-2">
                    <button onClick={() => setView('main')} className="absolute left-0 p-2 -ml-2 text-muted-foreground">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold text-center">{t('security')}</h1>
                </div>
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold">{t('security_and_login')}</h2>
                    <p className="text-muted-foreground text-sm mt-1">{t('manage_account_security')}</p>
                </div>
            </div>
            <div data-scrollable-sheet="true" className="flex-1 overflow-y-auto px-4 pb-4">
                <ul className="w-full space-y-2">
                    <li>
                        <button className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors">
                            <div className="flex items-center gap-4">
                                <KeyRound className="h-6 w-6 text-muted-foreground" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-foreground">{t('password')}</span>
                                    <span className="text-sm text-muted-foreground">{t('password_last_changed')}</span>
                                </div>
                            </div>
                        </button>
                    </li>
                    <li>
                        <div className="w-full rounded-full flex items-center justify-between p-4 text-left">
                            <div className="flex items-center gap-4">
                                <Smartphone className="h-6 w-6 text-muted-foreground" />
                                 <div className="flex flex-col">
                                    <label htmlFor="2fa-switch-mobile" className="font-semibold text-foreground cursor-pointer">{t('two_factor_auth')}</label>
                                    <span className="text-sm text-muted-foreground">{t('two_factor_auth_desc')}</span>
                                </div>
                            </div>
                            <Switch id="2fa-switch-mobile" />
                        </div>
                    </li>
                    <li>
                        <button className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors">
                            <div className="flex items-center gap-4">
                                <LogOut className="h-6 w-6 text-destructive" />
                                <span className="font-semibold text-destructive">{t('logout_all_devices')}</span>
                            </div>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );

    const SettingsContent = (
        <div className={cn("flex-1 overflow-hidden transition-opacity duration-300 pt-4", isContentVisible ? "opacity-100" : "opacity-0")} onClick={(e) => e.stopPropagation()}>
            <div className={cn(
                "flex h-full w-[200%]",
                "transition-transform duration-500 ease-in-out",
                view !== 'main' ? "-translate-x-1/2" : "translate-x-0"
            )}>
                <div className="w-1/2 h-full flex-shrink-0">{MainView}</div>
                <div className="w-1/2 h-full flex-shrink-0">
                    {view === 'language' && LanguageView}
                    {view === 'help' && HelpView}
                    {view === 'security' && SecurityView}
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
                            className="absolute bottom-0 left-0 right-0 flex max-h-[70vh] w-auto flex-col bg-background rounded-t-[40px] pt-6"
                            style={{
                                transform: `translateY(${isAnimationOpen ? translateY : window.innerHeight}px)`,
                                transition: isDragging ? 'none' : 'transform 0.8s cubic-bezier(0.32, 0.72, 0, 1)',
                            }}
                        >
                            
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
            <DialogContent className="max-w-2xl w-full p-0 bg-transparent border-none shadow-xl">
                 <DialogTitle className="sr-only">{t('settings')}</DialogTitle>
                 <div className="h-[60vh] flex flex-col bg-background rounded-[60px] overflow-hidden">
                    {SettingsContent}
                 </div>
            </DialogContent>
        </Dialog>
    );
}
