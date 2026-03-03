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
  Bell,
  ShieldCheck,
  Trash2,
  SunMoon,
} from 'lucide-react';
import { useEbooks } from '@/context/ebook-provider';
import { cn } from '@/lib/utils';

const settingsItems = [
  { icon: User, label: 'Paramètres du compte' },
  { icon: Bell, label: 'Notifications' },
  { icon: ShieldCheck, label: 'Sécurité' },
  { icon: Languages, label: 'Langue' },
  { icon: CircleDollarSign, label: 'Devise' },
  { icon: Landmark, label: 'Virement' },
  { icon: Receipt, label: 'Factures' },
  { icon: HelpCircle, label: 'Aide' },
  { icon: Trash2, label: 'Supprimer mon compte', isDestructive: true },
  { icon: LogOut, label: 'Déconnexion', isDestructive: true },
];

export function SettingsList() {
  const { theme, setTheme } = useEbooks();

  return (
    <ul className="w-full space-y-2">
      {settingsItems.slice(0, 3).map((item) => (
        <li key={item.label}>
          <button className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors">
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

      <li>
        <div className="w-full rounded-full flex items-center justify-between p-4 text-left">
          <div className="flex items-center gap-4">
            <SunMoon className="h-6 w-6 text-muted-foreground" />
            <span className="font-semibold text-foreground">Thème</span>
          </div>
          <div className="flex items-center bg-secondary p-1 rounded-full">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                'px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-200',
                theme === 'light' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Clair
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                'px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-200',
                theme === 'dark' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Sombre
            </button>
          </div>
        </div>
      </li>

      {settingsItems.slice(3).map((item) => (
        <li key={item.label}>
          <button className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors">
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
  );
}
