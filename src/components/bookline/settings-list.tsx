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
} from 'lucide-react';

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
  return (
    <ul className="w-full space-y-2">
      {settingsItems.map((item) => (
        <li key={item.label}>
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
  );
}
