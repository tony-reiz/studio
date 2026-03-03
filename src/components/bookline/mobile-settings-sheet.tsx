'use client';

import { type ReactNode } from "react";
import { SettingsList } from "./settings-list";
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

interface MobileSettingsSheetProps {
    children: ReactNode;
}

export function MobileSettingsSheet({ children }: MobileSettingsSheetProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="rounded-t-[50px] max-h-[70vh] flex flex-col bg-background p-4 border-0">
        <DrawerTitle className="sr-only">Paramètres</DrawerTitle>
        <div className="mx-auto w-20 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/50 mb-4" />
        <div className="overflow-y-auto -mx-4 px-4">
            <SettingsList />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
