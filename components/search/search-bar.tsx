"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Filter, X, Calendar, Tag, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";

interface SearchFilters {
  contentTypes: string[];
  categories: string[];
  dateRange: string;
  author: string;
  tags: string[];
}

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'article' | 'interview' | 'event' | 'ranking';
  category: string;
  author?: string;
  publishedAt: string;
  thumbnail?: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string, filters: SearchFilters) => void;
  onResultSelect?: (result: SearchResult) => void;
  showAdvancedFilters?: boolean;
}

export function SearchBar({
  placeholder = "Rechercher des articles, événements, interviews...",
  onSearch,
  onResultSelect,
  showAdvancedFilters = true
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    contentTypes: [],
    categories: [],
    dateRange: '',
    author: '',
    tags: []
  });
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Recherche en temps réel
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, filters]);

  // Fermer les résultats quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      // Recherche dans les articles
      if (filters.contentTypes.length === 0 || filters.contentTypes.includes('article')) {
        const { data: articles } = await supabase
          .from('articles')
          .select('id, title, excerpt, category, author, published_at, featured_image')
          .or(`title.ilike.%${query}%, excerpt.ilike.%${query}%, content.ilike.%${query}%`)
          .limit(5);

        if (articles) {
          searchResults.push(
            ...articles.map(article => ({
              id: article.id,
              title: article.title,
              excerpt: article.excerpt,
              type: 'article' as const,
              category: article.category,
              author: article.author,
              publishedAt: article.published_at,
              thumbnail: article.featured_image
            }))
          );
        }
      }

      // Recherche dans les interviews
      if (filters.contentTypes.length === 0 || filters.contentTypes.includes('interview')) {
        const { data: interviews } = await supabase
          .from('interviews')
          .select('id, title, description, interviewee_name, published_at, thumbnail')
          .or(`title.ilike.%${query}%, description.ilike.%${query}%, interviewee_name.ilike.%${query}%`)
          .limit(5);

        if (interviews) {
          searchResults.push(
            ...interviews.map(interview => ({
              id: interview.id,
              title: interview.title,
              excerpt: interview.description,
              type: 'interview' as const,
              category: 'Interview',
              author: interview.interviewee_name,
              publishedAt: interview.published_at,
              thumbnail: interview.thumbnail
            }))
          );
        }
      }

      // Recherche dans les événements
      if (filters.contentTypes.length === 0 || filters.contentTypes.includes('event')) {
        const { data: events } = await supabase
          .from('events')
          .select('id, name, description, game, start_date, image_url')
          .or(`name.ilike.%${query}%, description.ilike.%${query}%, game.ilike.%${query}%`)
          .limit(5);

        if (events) {
          searchResults.push(
            ...events.map(event => ({
              id: event.id,
              title: event.name,
              excerpt: event.description,
              type: 'event' as const,
              category: event.game,
              publishedAt: event.start_date,
              thumbnail: event.image_url
            }))
          );
        }
      }

      // Trier par pertinence (titre exact > début de titre > contenu)
      const sortedResults = searchResults.sort((a, b) => {
        const aScore = getRelevanceScore(a, query);
        const bScore = getRelevanceScore(b, query);
        return bScore - aScore;
      });

      setResults(sortedResults.slice(0, 10));
      setIsOpen(sortedResults.length > 0);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRelevanceScore = (result: SearchResult, searchQuery: string): number => {
    const q = searchQuery.toLowerCase();
    const title = result.title.toLowerCase();
    const excerpt = result.excerpt.toLowerCase();

    let score = 0;
    
    // Titre exact
    if (title === q) score += 100;
    // Titre commence par
    else if (title.startsWith(q)) score += 50;
    // Titre contient
    else if (title.includes(q)) score += 25;
    
    // Excerpt contient
    if (excerpt.includes(q)) score += 10;
    
    return score;
  };

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      contentTypes: [],
      categories: [],
      dateRange: '',
      author: '',
      tags: []
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).flat().filter(Boolean).length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query, filters);
    setIsOpen(false);
  };

  const handleResultClick = (result: SearchResult) => {
    onResultSelect?.(result);
    setIsOpen(false);
    setQuery("");
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'article': return '📰';
      case 'interview': return '🎤';
      case 'event': return '🎯';
      case 'ranking': return '🏆';
      default: return '📄';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            className="pl-10 pr-20 h-12 bg-background/50 backdrop-blur-sm"
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {showAdvancedFilters && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 relative"
                  >
                    <Filter className="h-4 w-4" />
                    {getActiveFiltersCount() > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
                      >
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filtres avancés</h4>
                      {getActiveFiltersCount() > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearFilters}
                          className="h-auto p-1 text-xs"
                        >
                          Effacer tout
                        </Button>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* Type de contenu */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Type de contenu</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'article', label: 'Articles' },
                          { value: 'interview', label: 'Interviews' },
                          { value: 'event', label: 'Événements' },
                          { value: 'ranking', label: 'Classements' }
                        ].map((type) => (
                          <div key={type.value} className="flex items-center space-x-2">
                            <Checkbox 
                              id={type.value}
                              checked={filters.contentTypes.includes(type.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleFilterChange('contentTypes', [...filters.contentTypes, type.value]);
                                } else {
                                  handleFilterChange('contentTypes', filters.contentTypes.filter(t => t !== type.value));
                                }
                              }}
                            />
                            <Label htmlFor={type.value} className="text-sm">
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Période */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Période</Label>
                      <Select 
                        value={filters.dateRange} 
                        onValueChange={(value) => handleFilterChange('dateRange', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les périodes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Toutes les périodes</SelectItem>
                          <SelectItem value="today">Aujourd'hui</SelectItem>
                          <SelectItem value="week">Cette semaine</SelectItem>
                          <SelectItem value="month">Ce mois</SelectItem>
                          <SelectItem value="year">Cette année</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        
        {/* Filtres actifs */}
        {getActiveFiltersCount() > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {filters.contentTypes.map((type) => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => handleFilterChange('contentTypes', filters.contentTypes.filter(t => t !== type))}
                />
              </Badge>
            ))}
            {filters.dateRange && (
              <Badge variant="secondary" className="text-xs">
                {filters.dateRange}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => handleFilterChange('dateRange', '')}
                />
              </Badge>
            )}
          </div>
        )}
      </form>

      {/* Résultats de recherche */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="h-6 w-6 animate-spin mx-auto mb-2" />
              Recherche en cours...
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0 mt-1">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">
                          {result.title}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {result.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {result.excerpt}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{result.category}</span>
                        {result.author && (
                          <>
                            <span>•</span>
                            <span>{result.author}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{new Date(result.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="h-6 w-6 mx-auto mb-2" />
              Aucun résultat trouvé pour "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
