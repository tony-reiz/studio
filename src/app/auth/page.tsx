'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';

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

// SVG for Apple Icon
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        {...props}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
    >
        <path d="M19.39,14.89a5.3,5.3,0,0,1-2.18,4.3,5.09,5.09,0,0,1-3.23,1.3,4.38,4.38,0,0,1-1.6-.29,4.64,4.64,0,0,1-1.63-1,5.6,5.6,0,0,1-1.28-1.54,20.06,20.06,0,0,1-2-5.73,7.5,7.5,0,0,1,3.44-6.43,4.62,4.62,0,0,1,3-1.12,4.4,4.4,0,0,1,2.52.82,1.37,1.37,0,0,0,1.82-.16,1.4,1.4,0,0,0,.28-1.87,8.8,8.8,0,0,0-2-.89,7.1,7.1,0,0,0-3.32-.47,7.84,7.84,0,0,0-5.83,2.69,9.45,9.45,0,0,0-3.1,7.74c0,3.33,1.38,6.4,3.13,8.42a5.77,5.77,0,0,0,4.29,2,5.2,5.2,0,0,0,1.7-.27,4.84,4.84,0,0,0,1.86-1.1,1.36,1.36,0,0,0-.11-1.89,1.3,1.3,0,0,0-1.78.1,3.32,3.32,0,0,1-2.92,1.25,3.32,3.32,0,0,1-2.31-4.08,1.41,1.41,0,0,0,0-2,1.35,1.35,0,0,0,1.87-.27,11.3,11.3,0,0,0,1.52,1.8,4.8,4.8,0,0,0,3,1.61,4.55,4.55,0,0,0,1.64-.29,2.52,2.52,0,0,0-1.07-4.63,1.36,1.36,0,0,0-1.39,1.33h-2.1a3.15,3.15,0,0,1,1.4-2.82,2.94,2.94,0,0,1,2.15-.65,2.83,2.83,0,0,1,2.27,1,3.15,3.15,0,0,1,1,2.3,4.63,4.63,0,0,1-1.89,3.71M15.4,4.84A4.3,4.3,0,0,1,14.65,3a4.5,4.5,0,0,1-1.88-1.17,4.71,4.71,0,0,0-3.2,1.49,4.43,4.43,0,0,0-1.42,3.23,4.21,4.21,0,0,0,1.22,3,4.32,4.32,0,0,0,3.22,1.41,4.3,4.3,0,0,0,3.23-1.49,1.38,1.38,0,0,0,.08-1.9,1.4,1.4,0,0,0-1.88-.07Z"/>
    </svg>
);


export default function AuthPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleNavigate = (path: string) => {
    setIsMounted(false); // Trigger fade-out animation
    setTimeout(() => {
      router.push(path);
    }, 500); // Match animation duration
  };

  const AuthButton = ({ icon, children, delay }: { icon: React.ReactNode, children: React.ReactNode, delay: number }) => (
    <Button
      variant="outline"
      className={cn(
        "w-full h-14 rounded-full bg-background/50 backdrop-blur-sm border-foreground/20 text-lg font-semibold flex items-center justify-center gap-3 transition-all duration-700 ease-out hover:bg-foreground/10 hover:border-foreground/50",
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
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
        <div className="max-w-sm w-full space-y-8">
            <div className='overflow-hidden pb-2'>
                <h1 className={cn(
                    "text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 transition-transform duration-700 ease-out",
                    isMounted ? "translate-y-0" : "translate-y-full"
                )}>
                    Rejoignez la Matrice
                </h1>
            </div>
            
            <div className={cn(
                "w-full space-y-4 transition-all duration-700 ease-out",
                isMounted ? "opacity-100" : "opacity-0"
            )}>
              <AuthButton delay={200} icon={<GoogleIcon className="w-6 h-6" />}>Continuer avec Google</AuthButton>
              <AuthButton delay={300} icon={<AppleIcon className="w-6 h-6" />}>Continuer avec Apple</AuthButton>
              <AuthButton delay={400} icon={<Mail className="w-6 h-6" />}>Continuer avec l'email</AuthButton>
            </div>
          
            <div 
                className={cn(
                    "transition-all duration-700 ease-out",
                    isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={{ transitionDelay: '500ms' }}
            >
              <p className="text-xs text-muted-foreground">
                En continuant, vous acceptez nos <a href="#" className="underline hover:text-foreground">Conditions d'utilisation</a> et notre <a href="#" className="underline hover:text-foreground">Politique de confidentialité</a>.
              </p>
            </div>

            <Button
                variant="link"
                className={cn(
                    "text-muted-foreground transition-all duration-700 ease-out hover:text-foreground",
                    isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={{ transitionDelay: '600ms' }}
                onClick={() => handleNavigate('/home')}
            >
                Continuer sans compte <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </main>
    </div>
  );
}
