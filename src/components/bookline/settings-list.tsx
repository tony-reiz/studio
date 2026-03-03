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
  Sun,
  Moon,
} from 'lucide-react';
import { useEbooks } from '@/context/ebook-provider';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

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

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';

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
            {isDark ? (
              <Moon className="h-6 w-6 text-muted-foreground" />
            ) : (
              <Sun className="h-6 w-6 text-muted-foreground" />
            )}
            <label htmlFor="theme-switch" className="font-semibold text-foreground cursor-pointer">
              Thème
            </label>
          </div>
          <Switch
            id="theme-switch"
            checked={isDark}
            onCheckedChange={handleThemeChange}
            aria-label="Changer le thème"
          />
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
