'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function DraggableGlass() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const ref = useRef<HTMLDivElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Center the element on initial mount after a short delay
        const timeoutId = setTimeout(() => {
            setPosition({
                x: window.innerWidth / 2 - 150, // half of width 300px
                y: window.innerHeight / 2 - 75 + 100, // half of height 150px, plus offset
            });
            setIsInitialized(true);
        }, 100);

        return () => clearTimeout(timeoutId);
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (ref.current) {
            setIsDragging(true);
            const rect = ref.current.getBoundingClientRect();
            dragOffset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        
        e.preventDefault();

        setPosition({
            x: e.clientX - dragOffset.current.x,
            y: e.clientY - dragOffset.current.y,
        });
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDragging]);

    return (
        <>
            <div
                ref={ref}
                className={cn(
                    "fixed w-[300px] h-[150px] rounded-[30px] z-50 cursor-grab flex justify-center items-center text-white font-bold select-none bg-white/10 shadow-[0_0_2px_1px_rgba(255,255,255,0.2)_inset,0px_10px_30px_rgba(0,0,0,0.2)]",
                    isDragging ? "cursor-grabbing" : "",
                    isInitialized ? "opacity-100" : "opacity-0"
                )}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    backdropFilter: 'url(#glass-displacement-filter) saturate(1.5)',
                    WebkitBackdropFilter: 'url(#glass-displacement-filter) saturate(1.5)',
                    transition: !isDragging && isInitialized ? 'opacity 0.5s' : 'none'
                }}
                onMouseDown={handleMouseDown}
            >
                DÉPLACE-MOI
            </div>
            {/* The filter needs to be in the DOM */}
            <svg className="absolute w-0 h-0 pointer-events-none">
              <defs>
                <filter id="glass-displacement-filter" colorInterpolationFilters="sRGB">
                  <feImage x="0" y="0" width="100%" height="100%" result="map" href="data:image/svg+xml,%3Csvg viewBox='0 0 300 150' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='150' fill='black'/%3E%3ClinearGradient id='r'%3E%3Cstop offset='0' stop-color='red'/%3E%3Cstop offset='1' stop-color='black'/%3E%3C/linearGradient%3E%3Crect width='300' height='150' fill='url(%23r)'/%3E%3C/svg%3E"></feImage>
                  <feDisplacementMap in="SourceGraphic" in2="map" scale="50" xChannelSelector="R" yChannelSelector="B" />
                  <feGaussianBlur stdDeviation="1" />
                </filter>
              </defs>
            </svg>
        </>
    );
}
