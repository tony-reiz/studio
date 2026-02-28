'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function CreateProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://picsum.photos/seed/new-user-profile/200');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNavigate = (path: string) => {
    setIsMounted(false);
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  const handleSaveProfile = () => {
    // In a real app, this would save the profile data
    console.log({ username, bio, avatarUrl });
    handleNavigate('/home');
  };
  
  const handleAvatarChange = () => {
    // In a real app, this would open a file picker
    console.log("Change avatar clicked");
    // For demo, let's just change the picture
    setAvatarUrl(`https://picsum.photos/seed/${Math.random()}/200`)
  }

  return (
    <div className={cn("flex flex-col min-h-screen bg-background text-foreground transition-opacity duration-300 ease-in-out", isMounted ? "opacity-100" : "opacity-0")}>
       <main className="flex-1 w-full flex flex-col items-center justify-center pb-8 px-4">
          <div className="flex flex-col items-center w-full max-w-sm">
            <h1 className="text-3xl font-bold mb-8 text-center whitespace-nowrap">Finalisez votre inscription</h1>
            
            <div className="relative mb-6">
              <Avatar className="h-32 w-32 bg-foreground">
                <AvatarImage src={avatarUrl} alt="Photo de profil de l'utilisateur" />
                <AvatarFallback className="bg-transparent">
                  <User className="h-20 w-20 text-background" />
                </AvatarFallback>
              </Avatar>
              <Button onClick={handleAvatarChange} size="icon" className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground w-10 h-10 border-4 border-background hover:bg-primary/90">
                <Camera className="h-5 w-5" />
              </Button>
            </div>

            <div className="w-full space-y-4 mb-8">
              <Input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 text-base bg-secondary border-0 rounded-full text-center focus-visible:ring-primary"
              />
              <Textarea
                placeholder="Biographie (optionnel)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="h-24 text-base bg-secondary border-0 rounded-3xl text-center py-3.5 resize-none focus-visible:ring-primary"
              />
            </div>
            
            <Button 
                onClick={handleSaveProfile}
                disabled={!username.trim()}
                className="bg-foreground text-background rounded-full w-full h-12 text-lg font-semibold hover:bg-foreground/90 disabled:bg-[#DFDFDF] disabled:text-muted-foreground"
            >
              Enregistrer et continuer
            </Button>
          </div>
        </main>
    </div>
  );
}
