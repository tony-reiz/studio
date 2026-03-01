'use client';

import { useState, useEffect, KeyboardEvent, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormField } from '@/components/ui/form';

interface KeywordInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function KeywordInput({ value, onChange, placeholder }: KeywordInputProps) {
  const { error } = useFormField();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setKeywords(value ? value.split(',').map(k => k.trim()).filter(Boolean) : []);
  }, [value]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [keywords]);

  const handleAddKeyword = () => {
    let newKeyword = inputValue.trim();
    if (newKeyword.endsWith(',')) {
      newKeyword = newKeyword.slice(0, -1).trim();
    }
    if (newKeyword && !keywords.includes(newKeyword)) {
      const newKeywords = [...keywords, newKeyword];
      setKeywords(newKeywords);
      onChange(newKeywords.join(', '));
    }
    setInputValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      handleAddKeyword();
    } else if (event.key === 'Backspace' && inputValue === '' && keywords.length > 0) {
      event.preventDefault();
      removeKeyword(keywords[keywords.length - 1]);
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const newKeywords = keywords.filter(keyword => keyword !== keywordToRemove);
    setKeywords(newKeywords);
    onChange(newKeywords.join(', '));
  };
  
  return (
    <div 
        className={cn(
            "flex items-center h-12 w-full rounded-full bg-secondary p-0 overflow-hidden",
            error ? 'ring-2 ring-destructive ring-offset-background ring-offset-2' : ''
        )}
        onClick={() => inputRef.current?.focus()}
    >
        <div ref={scrollContainerRef} className="flex-1 flex items-center gap-2 h-full overflow-x-auto pl-11 pr-2 scrollbar-hide">
            {keywords.map((keyword) => (
                <Badge key={keyword} variant="default" className="flex-shrink-0 whitespace-nowrap rounded-full py-1 px-2">
                {keyword}
                <button 
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeKeyword(keyword);
                    }} 
                    className="ml-1.5 rounded-full outline-none hover:bg-primary/80 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <X className="h-3 w-3" />
                </button>
                </Badge>
            ))}
            <Input
                ref={inputRef}
                type="text"
                placeholder={keywords.length === 0 ? placeholder : ''}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleAddKeyword}
                className="bg-transparent border-0 h-full p-0 m-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 min-w-[100px] flex-grow"
            />
        </div>
    </div>
  );
}
