import { BookOpen } from 'lucide-react';

export function EbookDisplayArea() {
  return (
    <div className="flex-1 w-full px-4 sm:px-6">
      <div className="border-2 border-dashed border-border rounded-lg h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <BookOpen className="h-12 w-12 mb-4" />
        <p className="font-medium">Les listes d'ebooks et les résultats de recherche</p>
        <p className="text-sm">apparaîtront ici.</p>
      </div>
    </div>
  );
}
