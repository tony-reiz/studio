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
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useState, useEffect } from 'react';

interface SettingsListProps {
  onMobileItemClick?: (id: string) => void;
}

const settingsItems: Array<{
    icon: React.ElementType;
    label: string;
    href?: string;
    isDestructive?: boolean;
    id?: string;
}> = [
  { icon: User, label: 'Paramètres du compte' },
  { icon: Bell, label: 'Notifications' },
  { icon: ShieldCheck, label: 'Sécurité' },
  { icon: Languages, label: 'Langue', href: '/settings/language', id: 'language' },
  { icon: CircleDollarSign, label: 'Devise' },
  { icon: Landmark, label: 'Virement' },
  { icon: Receipt, label: 'Factures' },
  { icon: HelpCircle, label: 'Aide' },
  { icon: Trash2, label: 'Supprimer mon compte', isDestructive: true },
  { icon: LogOut, label: 'Déconnexion', isDestructive: true },
];

export function SettingsList({ onMobileItemClick }: SettingsListProps) {
  const { theme, setTheme } = useEbooks();
  const { handleNavigate } = useTransitionRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const handleItemClick = (item: (typeof settingsItems)[0]) => {
    if (item.id && isClient && onMobileItemClick) {
      onMobileItemClick(item.id);
    } else if (item.href) {
      handleNavigate(item.href);
    }
  };

  const isDark = theme === 'dark';

  return (
    <>
        <ul className="w-full space-y-2">
        {settingsItems.slice(0, 3).map((item) => (
            <li key={item.label}>
            <button
                onClick={() => handleItemClick(item)}
                className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors"
            >
                <div className="flex items-center gap-4">
                <item.icon className={`h-6 w-6 ${item.isDestructive ? 'text-destructive' : 'text-muted-foreground'}`} />
                <span className={`font-semibold ${item.isDestructive ? 'text-destructive' : 'text-foreground'}`}>
                    {item.label}
                </span>
                </div>
                {!item.isDestructive && (item.href || (item.id && onMobileItemClick)) && <ChevronRight className="h-6 w-6 text-muted-foreground" />}
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
            <button
                onClick={() => handleItemClick(item)}
                className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors"
            >
                <div className="flex items-center gap-4">
                <item.icon className={`h-6 w-6 ${item.isDestructive ? 'text-destructive' : 'text-muted-foreground'}`} />
                <span className={`font-semibold ${item.isDestructive ? 'text-destructive' : 'text-foreground'}`}>
                    {item.label}
                </span>
                </div>
                {!item.isDestructive && (item.href || (item.id && onMobileItemClick)) && <ChevronRight className="h-6 w-6 text-muted-foreground" />}
            </button>
            </li>
        ))}
        </ul>
    </>
  );
}
