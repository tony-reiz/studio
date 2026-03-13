'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle as DrawerTitlePrimitive,
  DrawerHeader,
  DrawerDescription as DrawerDescriptionPrimitive,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { UploadCloud, Edit, Tag, Euro, Users, Gift } from 'lucide-react';
import { useEbooks } from '@/context/ebook-provider';

interface PublishingGuideModalProps {
    children: ReactNode;
    contentType: 'guide' | 'referral';
}

function GuideContent({ contentType }: { contentType: 'guide' | 'referral' }) {
    const { t } = useEbooks();

    const steps = [
        {
            icon: UploadCloud,
            title: t('guide_step1_title'),
            description: t('guide_step1_desc')
        },
        {
            icon: Edit,
            title: t('guide_step2_title'),
            description: t('guide_step2_desc')
        },
        {
            icon: Euro,
            title: t('guide_step3_title'),
            description: t('guide_step3_desc')
        },
        {
            icon: Tag,
            title: t('guide_step4_title'),
            description: t('guide_step4_desc')
        }
    ];

    return (
        <div className="p-4 md:p-6">
            {contentType === 'guide' && (
                 <>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold">{t('guide_title')}</h3>
                        <p className="text-muted-foreground">{t('guide_subtitle')}</p>
                    </div>
                    <div className="my-8 space-y-6">
                        {steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                    <step.icon className="w-6 h-6 text-foreground" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{step.title}</h4>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {contentType === 'referral' && (
                <>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold">{t('referral_title')}</h3>
                        <p className="text-muted-foreground">{t('referral_subtitle')}</p>
                    </div>
                    <div className="my-8 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                <Users className="w-6 h-6 text-foreground" />
                            </div>
                            <div>
                                <h4 className="font-semibold">{t('referral_referrer_title')}</h4>
                                <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('referral_referrer_desc').replace(/<strong>(.*?)<\/strong>/g, '<strong class="font-bold text-foreground">$1</strong>') }} />
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                <Gift className="w-6 h-6 text-foreground" />
                            </div>
                            <div>
                                <h4 className="font-semibold">{t('referral_referee_title')}</h4>
                                <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('referral_referee_desc').replace(/<strong>(.*?)<\/strong>/g, '<strong class="font-bold text-foreground">$1</strong>') }} />
                            </div>
                        </div>
                    </div>
                </>
            )}
            
        </div>
    );
}

export function PublishingGuideModal({ children, contentType }: PublishingGuideModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useIsMobile();
    const [isClient, setIsClient] = useState(false);
    const { t } = useEbooks();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <>{children}</>;
    }
    
    const handleTriggerClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
    }
    
    const StickyFooterButton = () => (
        <div className="p-4 md:p-6 bg-background shrink-0">
            <Button className="w-full rounded-full font-semibold text-lg h-12 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 focus-visible:ring-0 focus-visible:ring-offset-0">
                {t('start_selling')}
            </Button>
        </div>
    );

    const dialogTitle = contentType === 'guide' ? t('guide_title') : t('referral_title');
    const dialogDescription = contentType === 'guide' ? t('guide_subtitle') : t('referral_subtitle');


    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild onClick={handleTriggerClick}>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="rounded-t-[40px] max-h-[75vh] flex flex-col bg-background border-0 p-0">
                    <DrawerHeader className="p-4 pt-4 text-left shrink-0">
                        <DrawerTitlePrimitive className="sr-only">{dialogTitle}</DrawerTitlePrimitive>
                        <DrawerDescriptionPrimitive className="sr-only">{dialogDescription}</DrawerDescriptionPrimitive>
                    </DrawerHeader>
                    <div className="flex-1 overflow-y-auto">
                        <GuideContent contentType={contentType} />
                    </div>
                    <StickyFooterButton />
                </DrawerContent>
            </Drawer>
        );
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild onClick={handleTriggerClick}>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-md w-full p-0 bg-background border-0 rounded-[40px] shadow-2xl max-h-[75vh] flex flex-col overflow-hidden">
                 <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
                 <DialogDescription className="sr-only">{dialogDescription}</DialogDescription>
                 <div className="flex-1 overflow-y-auto">
                    <GuideContent contentType={contentType} />
                 </div>
                 <StickyFooterButton />
            </DialogContent>
        </Dialog>
    );
}
