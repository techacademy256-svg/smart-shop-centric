// UI COMPONENT - FRAMEWORK LAYER
// Pure presentation component with no business logic

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
}

export function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Trigger search on type with debounce effect
    if (value.length >= 2 || value.length === 0) {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for products (e.g., milk, bananas, bread)..."
          value={query}
          onChange={handleChange}
          disabled={isSearching}
          className="pl-12 h-14 text-lg rounded-full shadow-lg border-2 transition-all focus:shadow-xl"
        />
      </div>
    </form>
  );
}
