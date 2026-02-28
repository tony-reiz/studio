'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function TermsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleBack = () => {
    setIsMounted(false);
    setTimeout(() => {
      router.back();
    }, 300);
  };


  return (
    <div className={cn("flex flex-col min-h-screen bg-background text-foreground transition-opacity duration-300 ease-in-out", isMounted ? "opacity-100" : "opacity-0")}>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center p-6">
            <Button onClick={handleBack} variant="ghost" size="icon" className="mr-4">
              <ArrowLeft />
            </Button>
            <h1 className="text-2xl font-bold">Conditions d'Utilisation</h1>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        <div className="container mx-auto prose prose-sm sm:prose-base lg:prose-lg max-w-4xl px-6">
          <p className="text-muted-foreground">Dernière mise à jour : 28 Juillet 2024</p>
          
          <p>Bienvenue sur BookLine. En utilisant notre plateforme, vous acceptez les présentes Conditions Générales d'Utilisation. Veuillez les lire attentivement.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Rôle de BookLine</h2>
          <p>BookLine est une plateforme de mise en relation qui permet à des vendeurs ("Vendeurs") de proposer et vendre des œuvres numériques, notamment des ebooks ("Contenu"), à des acheteurs ("Acheteurs"). BookLine agit en tant qu'intermédiaire et n'est ni le vendeur ni le propriétaire du Contenu proposé sur la plateforme. Nous ne sommes pas responsables de la qualité, de la légalité ou de la conformité du Contenu.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Comptes Utilisateurs</h2>
          <p>Pour utiliser nos services, vous devez créer un compte. Vous êtes responsable de la confidentialité de vos informations de connexion et de toutes les activités effectuées via votre compte. Vous vous engagez à fournir des informations exactes et à les maintenir à jour.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. Obligations des Vendeurs</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Propriété Intellectuelle :</strong> En publiant du Contenu sur BookLine, vous déclarez et garantissez que vous détenez tous les droits, titres et intérêts nécessaires (y compris les droits d'auteur) pour vendre ce Contenu. Vous ne pouvez pas publier de Contenu qui enfreint les droits de tiers.</li>
            <li><strong>Contenu Interdit :</strong> Il est strictement interdit de publier du Contenu illégal, diffamatoire, haineux, pornographique, ou qui promeut la violence ou la discrimination.</li>
            <li><strong>Responsabilité :</strong> Vous êtes seul responsable du Contenu que vous mettez en ligne. BookLine se réserve le droit, sans obligation, de retirer tout Contenu qui violerait ces conditions.</li>
            <li><strong>Licence accordée à BookLine :</strong> Vous accordez à BookLine une licence mondiale, non exclusive, et sans redevance pour héberger, afficher, commercialiser et vendre votre Contenu sur la plateforme.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Obligations des Acheteurs</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Licence d'utilisation :</strong> En achetant un ebook, vous obtenez une licence limitée, non transférable, pour un usage personnel et non commercial du Contenu.</li>
            <li><strong>Restrictions :</strong> Il vous est interdit de copier, distribuer, revendre, modifier ou créer des œuvres dérivées à partir du Contenu acheté.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">5. Paiements et Frais</h2>
          <p>BookLine prélève des frais de service sur chaque transaction. Les frais applicables sont clairement indiqués au Vendeur avant la publication et à l'Acheteur avant le paiement. Tous les paiements sont traités par un prestataire de services de paiement tiers sécurisé. BookLine ne stocke pas vos informations de carte de crédit. Sauf indication contraire, toutes les ventes sont finales et non remboursables.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">6. Limitation de Responsabilité</h2>
          <p>LA PLATEFORME BOOKLINE EST FOURNIE "TELLE QUELLE". DANS LA MESURE MAXIMALE AUTORISÉE PAR LA LOI, BOOKLINE DÉCLINE TOUTE GARANTIE, EXPLICITE OU IMPLICITE. NOUS NE SERONS EN AUCUN CAS RESPONSABLES DES DOMMAGES INDIRECTS, ACCESSOIRES, SPÉCIAUX OU CONSÉCUTIFS RÉSULTANT DE L'UTILISATION DE NOTRE SERVICE OU DU CONTENU ACHETÉ VIA LA PLATEFORME. NOTRE RESPONSABILITÉ TOTALE NE POURRA EXCÉDER LE MONTANT DES FRAIS DE SERVICE QUE VOUS AVEZ PAYÉS À BOOKLINE AU COURS DES TROIS (3) DERNIERS MOIS.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">7. Indemnisation</h2>
          <p>Vous acceptez de défendre, d'indemniser et de dégager de toute responsabilité BookLine, ses dirigeants, et ses employés contre toute réclamation, perte, dommage, ou dépense (y compris les frais d'avocat raisonnables) découlant de votre violation de ces conditions ou de votre utilisation de la plateforme.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">8. Signalement et Suppression de Contenu</h2>
          <p>Si vous pensez qu'un Contenu enfreint vos droits d'auteur, veuillez nous contacter avec les informations requises par la loi (DMCA ou équivalent). BookLine se réserve le droit de suspendre ou de supprimer des comptes d'utilisateurs qui enfreignent de manière répétée les droits de propriété intellectuelle.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">9. Modification des Conditions</h2>
          <p>Nous pouvons modifier ces conditions à tout moment. Nous vous notifierons de tout changement substantiel. Votre utilisation continue de la plateforme après la publication des modifications constitue votre acceptation des nouvelles conditions.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">10. Droit Applicable et Juridiction</h2>
          <p>Ces conditions sont régies par le droit français. Tout litige relatif à ces conditions sera soumis à la compétence exclusive des tribunaux de Paris, France.</p>
          
          <p className="mt-8 p-4 bg-secondary rounded-lg text-sm text-muted-foreground"><strong>Avis de non-responsabilité :</strong> Ce document est un modèle et ne constitue pas un avis juridique. Il est fortement recommandé de consulter un avocat pour vous assurer que vos conditions d'utilisation sont complètes et conformes à toutes les lois et réglementations applicables.</p>
        </div>
      </main>
      
      <footer className="border-t">
        <div className="container mx-auto text-center text-muted-foreground py-6 text-sm">
          <p>&copy; {new Date().getFullYear()} BookLine. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
