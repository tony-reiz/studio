'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TermsSheet } from '@/components/bookline/terms-sheet';
import { PrivacySheet } from '@/components/bookline/privacy-sheet';

// SVG for Google Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.658-3.301-11.288-7.913l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.638,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);


export default function AuthPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsClient(true);
  }, []);
  
  const handleNavigate = (path: string) => {
    setIsMounted(false); // Trigger fade-out animation
    setTimeout(() => {
      router.push(path);
    }, 500); // Match animation duration
  };

  const AuthButton = ({ icon, children, delay, onClick }: { icon: React.ReactNode, children: React.ReactNode, delay: number, onClick?: () => void }) => (
    <Button
      onClick={onClick}
      className={cn(
        "w-full h-14 rounded-full bg-secondary border-0 text-foreground text-lg font-semibold flex items-center justify-center gap-3 transition-all duration-700 ease-out hover:bg-secondary/80",
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {icon}
      {children}
    </Button>
  );

  return (
    <div className={cn("flex flex-col min-h-screen bg-background text-foreground transition-opacity duration-500 ease-in-out", isMounted ? "opacity-100" : "opacity-0")}>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/5 via-background to-secondary/10 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />

      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-[18rem] sm:max-w-sm w-full space-y-8">
            <div className='overflow-hidden py-2'>
                <h1 className={cn(
                    "text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 transition-transform duration-700 ease-out",
                    isMounted ? "translate-y-0" : "translate-y-full"
                )}>
                    Rejoignez BookLine
                </h1>
            </div>
            
            <div className={cn(
                "w-full space-y-4 transition-all duration-700 ease-out",
                isMounted ? "opacity-100" : "opacity-0"
            )}>
              <AuthButton delay={200} icon={<GoogleIcon className="w-6 h-6" />} onClick={() => handleNavigate('/auth/create-profile')}>Continuer avec Google</AuthButton>
              <AuthButton delay={300} icon={<Mail className="w-6 h-6" />} onClick={() => handleNavigate('/auth/create-profile')}>Continuer avec l'email</AuthButton>
            </div>
          
            <div 
                className={cn(
                    "transition-all duration-700 ease-out",
                    isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={{ transitionDelay: '400ms' }}
            >
              <p className="text-xs text-muted-foreground">
                En continuant, vous acceptez nos{' '}
                {isClient && isMobile ? (
                  <TermsSheet>
                    <button className="underline hover:text-foreground">Conditions d'utilisation</button>
                  </TermsSheet>
                ) : (
                  <a href="/terms" className="underline hover:text-foreground">Conditions d'utilisation</a>
                )}
                {' '}et notre{' '}
                {isClient && isMobile ? (
                  <PrivacySheet>
                    <button className="underline hover:text-foreground">Politique de confidentialité</button>
                  </PrivacySheet>
                ) : (
                  <a href="/privacy" className="underline hover:text-foreground">Politique de confidentialité</a>
                )}.
              </p>
            </div>

            <Button
                variant="link"
                className={cn(
                    "text-muted-foreground transition-all duration-700 ease-out hover:text-foreground",
                    isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={{ transitionDelay: '500ms' }}
                onClick={() => handleNavigate('/home')}
            >
                Continuer sans compte <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </main>
    </div>
  );
}
