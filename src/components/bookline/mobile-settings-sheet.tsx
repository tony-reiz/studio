'use client';

import { useEffect, useState, type ReactNode, useRef } from 'react';
import { cn } from '@/lib/utils';
import { SettingsList } from './settings-list';
import { ChevronLeft, Check, Search, KeyRound, Smartphone, LogOut, Plus, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { languages } from '@/lib/languages';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle as UIDialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEbooks } from '@/context/ebook-provider';
import type { Locale, TranslationKeys } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ImageCropper } from './image-cropper';

type View = 'main' | 'language' | 'help' | 'security' | 'account';

interface MobileSettingsSheetProps {
    children: ReactNode;
}

export function MobileSettingsSheet({ children }: MobileSettingsSheetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<View>('main');
    const { locale, setLocale, t, userProfile, updateUserProfile, selectedInterests, updateSelectedInterests, theme, canChangeUsername } = useEbooks();
    const [searchQuery, setSearchQuery] = useState('');
    
    const isMobile = useIsMobile();
    const [isClient, setIsClient] = useState(false);

    const [isContentVisible, setIsContentVisible] = useState(false);

    // State for Account View
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [localSelectedInterests, setLocalSelectedInterests] = useState<string[]>([]);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const interestKeys: TranslationKeys[] = [
      'business', 'fiction', 'biographies', 'courses_revisions', 
      'career', 'sport', 'motivation', 'driving_code', 'prep_courses',
      'personal_development', 'science_fiction', 'technology', 
      'health_wellness', 'cooking', 'art_photography', 'travel',
      'history', 'psychology', 'finance', 'marketing', 'other'
    ];

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Effect for animations and view reset on open/close
    useEffect(() => {
        if (isOpen) {
            setIsContentVisible(false);
            const timer = setTimeout(() => setIsContentVisible(true), isMobile ? 700 : 100);
            return () => clearTimeout(timer);
        } else {
            setIsContentVisible(false);
            const timer = setTimeout(() => {
                setView('main');
                setSearchQuery('');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isMobile]);
    
    // Effect to sync local state with context when sheet opens or context data changes
    useEffect(() => {
        if (isOpen) {
            setUsername(userProfile.username !== 'utilisateur' && userProfile.username !== 'user' ? userProfile.username : '');
            setBio(userProfile.bio || '');
            setAvatarUrl(userProfile.avatarUrl);
            
            const fullInterests: string[] = [];
            interestKeys.forEach(key => {
                const translated = t(key);
                if (selectedInterests.some(si => t(key as TranslationKeys).toLowerCase().includes(si))) {
                  fullInterests.push(translated);
                }
            });
            setLocalSelectedInterests(fullInterests);
        }
    }, [isOpen, userProfile, selectedInterests, t]);

    
    const onItemClick = (id: string) => {
        if (id === 'language') setView('language');
        else if (id === 'help') setView('help');
        else if (id === 'security') setView('security');
        else if (id === 'account') setView('account');
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

    // --- Account View Logic ---
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageToCrop(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
        if (e.target) {
            e.target.value = "";
        }
    };

    const onCropComplete = (croppedImageUrl: string) => {
        setAvatarUrl(croppedImageUrl);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const valueWithoutSpaces = value.replace(/\s/g, '');
        const truncatedValue = valueWithoutSpaces.slice(0, 10);
        setUsername(truncatedValue);
    };
    
    const toggleInterest = (interest: string) => {
        setLocalSelectedInterests((prev) =>
          prev.includes(interest)
            ? prev.filter((i) => i !== interest)
            : [...prev, interest]
        );
    };

    const handleSave = () => {
        if (saveStatus !== 'idle') return;

        const existingUsernames = ['admin', 'bookline', 'kaizer'];
        const newUsername = username.trim();

        if (!newUsername) return;

        if (existingUsernames.includes(newUsername.toLowerCase()) && newUsername.toLowerCase() !== userProfile.username.toLowerCase()) {
          setSaveStatus('error');
          setTimeout(() => setSaveStatus('idle'), 2000);
          return;
        }

        updateUserProfile({ username: newUsername, bio, avatarUrl });
        updateSelectedInterests(localSelectedInterests);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
    };
    
    const inputClasses = "pl-11 pr-4 h-12 w-full text-base border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground";
    const isSaveDisabled = !username.trim();

    const isUsernameDisabled = !canChangeUsername;

    const getUsernameNote = () => {
        if (canChangeUsername || !userProfile.usernameLastChanged) {
            return t('username_change_note');
        }
        
        const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;
        const timeLeft = userProfile.usernameLastChanged + thirtyDaysInMillis - Date.now();
        const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
        
        if (daysLeft > 0) {
            return `Modifiable dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}.`;
        }
        
        return t('username_change_note');
    }
    // --- End Account View Logic ---
    
    const MainView = (
      <>
          <div className="px-4 pt-6 shrink-0">
            {isMobile && <h2 id="sheet-title" className="sr-only">{t('settings')}</h2>}
            {!isMobile && <h2 className="text-xl font-bold text-center p-4 pt-6">{t('settings')}</h2>}
          </div>
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20">
              <SettingsList onItemClick={onItemClick} />
          </div>
      </>
    );

    const LanguageView = (
        <>
            <div className="px-4 pt-6 shrink-0">
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
            <div className="flex-1 overflow-y-auto px-4 pb-4">
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
        </>
    );
    
    const HelpView = (
        <>
             <div className="px-4 pt-6 shrink-0">
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
            <div className="flex-1 overflow-y-auto px-4 pb-4">
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
        </>
    );

    const SecurityView = (
        <>
             <div className="px-4 pt-6 shrink-0">
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
            <div className="flex-1 overflow-y-auto px-4 pb-4">
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
        </>
    );

    const AccountView = (
         <div className="flex flex-col h-full">
            <ImageCropper 
              imageSrc={imageToCrop}
              onCropComplete={onCropComplete}
              onClose={() => setImageToCrop(null)}
            />
            <div className="px-4 pt-6 shrink-0">
                <div className="flex items-center justify-center relative mb-2">
                    <button onClick={() => setView('main')} className="absolute left-0 p-2 -ml-2 text-muted-foreground">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold text-center">{t('account_settings')}</h1>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-8">
                 <div className="flex flex-col items-center w-full max-w-sm mx-auto pt-8">
                    <div className="relative mb-6">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <Avatar className="h-24 w-24 bg-foreground dark:bg-white">
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt={t('user_profile')} style={{ objectFit: 'cover' }} />
                        ) : (
                          <AvatarFallback className="bg-transparent">
                            <UserIcon className="h-10 w-10 text-background dark:text-black" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Button onClick={() => fileInputRef.current?.click()} size="icon" className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground w-8 h-8 border-2 border-background hover:bg-primary/90">
                        <Plus className="h-5 w-5" strokeWidth={3} />
                      </Button>
                    </div>

                    <div className="w-full space-y-4 mb-8">
                      <div>
                        <div className="relative w-full">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">N</span>
                          <Input
                            type="text"
                            placeholder={t('username_placeholder')}
                            value={username}
                            onChange={handleUsernameChange}
                            className={cn(inputClasses, 'bg-secondary')}
                            disabled={isUsernameDisabled}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-right w-full pr-4 pt-1">{getUsernameNote()}</p>
                      </div>
                      <div>
                        <div className="relative w-full">
                          <span className="absolute left-4 top-[24px] -translate-y-1/2 text-sm font-bold text-muted-foreground">B</span>
                          <Textarea
                            placeholder={t('bio_placeholder')}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.preventDefault();
                            }}
                            className={cn(inputClasses, "h-24 rounded-[30px] py-3.5 leading-snug resize-none", 'bg-secondary')}
                            maxLength={80}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-right w-full pr-4 pt-1">
                          {bio.length} / 80
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full mb-8">
                        <p className="text-muted-foreground text-center mb-4 text-sm">{t('select_5_interests')}</p>
                        <div className="flex flex-wrap justify-center gap-2">
                           {interestKeys.map((interestKey) => {
                                const translatedInterest = t(interestKey);
                                return (
                                  <Button
                                    key={interestKey}
                                    variant={localSelectedInterests.includes(translatedInterest) ? 'default' : 'secondary'}
                                    onClick={() => toggleInterest(translatedInterest)}
                                    className="rounded-full h-9 px-4 text-xs sm:h-10 sm:px-5 sm:text-sm font-semibold transition-all duration-200"
                                  >
                                    {translatedInterest}
                                  </Button>
                                );
                           })}
                        </div>
                    </div>
                    <div className="w-full max-w-[16rem] mx-auto pb-4">
                        <Button
                            onClick={handleSave}
                            disabled={isSaveDisabled || saveStatus !== 'idle'}
                            className={cn(
                                "rounded-full w-full h-12 text-lg font-semibold transition-colors duration-300",
                                // Default enabled state
                                "bg-foreground text-background hover:bg-foreground/90",
                                // Default disabled state (e.g., empty username)
                                "disabled:bg-muted disabled:text-muted-foreground",
                                // Success state override
                                saveStatus === 'success' && "disabled:bg-green-700 disabled:text-white",
                                // Error state override
                                saveStatus === 'error' && "disabled:bg-red-600 disabled:text-white",
                                // Make sure opacity is full in all disabled states
                                "disabled:opacity-100"
                            )}
                        >
                            {saveStatus === 'success' ? 'Enregistré !' : saveStatus === 'error' ? t('error') : t('save')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    const SettingsContent = (
      <div 
          className={cn(
              "h-full flex flex-col",
              "transition-opacity", 
              isContentVisible ? "opacity-100 duration-300" : "opacity-0 duration-[800ms]"
          )} 
      >
          <div className={cn(
              "flex w-[200%] h-full",
              "transition-transform duration-500 ease-in-out",
              view !== 'main' ? "-translate-x-1/2" : "translate-x-0"
          )}>
              <div className="w-1/2 h-full flex flex-col">{MainView}</div>
              <div className="w-1/2 h-full flex flex-col relative">
                  {view === 'language' && LanguageView}
                  {view === 'help' && HelpView}
                  {view === 'security' && SecurityView}
                  {view === 'account' && AccountView}
              </div>
          </div>
      </div>
    );
    
    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="rounded-t-[50px] h-[70vh] flex flex-col bg-background border-0 p-0">
                    <DrawerTitle className="sr-only">{t('settings')}</DrawerTitle>
                    {SettingsContent}
                </DrawerContent>
            </Drawer>
        );
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full p-0 bg-transparent border-none shadow-xl">
                 <UIDialogTitle className="sr-only">{t('settings')}</UIDialogTitle>
                 <div className="h-[70vh] flex flex-col bg-background rounded-[50px] overflow-hidden relative">
                    {SettingsContent}
                 </div>
            </DialogContent>
        </Dialog>
    );
}
