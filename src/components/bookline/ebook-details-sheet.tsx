'use client';

import { useEffect, useState } from 'react';
import type { Ebook } from '@/context/ebook-provider';
import { useEbooks } from '@/context/ebook-provider';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { FluidSheet } from './fluid-sheet';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { analyzeEbookListing, type EbookAnalysisOutput } from '@/ai/flows/ebook-analysis';

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

interface EbookDetailsSheetProps {
    ebook: Ebook | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EbookDetailsSheet({ ebook, open, onOpenChange }: EbookDetailsSheetProps) {
    const { t } = useEbooks();
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [activeEbook, setActiveEbook] = useState<Ebook | null>(ebook);
    const [analysis, setAnalysis] = useState<EbookAnalysisOutput | null>(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

    useEffect(() => {
        if (open && activeEbook) {
            const getAnalysis = async () => {
                setIsLoadingAnalysis(true);
                setAnalysis(null);
                try {
                    const result = await analyzeEbookListing({
                        title: activeEbook.title,
                        description: activeEbook.description,
                    });
                    setAnalysis(result);
                } catch (error) {
                    console.error("Failed to get ebook analysis:", error);
                } finally {
                    setIsLoadingAnalysis(false);
                }
            };
            getAnalysis();
        }
    }, [open, activeEbook]);

    const formatBytes = (bytes: number | null | undefined, decimals = 2) => {
        if (bytes === null || bytes === undefined) return 'N/A';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'Ko', 'Mo', 'Go', 'To'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    useEffect(() => {
        if (ebook) {
            setActiveEbook(ebook);
        }
    }, [ebook]);

    useEffect(() => {
        if (open) {
            setIsContentVisible(false);
            const contentTimer = setTimeout(() => {
                setIsContentVisible(true);
            }, 700);
            return () => {
                clearTimeout(contentTimer);
            };
        }
    }, [open]);

    const numberOfSales = 0;
    const ebookPriceNumber = activeEbook ? parseFloat(activeEbook.price.replace(',', '.')) || 0 : 0;
    const SELLER_FEE = 3;
    const totalRevenue = (ebookPriceNumber - SELLER_FEE) * numberOfSales;

    return (
        <FluidSheet 
            open={open}
            onOpenChange={onOpenChange}
            aria-labelledby="sheet-title"
            className="max-h-[80vh] flex flex-col"
        >
            <div className='h-full flex flex-col'>
                <h2 id="sheet-title" className="sr-only shrink-0">{t('ebook_details')}</h2>
                <div 
                    data-scrollable-sheet="true" 
                    className={cn(
                        "flex-1 overflow-y-auto p-4 scrollbar-hide transition-opacity", 
                        isContentVisible ? "opacity-100 duration-300" : "opacity-0 duration-[800ms]"
                    )}
                >
                    {activeEbook && (
                        <main className="w-full space-y-6 pt-4 pb-12">
                            <div className="border-0 shadow-none bg-transparent">
                                <div className="p-0 pb-4">
                                    <h2 className="text-2xl font-semibold leading-none tracking-tight break-words">{activeEbook.title}</h2>
                                </div>
                                <div className="space-y-4 p-0">
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1 text-sm">{t('description')}</h3>
                                        <p className="text-sm leading-relaxed whitespace-pre-line break-words">{activeEbook.description}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2 text-sm">{t('keywords')}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {activeEbook.keywords.split(',').map((keyword, index) => (
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
                                        <div className="bg-secondary p-3 rounded-lg">
                                            <p className="text-sm text-muted-foreground">{t('number_of_sales')}</p>
                                            <p className="text-2xl font-bold">{numberOfSales}</p>
                                        </div>
                                        <div className="bg-secondary p-3 rounded-lg">
                                            <p className="text-sm text-muted-foreground">{t('generated_revenue')}</p>
                                            <p className="text-2xl font-bold">{totalRevenue.toFixed(2).replace('.', ',')} €</p>
                                        </div>
                                        <div className="bg-secondary p-3 rounded-lg">
                                            <p className="text-sm text-muted-foreground">{t('ebook_price')}</p>
                                            <p className="text-2xl font-bold">{activeEbook.price} €</p>
                                        </div>
                                    </div>
                                    {activeEbook.originalSize && activeEbook.compressedSize && (
                                        <div className="bg-secondary p-3 rounded-lg">
                                            <p className="text-sm text-muted-foreground">{t('file_size')} ({t('file_size_details')})</p>
                                            <p className="text-xl font-bold">{formatBytes(activeEbook.originalSize)} &rarr; {formatBytes(activeEbook.compressedSize)}</p>
                                        </div>
                                    )}
                                    <ChartContainer config={chartConfig} className="w-full h-[250px]">
                                        <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: -20 }}>
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
                            <Separator />
                             <div className="border-0 shadow-none bg-transparent">
                                <div className="p-0 pb-4">
                                    <h2 className="text-2xl font-semibold leading-none tracking-tight">{t('ai_analysis')}</h2>
                                    <p className="text-sm text-muted-foreground">{t('ai_analysis_subtitle')}</p>
                                </div>
                                <div className="space-y-4 p-0">
                                    {isLoadingAnalysis ? (
                                        <div className="space-y-4">
                                            <div>
                                                <Skeleton className="h-5 w-32 mb-2" />
                                                <div className="flex flex-wrap gap-2">
                                                    <Skeleton className="h-7 w-24 rounded-full" />
                                                    <Skeleton className="h-7 w-28 rounded-full" />
                                                    <Skeleton className="h-7 w-20 rounded-full" />
                                                </div>
                                            </div>
                                            <div>
                                                <Skeleton className="h-5 w-40 mb-2" />
                                                <Skeleton className="h-10 w-full" />
                                            </div>
                                        </div>
                                    ) : analysis ? (
                                        <>
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-2 text-sm">{t('suggested_keywords')}</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.suggestedKeywords.map((keyword, index) => (
                                                        <Badge key={index} variant="secondary" className="rounded-full py-1 px-3">
                                                            {keyword.trim()}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-1 text-sm">{t('description_feedback')}</h3>
                                                <p className="text-sm leading-relaxed whitespace-pre-line break-words">{analysis.descriptionFeedback}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">{t('ai_analysis_failed')}</p>
                                    )}
                                </div>
                            </div>
                        </main>
                    )}
                </div>
            </div>
        </FluidSheet>
    );
}
