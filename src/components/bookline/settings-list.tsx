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
import { useIsMobile } from '@/hooks/use-mobile';

interface SettingsItem {
  icon: React.ElementType;
  labelKey: keyof ReturnType<typeof useEbooks>['t'];
  href?: string;
  isDestructive?: boolean;
  id?: string;
}

const settingsItems: SettingsItem[] = [
  { icon: User, labelKey: 'account_settings', id: 'account' },
  { icon: Bell, labelKey: 'notifications', href: '/settings/notifications', id: 'notifications' },
  { icon: ShieldCheck, labelKey: 'security', href: '/settings/security', id: 'security' },
  { icon: Languages, labelKey: 'language', href: '/settings/language', id: 'language' },
  { icon: CircleDollarSign, labelKey: 'currency', href: '/settings/currency', id: 'currency' },
  { icon: Landmark, labelKey: 'transfer', href: '/settings/transfer', id: 'transfer' },
  { icon: Receipt, labelKey: 'history', href: '/settings/invoices', id: 'invoices' },
  { icon: HelpCircle, labelKey: 'help', href: '/settings/help', id: 'help' },
  { icon: Trash2, labelKey: 'delete_account', isDestructive: true },
  { icon: LogOut, labelKey: 'logout', isDestructive: true },
];

interface SettingsListProps {
  onItemClick?: (id: string) => void;
}

export function SettingsList({ onItemClick }: SettingsListProps) {
  const { theme, setTheme, t } = useEbooks();
  const { handleNavigate } = useTransitionRouter();
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const handleItemClick = (item: SettingsItem) => {
    if (item.id && isClient && onItemClick) {
      onItemClick(item.id);
    } else if (item.href && (!isMobile || !onItemClick)) {
      handleNavigate(item.href);
    }
  };

  const isDark = theme === 'dark';

  return (
    <>
      <ul className="w-full space-y-2">
        {settingsItems.slice(0, 3).map((item) => (
          <li key={item.labelKey}>
            <button
              onClick={() => handleItemClick(item)}
              className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-4">
                <item.icon className={`h-6 w-6 ${item.isDestructive ? 'text-destructive' : 'text-muted-foreground'}`} />
                <span className={`font-semibold ${item.isDestructive ? 'text-destructive' : 'text-foreground'}`}>
                  {t(item.labelKey)}
                </span>
              </div>
              {!item.isDestructive && (item.href || (item.id && onItemClick)) && <ChevronRight className="h-6 w-6 text-muted-foreground" />}
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
                {t('theme')}
              </label>
            </div>
            <Switch
              id="theme-switch"
              checked={isDark}
              onCheckedChange={handleThemeChange}
              aria-label={t('change_theme')}
            />
          </div>
        </li>

        {settingsItems.slice(3).map((item) => (
          <li key={item.labelKey}>
            <button
              onClick={() => handleItemClick(item)}
              className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-4">
                <item.icon className={`h-6 w-6 ${item.isDestructive ? 'text-destructive' : 'text-muted-foreground'}`} />
                <span className={`font-semibold ${item.isDestructive ? 'text-destructive' : 'text-foreground'}`}>
                  {t(item.labelKey)}
                </span>
              </div>
              {!item.isDestructive && (item.href || (item.id && onItemClick)) && <ChevronRight className="h-6 w-6 text-muted-foreground" />}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
