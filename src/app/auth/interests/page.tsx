'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const interests = [
  'Business 💼', 'Histoires Fictives 📖', 'Biographies ✍️', 'Cours & Révisions 📚', 
  'Carrière 🚀', 'Sport ⚽️', 'Motivation 🔥', 'Code de la route 🚗', 'Cours Prépa 🎓',
  'Développement Personnel 🌱', 'Science-Fiction 👽', 'Technologie 💻', 
  'Santé & Bien-être 🧘', 'Cuisine 🍳', 'Art & Photographie 🎨', 'Voyage ✈️',
  'Histoire 🏛️', 'Psychologie 🧠', 'Finance 💰', 'Marketing 📈'
];

export default function InterestsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNavigate = (path: string) => {
    setIsMounted(false);
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };
  
  const handleFinish = () => {
    // Here you would typically save the user's interests
    console.log('Selected interests:', selectedInterests);
    handleNavigate('/home');
  };

  const isButtonDisabled = selectedInterests.length < 3;

  return (
    <div className={cn("flex flex-col min-h-screen bg-background text-foreground transition-opacity duration-300 ease-in-out", isMounted ? "opacity-100" : "opacity-0")}>
      <div className="w-full max-w-screen-lg mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="w-full py-6">
          <div className="flex flex-col items-start">
            <div>
              <p className="text-[24px] font-bold tracking-widest text-foreground">PRESQUE FINI</p>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-primary -mt-1">VOS INTÉRÊTS ?</h1>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Sélectionnez au moins 3 sujets qui vous passionnent. Cela nous aidera à vous recommander les meilleurs ebooks.
          </p>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-8 pb-28">
          <div className="flex flex-wrap justify-center gap-3">
            {interests.map((interest) => (
              <Button
                key={interest}
                variant={selectedInterests.includes(interest) ? 'default' : 'secondary'}
                onClick={() => toggleInterest(interest)}
                className="rounded-full h-10 px-5 text-sm font-semibold transition-all duration-200 transform hover:scale-105"
              >
                {interest}
              </Button>
            ))}
          </div>
        </main>
      </div>

      <div className="fixed bottom-8 left-0 right-0 p-4 md:bottom-2 md:mb-4">
        <div className="w-full max-w-[16rem] mx-auto">
          <Button 
            onClick={handleFinish}
            disabled={isButtonDisabled}
            className={cn(
                "bg-foreground text-background rounded-full w-full h-12 text-lg font-semibold hover:bg-foreground/90 disabled:bg-[#DFDFDF] disabled:text-muted-foreground",
                !isButtonDisabled && "animate-pulse-subtle"
            )}
          >
            Terminer
          </Button>
        </div>
      </div>
    </div>
  );
}
