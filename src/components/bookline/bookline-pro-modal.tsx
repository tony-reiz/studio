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
import { BadgeCheck, Zap, Rocket } from 'lucide-react';

interface BooklineProModalProps {
    children: ReactNode;
}

function ProContent() {
    const features = [
        {
            icon: BadgeCheck,
            title: "Badge Vendeur Certifié",
            description: "Affichez un badge 'Certifié' sur votre profil pour rassurer les acheteurs et augmenter votre crédibilité."
        },
        {
            icon: Rocket,
            title: "Placement Prioritaire",
            description: "Vos ebooks sont mis en avant dans les résultats de recherche et les recommandations pour une visibilité maximale."
        },
        {
            icon: Zap,
            title: "Zéro Publicité",
            description: "Profitez d'une expérience de publication plus rapide et sans interruption, sans aucune publicité obligatoire."
        }
    ];

    return (
        <div className="p-4 md:p-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold">BookLine Pro</h3>
                <p className="text-muted-foreground">Passez au niveau supérieur.</p>
            </div>
            <div className="my-8 space-y-6">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <feature.icon className="w-6 h-6 text-foreground" />
                        </div>
                        <div>
                            <h4 className="font-semibold">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-8">
                <p className="text-4xl font-extrabold">10€<span className="text-base font-normal text-muted-foreground">/mois</span></p>
            </div>
            <Button className="w-full mt-6 rounded-full font-semibold text-lg h-12 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                Passer à Pro
            </Button>
        </div>
    );
}


export function BooklineProModal({ children }: BooklineProModalProps) {
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

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild onClick={handleTriggerClick}>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="rounded-t-[60px] max-h-[75vh] flex flex-col bg-background border-0 p-0">
                    <DrawerHeader className="p-4 pt-4 text-left">
                        <DrawerTitlePrimitive className="sr-only">BookLine Pro</DrawerTitlePrimitive>
                        <DrawerDescriptionPrimitive className="sr-only">Passez au niveau supérieur avec BookLine Pro.</DrawerDescriptionPrimitive>
                    </DrawerHeader>
                    <div className="overflow-y-auto">
                        <ProContent />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild onClick={handleTriggerClick}>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-md w-full p-0 bg-background border-0 rounded-[60px] shadow-2xl">
                 <DialogTitle className="sr-only">BookLine Pro</DialogTitle>
                 <DialogDescription className="sr-only">Passez au niveau supérieur avec BookLine Pro.</DialogDescription>
                 <ProContent />
            </DialogContent>
        </Dialog>
    );
}
