'use client';

import { useParams } from 'next/navigation';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { cn } from '@/lib/utils';
import { useTransitionRouter } from '@/app/(bookline)/layout';

const chartData = [
  { metric: "Clics", value: 0, fill: "var(--color-clics)" },
  { metric: "Achats", value: 0, fill: "var(--color-achats)" },
  { metric: "Partages", value: 0, fill: "var(--color-partages)" },
];

const chartConfig = {
  value: {
    label: "Total",
  },
  clics: {
    label: "Clics",
    color: "hsl(var(--chart-1))",
  },
  achats: {
    label: "Achats",
    color: "hsl(var(--chart-2))",
  },
  partages: {
    label: "Partages",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function EbookDetailsPage() {
  const params = useParams();
  const { handleBack } = useTransitionRouter();
  const { publishedEbooks } = useEbooks();
  const [ebook, setEbook] = useState<Ebook | undefined>(undefined);

  useEffect(() => {
    if (params.id && publishedEbooks.length > 0) {
      const foundEbook = publishedEbooks.find((e) => e.id === params.id);
      setEbook(foundEbook);
    }
  }, [params.id, publishedEbooks]);

  if (!ebook) {
    return <div className="flex h-screen w-full items-center justify-center bg-background">Chargement...</div>;
  }

  const numberOfSales = 0; // Hardcoded for now
  const ebookPriceNumber = parseFloat(ebook.price.replace(',', '.')) || 0;
  const SELLER_FEE = 3;
  const totalRevenue = (ebookPriceNumber - SELLER_FEE) * numberOfSales;

  return (
    <div className="min-h-screen bg-background text-foreground">
        <div className="w-full max-w-2xl mx-auto p-4">
            <header className="w-full flex items-center relative py-4 mb-4">
                <Button onClick={handleBack} variant="ghost" size="icon" className="absolute right-2 hover:bg-transparent [&_svg]:h-8 [&_svg]:w-8">
                    <X />
                </Button>
            </header>
            
            <main className="w-full space-y-6 pb-12">
                <div className="border-0 shadow-none bg-transparent">
                    <div className="p-0 pb-4">
                        <h2 className="text-2xl font-semibold leading-none tracking-tight">{ebook.title}</h2>
                    </div>
                    <div className="space-y-4 p-0">
                        <div>
                            <h3 className="font-semibold text-foreground mb-1 text-sm">Description</h3>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{ebook.description}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-1 text-sm">Mots-clés</h3>
                            <p className="text-sm">{ebook.keywords}</p>
                        </div>
                    </div>
                </div>

                <div className="border-0 shadow-none bg-transparent">
                    <div className="p-0 pb-4">
                        <h2 className="text-2xl font-semibold leading-none tracking-tight">Statistiques</h2>
                        <p className="text-sm text-muted-foreground">Performance de votre ebook.</p>
                    </div>
                    <div className="space-y-6 p-0">
                         <div className="grid grid-cols-3 gap-4 text-left">
                            <div className="bg-secondary p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Nombre de ventes</p>
                                <p className="text-3xl font-bold">{numberOfSales}</p>
                            </div>
                            <div className="bg-secondary p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Revenus générés</p>
                                <p className="text-3xl font-bold">{totalRevenue.toFixed(2).replace('.', ',')} €</p>
                            </div>
                            <div className="bg-secondary p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Prix de l'ebook</p>
                                <p className="text-3xl font-bold">{ebook.price} €</p>
                            </div>
                        </div>
                        <ChartContainer config={chartConfig} className="w-full h-[250px]">
                            <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="metric"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                />
                                <YAxis 
                                    tickLine={false}
                                    axisLine={false}
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    allowDecimals={false}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Bar dataKey="value" radius={4}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </div>
                </div>
            </main>
        </div>
    </div>
  );
}
