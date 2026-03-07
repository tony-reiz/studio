'use client';

import { useEffect, useState, type ReactNode, useRef, type TouchEvent } from 'react';
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
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<View>('main');
    const { locale, setLocale, t } = useEbooks();
    const [searchQuery, setSearchQuery] = useState('');
    
    const isMobile = useIsMobile();
    const [isClient, setIsClient] = useState(false);

    const sheetRef = useRef<HTMLDivElement>(null);
    const mainViewRef = useRef<HTMLDivElement>(null);

    const [isSheetMounted, setIsSheetMounted] = useState(false);
    const [isAnimationOpen, setIsAnimationOpen] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [animationCurve, setAnimationCurve] = useState('cubic-bezier(0.32, 0.72, 0, 1)');
    const [translateY, setTranslateY] = useState(0);
    const dragState = useRef({ isDragging: false, startY: 0, isSheetDrag: false });

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (isMobile) {
                document.body.style.overflow = 'hidden';
                setIsSheetMounted(true);
                setIsContentVisible(false);
                setAnimationCurve('cubic-bezier(0.32, 0.72, 0, 1)');
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
                // For desktop, just handle content visibility
                setIsContentVisible(false);
                const timer = setTimeout(() => setIsContentVisible(true), 100);
                return () => clearTimeout(timer);
            }
        } else {
            // Universal close logic
            setIsContentVisible(false);
            const timer = setTimeout(() => {
                setView('main');
                setSearchQuery('');
                if (isMobile) {
                    setIsSheetMounted(false);
                }
            }, 500);

            if (isMobile) {
                if (!isSheetMounted) return;
                document.body.style.overflow = 'auto';
                setAnimationCurve('cubic-bezier(0.55, 0.085, 0.68, 0.53)');
                setIsAnimationOpen(false);
            }

            return () => clearTimeout(timer);
        }
    }, [isOpen, isMobile, isSheetMounted]);

    const closeSheet = () => {
        setIsOpen(false);
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
    
    if (!isClient) {
        return <div>{children}</div>;
    }
    
    const onItemClick = (id: string) => {
        if (id === 'language') setView('language');
        else if (id === 'help') setView('help');
        else if (id === 'security') setView('security');
    };

    const handleLanguageSelect = (code: Locale) => {
        setLocale(code);
        setSearchQuery('');
        setIsOpen(false);
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
      <div className="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
          {isMobile && <h2 id="sheet-title" className="sr-only">{t('settings')}</h2>}
          {!isMobile && <h2 className="text-xl font-bold text-center p-4 pt-6">{t('settings')}</h2>}
          <div 
              ref={mainViewRef} 
              data-scrollable-sheet="true" 
              className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-20 touch-pan-y"
          >
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
                                    <label htmlFor="2fa-switch-desktop" className="font-semibold text-foreground cursor-pointer">{t('two_factor_auth')}</label>
                                    <span className="text-sm text-muted-foreground">{t('two_factor_auth_desc')}</span>
                                </div>
                            </div>
                            <Switch id="2fa-switch-desktop" />
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
      <div 
          className={cn(
              "flex-1 flex flex-col min-h-0",
              "transition-opacity", 
              isContentVisible ? "opacity-100 duration-300" : "opacity-0 duration-[800ms]"
          )} 
          onClick={(e) => e.stopPropagation()}
      >
          <div className={cn(
              "flex flex-1 w-[200%] min-h-0",
              "transition-transform duration-500 ease-in-out",
              view !== 'main' ? "-translate-x-1/2" : "translate-x-0"
          )}>
              <div className="w-1/2 h-full flex flex-col flex-shrink-0">{MainView}</div>
              <div className="w-1/2 h-full flex flex-col flex-shrink-0">
                  {view === 'language' && LanguageView}
                  {view === 'help' && HelpView}
                  {view === 'security' && SecurityView}
              </div>
          </div>
      </div>
    );
    
    if (isMobile) {
        return (
            <>
                <div onClick={() => setIsOpen(true)}>
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
                            className="absolute bottom-0 left-0 right-0 flex h-[70vh] w-full flex-col bg-background rounded-t-[50px] pt-2"
                            style={{
                              transform: `translateY(${isAnimationOpen ? translateY : window.innerHeight}px)`,
                              transition: `transform 0.8s ${animationCurve}`,
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full p-0 bg-transparent border-none shadow-xl">
                 <DialogTitle className="sr-only">{t('settings')}</DialogTitle>
                 <div className="h-[60vh] flex flex-col bg-background rounded-[50px] overflow-hidden">
                    {SettingsContent}
                 </div>
            </DialogContent>
        </Dialog>
    );
}
