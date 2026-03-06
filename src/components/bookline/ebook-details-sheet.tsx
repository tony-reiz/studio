'use client';

import { useEffect, useState, useRef, type TouchEvent } from 'react';
import type { Ebook } from '@/context/ebook-provider';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";

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
    const sheetRef = useRef<HTMLDivElement>(null);
    const [isSheetMounted, setIsSheetMounted] = useState(open);
    const [isAnimationOpen, setIsAnimationOpen] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [activeEbook, setActiveEbook] = useState<Ebook | null>(ebook);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStartY, setDragStartY] = useState(0);
    const [translateY, setTranslateY] = useState(0);

    useEffect(() => {
        if (ebook) {
            setActiveEbook(ebook);
        }
    }, [ebook]);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            setIsSheetMounted(true);
            setIsContentVisible(false);
            const timer = setTimeout(() => {
                setIsAnimationOpen(true);
                setTranslateY(0);
            }, 10);
            const contentTimer = setTimeout(() => {
                setIsContentVisible(true);
            }, 700);
            return () => {
                clearTimeout(timer);
                clearTimeout(contentTimer);
            };
        } else {
            document.body.style.overflow = 'auto';
            setIsAnimationOpen(false);
            setIsContentVisible(false);
            const timer = setTimeout(() => {
                setIsSheetMounted(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const closeSheet = () => {
        onOpenChange(false);
    };
    
    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        if (!sheetRef.current) return;
        setIsDragging(true);
        setDragStartY(e.touches[0].clientY);
        const style = window.getComputedStyle(e.currentTarget);
        const matrix = new DOMMatrix(style.transform);
        setTranslateY(matrix.m42);
    };
    
    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const currentY = e.touches[0].clientY;
        let deltaY = currentY - dragStartY;
        if (deltaY < 0) {
            deltaY = 0;
        }
        setTranslateY(deltaY);
    };
    
    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        
        const sheetHeight = sheetRef.current?.clientHeight || 0;
        if (translateY > sheetHeight / 4) {
            closeSheet();
        } else {
            setTranslateY(0);
        }
    };

    const numberOfSales = 0;
    const ebookPriceNumber = activeEbook ? parseFloat(activeEbook.price.replace(',', '.')) || 0 : 0;
    const SELLER_FEE = 3;
    const totalRevenue = (ebookPriceNumber - SELLER_FEE) * numberOfSales;

    if (!isSheetMounted) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
        >
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 transition-opacity duration-300",
                    isAnimationOpen ? 'opacity-100' : 'opacity-0'
                )}
                onClick={closeSheet}
            />
            <div
                ref={sheetRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="absolute bottom-0 left-0 right-0 flex max-h-[80vh] w-full flex-col bg-background rounded-t-[50px] touch-none pt-6"
                style={{
                    transform: `translateY(${isAnimationOpen ? translateY : window.innerHeight}px)`,
                    transition: isDragging ? 'none' : 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
            >
                <h2 id="sheet-title" className="sr-only">Détails de l'ebook</h2>
                
                <div className="overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
                    <div className={cn("transition-opacity duration-300 pt-4", isContentVisible ? "opacity-100" : "opacity-0")}>
                        {activeEbook && (
                            <main className="w-full space-y-6 pb-12">
                                <div className="border-0 shadow-none bg-transparent">
                                    <div className="p-0 pb-4">
                                        <h2 className="text-2xl font-semibold leading-none tracking-tight">{activeEbook.title}</h2>
                                    </div>
                                    <div className="space-y-4 p-0">
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1 text-sm">Description</h3>
                                            <p className="text-sm leading-relaxed whitespace-pre-line">{activeEbook.description}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2 text-sm">Mots-clés</h3>
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
                                                <p className="text-3xl font-bold">{activeEbook.price} €</p>
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
