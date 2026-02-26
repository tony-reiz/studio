'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

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
  const router = useRouter();
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

  return (
    <div className="min-h-screen bg-background text-foreground">
        <div className="w-full max-w-2xl mx-auto p-4">
            <header className="w-full flex items-center relative py-4 mb-4">
                <Button onClick={() => router.back()} variant="ghost" size="icon" className="absolute left-0 -ml-2">
                    <ChevronLeft className="h-7 w-7" />
                </Button>
                <h1 className="text-xl font-bold text-center flex-grow">Détails de la publication</h1>
            </header>
            
            <main className="w-full space-y-6 pb-12">
                <Card>
                    <CardHeader>
                        <CardTitle>{ebook.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-muted-foreground mb-1 text-sm">Description</h3>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{ebook.description}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-muted-foreground mb-1 text-sm">Mots-clés</h3>
                            <p className="text-sm">{ebook.keywords}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Statistiques</CardTitle>
                        <CardDescription>Performance de votre ebook.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-2 gap-4 text-left">
                            <div className="bg-secondary p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Nombre de ventes</p>
                                <p className="text-3xl font-bold">0</p>
                            </div>
                            <div className="bg-secondary p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Prix de l'ebook</p>
                                <p className="text-3xl font-bold">{ebook.price} €</p>
                            </div>
                        </div>
                        <ChartContainer config={chartConfig} className="w-full">
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
                    </CardContent>
                </Card>
            </main>
        </div>
    </div>
  );
}
