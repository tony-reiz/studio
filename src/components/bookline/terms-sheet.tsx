'use client';

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { TermsContent } from "./terms-content";
import { ReactNode } from "react";

interface TermsSheetProps {
    children: ReactNode;
}

export function TermsSheet({ children }: TermsSheetProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="rounded-t-[50px] max-h-[85vh] flex flex-col bg-background p-4 border-0">
        <DrawerTitle className="sr-only">Conditions d'Utilisation</DrawerTitle>
        
        <div className="overflow-y-auto -mx-4 px-4 pt-4">
          <div className="max-w-4xl mx-auto pb-8">
            <h1 className="text-2xl font-bold mb-4 text-center">Conditions d'Utilisation</h1>
            <TermsContent />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
