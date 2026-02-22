export function DevPageIdentifier({ pagePath }: { pagePath: string }) {
  return (
    <div className="fixed bottom-20 right-4 bg-yellow-400 text-black p-2 rounded-md shadow-lg text-xs z-50 font-sans">
      <p className="font-bold">Fichier de la page :</p>
      <code>{pagePath}</code>
    </div>
  );
}
