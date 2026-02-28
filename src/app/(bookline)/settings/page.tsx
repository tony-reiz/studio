'use client';

import {
  User,
  Languages,
  CircleDollarSign,
  Landmark,
  Receipt,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';

const settingsItems = [
  { icon: User, label: 'Paramètres du compte' },
  { icon: Bell, label: 'Notifications' },
  { icon: ShieldCheck, label: 'Sécurité' },
  { icon: Languages, label: 'Langue' },
  { icon: CircleDollarSign, label: 'Devise' },
  { icon: Landmark, label: 'Virement' },
  { icon: Receipt, label: 'Factures' },
  { icon: HelpCircle, label: 'Aide' },
  { icon: LogOut, label: 'Déconnexion', isDestructive: true },
];

export default function SettingsPage() {
  const { handleBack } = useTransitionRouter();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full max-w-screen-md mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between w-full py-6">
          <Button onClick={handleBack} variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11">
            <ChevronLeft className="h-6 w-6" />
          </Button>
           <h1 className="text-2xl font-bold">Paramètres</h1>
          <div className="w-11"></div> {/* Placeholder for spacing */}
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-8 pb-28 gap-2">
          <div className="w-full">
            <ul className="w-full space-y-2">
              {settingsItems.map((item, index) => (
                <li key={index}>
                  <button className="w-full bg-secondary rounded-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors">
                    <div className="flex items-center gap-4">
                      <item.icon className={`h-6 w-6 ${item.isDestructive ? 'text-destructive' : 'text-muted-foreground'}`} />
                      <span className={`font-semibold ${item.isDestructive ? 'text-destructive' : 'text-foreground'}`}>
                        {item.label}
                      </span>
                    </div>
                    {!item.isDestructive && <ChevronRight className="h-6 w-6 text-muted-foreground" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
