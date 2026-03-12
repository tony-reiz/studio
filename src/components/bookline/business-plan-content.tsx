export function BusinessPlanContent() {
    return (
      <div className="space-y-4 text-sm [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
          <p className="text-muted-foreground">Ce document fournit une explication détaillée de ce qu'est BookLine, comment l'entreprise fonctionnera et comment elle générera des revenus, sur la base de l'architecture et du code de l'application.</p>
          
          <hr className="!my-6 border-border" />

          <h2>Notre Vision pour BookLine</h2>
          <p>BookLine est une plateforme de marché (marketplace) moderne et spécialisée, conçue pour mettre en relation directe les créateurs d'ebooks avec les lecteurs. Notre mission est de simplifier radicalement la publication et la monétisation pour les auteurs, tout en offrant aux acheteurs une expérience de découverte riche et personnalisée.</p>
          <p>Nous ne sommes pas une maison d'édition, mais un intermédiaire technologique. Nous fournissons les outils, la vitrine et l'infrastructure sécurisée pour que les transactions se fassent en toute confiance.</p>

          <hr className="!my-6 border-border" />
          
          <h2>Le Modèle Économique Principal : Comment BookLine gagne de l'argent</h2>
          <p>Notre modèle de revenus principal est transparent et basé sur le succès des transactions qui ont lieu sur notre plateforme. Il se décompose en deux parties :</p>
          <ol className="list-decimal list-outside pl-5 space-y-4">
            <li>
                <p>Commission Côté Vendeur : Pour chaque vente réalisée, BookLine prélève une commission fixe de 3,00 €. Cette commission nous permet de couvrir les frais de traitement des paiements, l'hébergement sécurisé des fichiers, et la maintenance et l'amélioration continues de nos outils de publication.</p>
                <ul className="!mt-2">
                    <li>Exemple concret : Si un vendeur fixe le prix de son ebook à 20,00 €, son gain net sur chaque vente sera de 17,00 €.</li>
                </ul>
            </li>
            <li>
                <p>Frais de Service Côté Acheteur : Au moment de l'achat, nous ajoutons des frais de service fixes de 3,50 € au prix de l'ebook. Ces frais financent le développement de l'expérience utilisateur, nos outils de recommandation par IA, le service client et la sécurité de la plateforme pour les acheteurs.</p>
                <ul className="!mt-2">
                    <li>Exemple concret : Pour ce même ebook à 20,00 €, le prix final payé par l'acheteur sera de 23,50 €.</li>
                </ul>
            </li>
          </ol>
          <p>Sur chaque transaction, BookLine génère donc un revenu total de 6,50 €. Ce modèle nous permet d'investir dans la plateforme tout en assurant que les créateurs conservent la grande majorité de leurs revenus.</p>

          <hr className="!my-6 border-border" />

          <h2>Futures Sources de Revenus & Stratégie de Croissance</h2>
            <p>En plus de notre modèle de base basé sur les transactions, BookLine prévoit d'introduire plusieurs nouvelles fonctionnalités pour augmenter la valeur pour nos utilisateurs et diversifier nos sources de revenus. Ces initiatives sont essentielles à notre stratégie de croissance à long terme.</p>
            <ol className="list-decimal list-outside pl-5 space-y-4">
                <li>
                    <p>Abonnement "BookLine Pro" (10 €/mois) : Nous proposerons un abonnement optionnel pour nos créateurs les plus engagés. Pour un forfait mensuel de 10 €, les vendeurs débloqueront des avantages exclusifs :</p>
                    <ul className="!mt-2">
                        <li>Badge de Vendeur Certifié : Un badge "Certifié" apparaîtra à côté de leur profil, augmentant la confiance et rassurant les acheteurs potentiels.</li>
                        <li>Placement Prioritaire : Leurs ebooks seront mis en avant et apparaîtront plus en évidence dans les résultats de recherche et les recommandations.</li>
                        <li>Expérience de Publication Sans Publicité : Les abonnés pourront publier leurs ebooks sans voir la publicité obligatoire, ce qui rendra le processus plus rapide.</li>
                    </ul>
                </li>
                <li>
                    <p>Publicité Obligatoire pour les Vendeurs : Pour créer une source de revenus constante, une publicité non-sautable de 30 secondes sera affichée aux vendeurs chaque fois qu'ils publient un ebook. Le processus de publication ne sera finalisé qu'une fois la publicité visionnée dans son intégralité. Ce modèle s'applique à tous les utilisateurs standards. Cependant, cette exigence est levée pour les vendeurs qui s'abonnent à notre plan "BookLine Pro". Cela incite à souscrire à l'abonnement Pro tout en monétisant le processus de publication pour tous les autres utilisateurs.</p>
                </li>
                <li>
                    <p>Programme de Parrainage : Nous mettrons en œuvre un système de parrainage pour accélérer notre croissance. Les utilisateurs (acheteurs et vendeurs) seront récompensés pour avoir invité de nouveaux créateurs sur la plateforme qui vendent avec succès leurs ebooks.</p>
                </li>
                <li>
                    <p>Programme d'Affiliation B2B : BookLine développera un réseau d'affiliation B2B. Nous nous associerons avec des blogs, des médias en ligne et des influenceurs dans des niches pertinentes. Ces partenaires pourront promouvoir les ebooks de notre plateforme et gagner une commission sur les ventes générées par leurs liens d'affiliation uniques, créant ainsi un nouveau canal de vente puissant pour nos créateurs.</p>
                </li>
            </ol>

          <hr className="!my-6 border-border" />
          
          <h2>Comment la Plateforme Fonctionne</h2>
          <h3>Pour les Vendeurs (Créateurs) :</h3>
          <ol className="list-decimal list-outside pl-5 space-y-2">
            <li>Publication Simplifiée : Le vendeur télécharge son ebook au format PDF. Notre système compresse et optimise automatiquement le fichier pour réduire sa taille, améliorant l'expérience pour l'acheteur sans perte de qualité visible.</li>
            <li>Mise en Vente : Le vendeur fournit le titre, une description convaincante, des mots-clés pertinents pour la découverte, et fixe son prix de vente.</li>
            <li>Publication Monétisée : Avant que l'ebook ne soit mis en ligne, les utilisateurs non-Pro sont tenus de regarder une courte publicité obligatoire.</li>
            <li>Analyse par IA : Le vendeur a accès à une analyse générée par intelligence artificielle qui suggère des mots-clés plus pertinents et fournit des commentaires pour améliorer sa description, maximisant ainsi son potentiel de vente.</li>
            <li>Suivi des Performances : Un tableau de bord permet au vendeur de suivre ses statistiques de vente, les revenus générés, et la performance de ses publications.</li>
          </ol>

          <h3 className="!mt-6">Pour les Acheteurs (Lecteurs) :</h3>
          <ol className="list-decimal list-outside pl-5 space-y-2">
            <li>Création de Profil Personnalisé : Lors de l'inscription, l'utilisateur choisit un avatar, un nom d'utilisateur, et surtout, sélectionne au moins 5 centres d'intérêt. C'est le cœur de notre système de personnalisation.</li>
            <li>Découverte Intelligente :
                <ul className="!mt-2">
                    <li>Sur la page d'accueil, l'acheteur voit des suggestions d'ebooks basées sur ses centres d'intérêt.</li>
                    <li>Notre barre de recherche est propulsée par l'IA : elle fournit des suggestions de recherche pertinentes en temps réel, indiquant même combien de publications correspondent à un mot-clé.</li>
                </ul>
            </li>
            <li>Achat Transparent : Le processus d'achat est clair, affichant la répartition du prix de l'ebook et des frais de service.</li>
            <li>Bibliothèque Personnelle : Une fois acheté, l'ebook est ajouté à la section "Achats" du profil de l'utilisateur, accessible à tout moment.</li>
            <li>Lecteur Intégré : L'utilisateur peut lire ses ebooks directement sur la plateforme grâce à un lecteur PDF intégré, optimisé pour mobile et bureau.</li>
          </ol>

          <hr className="!my-6 border-border" />

          <h2>Ce qui nous rend uniques : Notre Technologie</h2>
          <ul className="!list-none !pl-0 space-y-2">
            <li>Design et Expérience Utilisateur : Nous avons développé une identité visuelle forte avec un effet de verre déformé (glassmorphism) appliqué sur toute l'interface. C'est plus qu'un simple design, c'est notre signature.</li>
            <li>Intelligence Artificielle (via Genkit) : L'IA n'est pas un gadget. Elle est au service de nos utilisateurs, que ce soit pour aider les vendeurs à mieux commercialiser leur travail ou pour aider les acheteurs à trouver la perle rare.</li>
            <li>Stack Technique Moderne : L'application est construite sur Next.js 14 (App Router), React, et TypeScript, garantissant une plateforme rapide, robuste, et évolutive.</li>
            <li>Internationalisation : La plateforme est déjà prête à être utilisée en français et en anglais, et peut facilement être étendue à d'autres langues.</li>
          </ul>

           <hr className="!my-6 border-border" />

           <h2>Infrastructure & Services Clés</h2>
            <p>Pour concrétiser notre vision, BookLine s'appuiera sur un ensemble de services tiers robustes, évolutifs et sécurisés, complétés par notre propre logique personnalisée. Cette approche hybride nous permet de tirer parti des meilleures solutions pour les tâches complexes tout en gardant un contrôle total sur notre logique métier de base.</p>

            <ul className="!list-none !pl-0 space-y-4">
              <li>
                <p>Stockage de PDF (Cloudflare R2) : Tous les ebooks téléchargés par les créateurs seront stockés en toute sécurité sur Cloudflare R2. Ce service offre un stockage d'objets hautement disponible et économique, garantissant que nos lecteurs peuvent accéder rapidement et de manière fiable à leur contenu acheté, partout dans le monde.</p>
              </li>
              <li>
                <p>Transactions & Abonnements (Stripe) : Nous utiliserons Stripe comme notre processeur de paiement exclusif.</p>
                <ul className="!mt-2">
                    <li>Achats Uniques : Les API de traitement des paiements de Stripe géreront toutes les ventes d'ebooks individuelles en toute sécurité.</li>
                    <li>Abonnements "BookLine Pro" : L'abonnement récurrent de 10 €/mois pour nos vendeurs Pro sera géré via Stripe Billing, qui automatise les paiements récurrents et la gestion du cycle de vie des abonnements.</li>
                </ul>
              </li>
              <li>
                <p>Système Publicitaire (Intégration de Réseau Publicitaire) : La fonctionnalité de publicité obligatoire pour les vendeurs sera mise en œuvre en intégrant un réseau publicitaire tiers (par exemple, Google AdMob, Unity Ads) dans le flux de publication.</p>
                <ul className="!mt-2">
                    <li>Diffusion de Publicités : Avant l'étape finale de la publication, l'application déclenchera le SDK du réseau publicitaire pour afficher une annonce vidéo non-sautable de 30 secondes.</li>
                    <li>Verrouillage de la Publication : L'action finale du bouton "Publier" sera verrouillée jusqu'à ce que le rappel du réseau publicitaire confirme que la publicité a été entièrement visionnée. Cette logique sera implémentée côté client.</li>
                    <li>Contournement pour Utilisateur Pro : L'application vérifiera le statut d'abonnement de l'utilisateur (stocké dans Firestore) avant de lancer le flux publicitaire. Si l'utilisateur est un abonné "BookLine Pro", toute cette étape sera sautée.</li>
                </ul>
              </li>
              <li>
                <p>Programmes d'Affiliation & de Parrainage (Sur Mesure) : Les programmes d'affiliation B2B et de parrainage utilisateur-à-utilisateur seront également construits sur mesure :</p>
                <ul className="!mt-2">
                    <li>Des codes et des liens d'affiliation/parrainage uniques seront générés et associés aux profils des utilisateurs dans Firestore.</li>
                    <li>Les Firebase Functions suivront les clics sur les liens et attribueront les ventes au bon affilié ou parrain à la fin de l'achat.</li>
                    <li>Les commissions et les récompenses seront calculées et stockées dans Firestore, avec des paiements gérés via un processus administratif dédié.</li>
                </ul>
              </li>
            </ul>
          <p>Cette pile technique soigneusement sélectionnée garantit que BookLine est construit sur une base sécurisée, évolutive et prête pour la croissance future.</p>
          <p className="!mt-6">En résumé, BookLine n'est pas juste un site pour vendre des ebooks ; c'est un écosystème intelligent et bien conçu qui valorise à la fois le travail des créateurs et l'expérience des lecteurs.</p>
      </div>
    )
}
