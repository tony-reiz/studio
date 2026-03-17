'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle as DrawerTitlePrimitive, DrawerHeader } from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { useEbooks } from '@/context/ebook-provider';
import { useToast } from '@/hooks/use-toast';

interface InvoicesModalProps {
    children: ReactNode;
}

function InvoicesContent() {
    const { t } = useEbooks();
    const { toast } = useToast();

    const handleDownload = (month: string) => {
        toast({
            title: t('simulated_download'),
            description: t('download_would_start_for').replace('{month}', month),
        });
    };

    const invoiceMonths = [
        "Juillet 2026",
        "Juin 2026",
        "Mai 2026",
        "Avril 2026",
        "Mars 2026",
        "Février 2026",
        "Janvier 2026",
    ];

    return (
        <div className="p-4 md:p-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold">{t('invoices')}</h3>
                <p className="text-muted-foreground">{t('monthly_statements')}</p>
            </div>
            <ul className="my-8 space-y-3">
                {invoiceMonths.map((month) => (
                    <li key={month} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold">{month}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(month)} aria-label={`Télécharger la facture pour ${month}`}>
                            <Download className="h-5 w-5" />
                        </Button>
                    </li>
                ))}
            </ul>
            <div className="text-xs text-muted-foreground text-center p-4 bg-secondary rounded-lg">
                <p><strong>{t('note')}:</strong> {t('simulation_disclaimer')}</p>
            </div>
        </div>
    );
}

export function InvoicesModal({ children }: InvoicesModalProps) {
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

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild onClick={handleTriggerClick}>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="rounded-t-[40px] max-h-[75vh] flex flex-col bg-background border-0 p-0">
                    <DrawerHeader className="p-4 pt-4 text-left">
                        <DrawerTitlePrimitive className="sr-only">{t('invoices')}</DrawerTitlePrimitive>
                    </DrawerHeader>
                    <div className="overflow-y-auto">
                        <InvoicesContent />
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
            <DialogContent className="max-w-md w-full p-0 bg-background border-0 rounded-[40px] shadow-2xl">
                 <DialogTitle className="sr-only">{t('invoices')}</DialogTitle>
                 <InvoicesContent />
            </DialogContent>
        </Dialog>
    );
}
