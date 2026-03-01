'use client';

import { useState, useEffect, KeyboardEvent, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormField } from '@/components/ui/form';

type KeywordState = 'entering' | 'visible' | 'removing';
interface Keyword {
  id: string;
  text: string;
  state: KeywordState;
}

interface KeywordInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function KeywordInput({ value, onChange, placeholder }: KeywordInputProps) {
  const { error } = useFormField();
  const [keywords, setKeywords] = useState<Keyword[]>(() =>
    value ? value.split(',').map(k => ({ id: k.trim(), text: k.trim(), state: 'visible' })).filter(k => k.text) : []
  );
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const internalValueRef = useRef(value);

  // Sync from parent if value changes externally
  useEffect(() => {
    const newParentValue = value || '';
    if (newParentValue !== internalValueRef.current) {
        setKeywords(
            newParentValue ? newParentValue.split(',').map(k => ({ id: k.trim(), text: k.trim(), state: 'visible' })).filter(k => k.text) : []
        );
        internalValueRef.current = newParentValue;
    }
  }, [value]);

  // Handle entry animation
  useEffect(() => {
    const hasEntering = keywords.some(k => k.state === 'entering');
    if (hasEntering) {
      const timer = setTimeout(() => {
        setKeywords(current => current.map(k => (k.state === 'entering' ? { ...k, state: 'visible' } : k)));
      }, 10); // Short delay to allow initial render at opacity-0
      return () => clearTimeout(timer);
    }
  }, [keywords]);

  const updateParent = (newKeywords: Keyword[]) => {
    const newValue = newKeywords.filter(k => k.state !== 'removing').map(k => k.text).join(', ');
    internalValueRef.current = newValue;
    onChange(newValue);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [keywords.length]);

  const handleAddKeyword = () => {
    let newKeywordText = inputValue.trim();
    if (newKeywordText.endsWith(',')) {
      newKeywordText = newKeywordText.slice(0, -1).trim();
    }
    if (newKeywordText && !keywords.some(k => k.text === newKeywordText)) {
      const newKeywords = [...keywords, { id: crypto.randomUUID(), text: newKeywordText, state: 'entering' }];
      setKeywords(newKeywords);
      updateParent(newKeywords);
    }
    setInputValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      handleAddKeyword();
    } else if (event.key === 'Backspace' && inputValue === '' && keywords.length > 0) {
      const lastKeyword = keywords.findLast(k => k.state !== 'removing');
      if (lastKeyword) {
        event.preventDefault();
        removeKeyword(lastKeyword.id);
      }
    }
  };

  const removeKeyword = (idToRemove: string) => {
    setKeywords(current =>
      current.map(k => (k.id === idToRemove ? { ...k, state: 'removing' } : k))
    );

    setTimeout(() => {
      setKeywords(current => {
        const newKeywords = current.filter(k => k.id !== idToRemove);
        updateParent(newKeywords);
        return newKeywords;
      });
    }, 300); // This duration must match the CSS transition duration
  };
  
  return (
    <div 
        className={cn(
            "flex items-center h-12 w-full rounded-full bg-secondary p-0 overflow-hidden",
            error ? 'ring-2 ring-destructive ring-offset-2' : ''
        )}
        onClick={() => inputRef.current?.focus()}
    >
        <div ref={scrollContainerRef} className="flex-1 flex items-center gap-2 h-full overflow-x-auto pl-11 pr-2 scrollbar-hide">
            {keywords.map((keyword) => (
                <Badge 
                    key={keyword.id} 
                    variant="default" 
                    className={cn(
                        "flex-shrink-0 whitespace-nowrap rounded-full py-1 px-2 transition-opacity duration-300",
                        keyword.state !== 'visible' && 'opacity-0'
                    )}
                >
                {keyword.text}
                <button 
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeKeyword(keyword.id);
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
