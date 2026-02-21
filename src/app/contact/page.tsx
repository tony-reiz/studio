import { Header } from '@/components/bookline/header';
import { BottomNav } from '@/components/bookline/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        <Header />
        <main className="flex flex-col items-center w-full flex-1 px-4 sm:px-6 py-8 pb-28">
          <Card className="w-full bg-transparent border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-3xl font-bold text-primary">Contactez-nous</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-muted-foreground">Nom</Label>
                  <Input id="name" placeholder="Votre nom" className="h-12 text-base bg-input border-0 focus-visible:ring-primary focus-visible:ring-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                  <Input id="email" type="email" placeholder="Votre email" className="h-12 text-base bg-input border-0 focus-visible:ring-primary focus-visible:ring-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-muted-foreground">Message</Label>
                  <Textarea id="message" placeholder="Écrivez votre message ici..." className="bg-input border-0 focus-visible:ring-primary focus-visible:ring-2 min-h-[120px] text-base" />
                </div>
                <Button type="submit" className="w-full h-14 text-lg font-semibold rounded-full">
                  Envoyer
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
