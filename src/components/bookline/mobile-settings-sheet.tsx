'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ReactNode } from "react";
import { SettingsList } from "./settings-list";

interface MobileSettingsSheetProps {
    children: ReactNode;
}

export function MobileSettingsSheet({ children }: MobileSettingsSheetProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="rounded-t-[50px] max-h-[80vh] flex flex-col bg-background p-4 border-0">
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/50 mb-4" />
        <DrawerHeader className="text-center pb-4 p-0">
          <DrawerTitle>Paramètres</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto -mx-4 px-4">
            <SettingsList />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
