'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useEbooks } from '@/context/ebook-provider';
import { useToast } from '@/hooks/use-toast';

export default function CreateProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateUserProfile, userProfile } = useEbooks();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    if (userProfile.username !== 'utilisateur') {
      setUsername(userProfile.username);
    }
    setBio(userProfile.bio);
    setAvatarUrl(userProfile.avatarUrl);
  }, [userProfile]);

  const handleNavigate = (path: string) => {
    setIsMounted(false);
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  const handleSaveProfile = () => {
    // NOTE: This is a temporary check. A real implementation requires a database.
    const existingUsernames = ['admin', 'bookline', 'kaizer'];
    const newUsername = username.trim();

    if (!newUsername) return;

    if (existingUsernames.includes(newUsername.toLowerCase())) {
      toast({
        variant: "destructive",
        title: "Nom d'utilisateur non disponible",
        description: "Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.",
      });
      return;
    }

    if (avatarFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const newAvatarUrl = reader.result as string;
            updateUserProfile({ username: newUsername, bio, avatarUrl: newAvatarUrl });
            handleNavigate('/profile');
        };
        reader.readAsDataURL(avatarFile);
    } else {
        updateUserProfile({ username: newUsername, bio, avatarUrl });
        handleNavigate('/profile');
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const valueWithoutSpaces = value.replace(/\s/g, '');
    const truncatedValue = valueWithoutSpaces.slice(0, 10);
    setUsername(truncatedValue);
  };

  const inputClasses = "pl-11 pr-4 h-12 w-full text-base bg-secondary border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <div className={cn("flex flex-col min-h-screen bg-background text-foreground transition-opacity duration-300 ease-in-out", isMounted ? "opacity-100" : "opacity-0")}>
       <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="w-full py-6">
            <div className="flex flex-col items-start">
              <div className="-mt-1">
                <p className="text-[24px] font-bold tracking-widest text-foreground">FINALISEZ VOTRE</p>
                <h1 className="text-5xl sm:text-6xl font-extrabold text-primary -mt-1">INSCRIPTION !</h1>
              </div>
            </div>
        </header>

       <main className="flex-1 w-full flex flex-col items-center pt-8 md:pt-12 pb-8">
          <div className="flex flex-col items-center w-full max-w-sm">
            <div className="relative mb-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
              <Avatar className="h-32 w-32 bg-foreground">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Photo de profil de l'utilisateur" />
                ) : (
                  <AvatarFallback className="bg-transparent">
                    <User className="h-12 w-12 text-background" />
                  </AvatarFallback>
                )}
              </Avatar>
              <Button onClick={handlePlusClick} size="icon" className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground w-10 h-10 border-4 border-background hover:bg-primary/90">
                <Plus className="h-6 w-6" strokeWidth={3} />
              </Button>
            </div>

            <div className="w-full space-y-4 mb-8">
              <div className="relative w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">N</span>
                <Input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={handleUsernameChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <div className="relative w-full">
                  <span className="absolute left-4 top-[24px] -translate-y-1/2 text-sm font-bold text-muted-foreground">B</span>
                  <Textarea
                    placeholder="Biographie (optionnel)"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    className={cn(inputClasses, "h-24 rounded-[30px] py-3.5 leading-snug resize-none")}
                    maxLength={80}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right w-full pr-4 pt-1">
                  {bio.length} / 80
                </p>
              </div>
            </div>
            
            <div className="w-full max-w-[16rem]">
              <Button 
                  onClick={handleSaveProfile}
                  disabled={!username.trim()}
                  className="bg-foreground text-background rounded-full w-full h-12 text-lg font-semibold hover:bg-foreground/90 disabled:bg-[#DFDFDF] disabled:text-muted-foreground"
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </main>
       </div>
    </div>
  );
}
