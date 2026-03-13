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
            title: "1. Importez votre PDF",
            description: "Notre système optimise votre fichier pour une expérience de lecture parfaite, sans altérer la qualité."
        },
        {
            icon: Edit,
            title: "2. Décrivez votre oeuvre",
            description: "Ajoutez un titre percutant, une description qui captive et des mots-clés pertinents pour être trouvé facilement."
        },
        {
            icon: Euro,
            title: "3. Fixez votre prix",
            description: "Vous décidez de la valeur de votre travail. N'oubliez pas que nous prenons une commission fixe de 3€ par vente."
        },
        {
            icon: Tag,
            title: "4. Publiez et Vendez !",
            description: "Votre ebook est maintenant disponible pour des milliers de lecteurs. Suivez vos ventes depuis votre tableau de bord."
        }
    ];

    return (
        <div className="p-4 md:p-6">
            {contentType === 'guide' && (
                 <>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold">Comment Vendre sur BookLine</h3>
                        <p className="text-muted-foreground">De l'idée à la vente, en quelques étapes simples.</p>
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
                        <h3 className="text-2xl font-bold">Gagnez Plus avec le Parrainage</h3>
                        <p className="text-muted-foreground">Invitez des vendeurs et créez une source de revenus passive.</p>
                    </div>
                    <div className="my-8 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                <Users className="w-6 h-6 text-foreground" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Pour le Parrain</h4>
                                <p className="text-sm text-muted-foreground">Gagnez <strong>1€</strong> chaque fois que le total des ventes de vos filleuls atteint un multiple de 3.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                <Gift className="w-6 h-6 text-foreground" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Pour le Filleul</h4>
                                <p className="text-sm text-muted-foreground">Votre filleul gagne aussi <strong>1€</strong> toutes les 3 ventes qu'il réalise lui-même.</p>
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
        <div className="p-4 md:p-6 border-t bg-background shrink-0">
            <Button className="w-full rounded-full font-semibold text-lg h-12 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 focus-visible:ring-0 focus-visible:ring-offset-0">
                Commencer à vendre
            </Button>
        </div>
    );

    const dialogTitle = contentType === 'guide' ? "Comment Vendre sur BookLine" : "Gagnez Plus avec le Parrainage";
    const dialogDescription = contentType === 'guide' ? "De l'idée à la vente, en quelques étapes simples." : "Invitez des vendeurs et créez une source de revenus passive.";


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
