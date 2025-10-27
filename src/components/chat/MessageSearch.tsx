
"use client";

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MessageSearchProps {
  messages: any[];
  onResultClick: (messageIndex: number) => void;
}

export function MessageSearch({ messages, onResultClick }: MessageSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<number[]>([]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    const matches: number[] = [];
    const lowerQuery = searchQuery.toLowerCase();
    
    messages.forEach((msg, index) => {
      if (msg.content.toLowerCase().includes(lowerQuery)) {
        matches.push(index);
      }
    });
    
    setResults(matches);
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="absolute top-0 left-0 right-0 bg-background border-b p-2 z-10">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          autoFocus
          placeholder="Search messages..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {results.length} found
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsOpen(false);
            setQuery('');
            setResults([]);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {results.length > 0 && (
        <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
          {results.slice(0, 5).map((index) => (
            <button
              key={index}
              onClick={() => {
                onResultClick(index);
                setIsOpen(false);
              }}
              className="w-full text-left text-xs p-2 hover:bg-accent rounded truncate"
            >
              {messages[index].content}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
