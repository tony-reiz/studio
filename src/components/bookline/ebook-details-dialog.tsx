'use client';

import type { Ebook } from '@/context/ebook-provider';
import { useEbooks } from '@/context/ebook-provider';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

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

interface EbookDetailsDialogProps {
    ebook: Ebook | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EbookDetailsDialog({ ebook, open, onOpenChange }: EbookDetailsDialogProps) {
    const { t } = useEbooks();

    if (!ebook) {
        return null;
    }
    
    const numberOfSales = 0;
    const ebookPriceNumber = parseFloat(ebook.price.replace(',', '.')) || 0;
    const SELLER_FEE = 3;
    const totalRevenue = (ebookPriceNumber - SELLER_FEE) * numberOfSales;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl w-full p-0 bg-transparent border-none shadow-xl">
                 <DialogTitle className="sr-only">{t('ebook_details')}</DialogTitle>
                 <div className="h-[70vh] flex flex-col bg-background rounded-[50px] overflow-hidden p-8">
                    <main className="w-full space-y-6 overflow-y-auto scrollbar-hide">
                        <div className="border-0 shadow-none bg-transparent">
                            <div className="p-0 pb-4">
                                <h2 className="text-2xl font-semibold leading-none tracking-tight">{ebook.title}</h2>
                            </div>
                            <div className="space-y-4 p-0">
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1 text-sm">{t('description')}</h3>
                                    <p className="text-sm leading-relaxed whitespace-pre-line">{ebook.description}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2 text-sm">{t('keywords')}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {ebook.keywords.split(',').map((keyword, index) => (
                                            <Badge key={index} variant="default" className="rounded-full py-1 px-3">
                                                {keyword.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-0 shadow-none bg-transparent">
                            <div className="p-0 pb-4">
                                <h2 className="text-2xl font-semibold leading-none tracking-tight">{t('statistics')}</h2>
                                <p className="text-sm text-muted-foreground">{t('ebook_performance')}</p>
                            </div>
                            <div className="space-y-6 p-0">
                                <div className="grid grid-cols-3 gap-4 text-left">
                                <div className="bg-secondary p-4 rounded-lg">
                                    <p className="text-sm text-muted-foreground">{t('number_of_sales')}</p>
                                    <p className="text-3xl font-bold">{numberOfSales}</p>
                                </div>
                                <div className="bg-secondary p-4 rounded-lg">
                                    <p className="text-sm text-muted-foreground">{t('generated_revenue')}</p>
                                    <p className="text-3xl font-bold">{totalRevenue.toFixed(2).replace('.', ',')} €</p>
                                </div>
                                <div className="bg-secondary p-4 rounded-lg">
                                    <p className="text-sm text-muted-foreground">{t('ebook_price')}</p>
                                    <p className="text-3xl font-bold">{ebook.price} €</p>
                                </div>
                            </div>
                                <ChartContainer config={chartConfig} className="w-full h-[250px]">
                                    <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: -30 }}>
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
            </DialogContent>
        </Dialog>
    );
}
