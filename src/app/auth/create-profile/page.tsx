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
import { ImageCropper } from '@/components/bookline/image-cropper';

export default function CreateProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateUserProfile, userProfile, t, theme } = useEbooks();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    if (userProfile.username !== 'utilisateur' && userProfile.username !== 'user') {
      setUsername(userProfile.username);
    }
    if (userProfile.bio) {
        setBio(userProfile.bio);
    }
    if (userProfile.avatarUrl) {
        setAvatarUrl(userProfile.avatarUrl);
    }
  }, [userProfile]);

  const handleNavigate = (path: string) => {
    setIsMounted(false);
    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  const handleSaveProfile = () => {
    const existingUsernames = ['admin', 'bookline', 'kaizer'];
    const newUsername = username.trim();

    if (!newUsername) return;

    if (existingUsernames.includes(newUsername.toLowerCase())) {
      toast({
        variant: "destructive",
        title: t('username_not_available'),
        description: t('username_taken'),
      });
      return;
    }

    updateUserProfile({ username: newUsername, bio, avatarUrl });
    handleNavigate('/auth/interests');
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
        e.target.value = "";
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
  
  const onCropComplete = (croppedImageUrl: string) => {
    setAvatarUrl(croppedImageUrl);
  };

  const inputClasses = "pl-11 pr-4 h-12 w-full text-base border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground";
  const isSaveDisabled = !username.trim();

  return (
    <div className={cn("flex flex-col min-h-screen bg-background text-foreground transition-opacity duration-500 ease-in-out", isMounted ? "opacity-100" : "opacity-0")}>
       <ImageCropper 
         imageSrc={imageToCrop}
         onCropComplete={onCropComplete}
         onClose={() => setImageToCrop(null)}
       />
       <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="w-full py-6">
            <div className="flex flex-col items-start">
              <div>
                <p className="text-[24px] font-bold tracking-widest text-foreground">{t('finalize')}</p>
                <h1 className="text-[46px] sm:text-[58px] font-extrabold -mt-4 bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent bg-[200%_auto] animate-shimmer">{t('registration')}</h1>
              </div>
            </div>
        </header>

       <main className="flex-1 w-full flex flex-col items-center pt-28 md:pt-40 pb-28">
          <div className="flex flex-col items-center w-full max-w-[18rem] sm:max-w-sm">
            <div className="relative mb-6 animate-float">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
              <Avatar className="h-32 w-32 bg-foreground dark:bg-white">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Photo de profil de l'utilisateur" style={{ objectFit: 'cover' }} />
                ) : (
                  <AvatarFallback className="bg-transparent">
                    <User className="h-12 w-12 text-background dark:text-black mt-3" />
                  </AvatarFallback>
                )}
              </Avatar>
              <Button onClick={handlePlusClick} size="icon" className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground w-10 h-10 border-4 border-background hover:bg-primary/90 animate-pulse-strong">
                <Plus className="h-6 w-6" strokeWidth={3} />
              </Button>
            </div>

            <div className="w-full space-y-4 mb-8">
              <div className="relative w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">N</span>
                <Input
                  type="text"
                  placeholder={t('username_placeholder')}
                  value={username}
                  onChange={handleUsernameChange}
                  className={cn(inputClasses, "bg-muted")}
                />
              </div>
              <div>
                <div className="relative w-full">
                  <span className="absolute left-4 top-[24px] -translate-y-1/2 text-sm font-bold text-muted-foreground">B</span>
                  <Textarea
                    placeholder={t('bio_placeholder')}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    className={cn(inputClasses, "h-24 rounded-[30px] py-3.5 leading-snug resize-none", "bg-muted")}
                    maxLength={80}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right w-full pr-4 pt-1">
                  {bio.length} / 80
                </p>
              </div>
            </div>
          </div>
        </main>
       </div>
       <div className="fixed bottom-12 left-0 right-0 p-4 md:bottom-8">
        <div className="w-full max-w-[16rem] mx-auto">
            <Button 
                onClick={handleSaveProfile}
                disabled={isSaveDisabled}
                className={cn(
                    "bg-foreground text-background rounded-full w-full h-12 text-lg font-semibold hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground",
                    !isSaveDisabled && "animate-pulse-subtle"
                )}
            >
                {t('save')}
            </Button>
        </div>
      </div>
    </div>
  );
}
