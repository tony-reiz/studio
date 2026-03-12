'use client';

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { BusinessPlanContent } from "./business-plan-content";
import { ReactNode, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useEbooks } from "@/context/ebook-provider";

interface BusinessPlanSheetProps {
    children: ReactNode;
}

export function BusinessPlanSheet({ children }: BusinessPlanSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const { t } = useEbooks();

  useEffect(() => {
    let contentTimer: NodeJS.Timeout;
    if (isOpen) {
      setIsContentVisible(false);
      contentTimer = setTimeout(() => {
        setIsContentVisible(true);
      }, 700);
    }
    return () => clearTimeout(contentTimer);
  }, [isOpen]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="rounded-t-[40px] max-h-[85vh] flex flex-col bg-background p-4 pt-4 border-0">
        <DrawerTitle className="sr-only">{t('business_model')}</DrawerTitle>
        
        <div className={cn("overflow-y-auto -mx-4 px-4 pt-4 transition-opacity duration-300", isContentVisible ? "opacity-100" : "opacity-0")}>
          <div className="max-w-4xl mx-auto pb-8">
            <h1 className="text-2xl font-bold mb-4 text-center">{t('business_model')}</h1>
            <BusinessPlanContent />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
