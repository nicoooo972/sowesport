"use client";

import { useState, useEffect } from "react";
import { X, Plus, Tag, Type, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { supabase } from "@/lib/supabase";

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
}

interface CreateForumPostData {
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
}

interface CreateForumPostModalProps {
  onPostCreated?: () => void;
}

export default function CreateForumPostModal({ onPostCreated }: CreateForumPostModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState<CreateForumPostData>({
    title: "",
    content: "",
    categoryId: "",
    tags: [],
  });
  const [currentTag, setCurrentTag] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Charger les catégories au montage
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/forum/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories.",
        variant: "destructive",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (field: keyof CreateForumPostData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      categoryId: "",
      tags: [],
    });
    setCurrentTag("");
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez saisir un titre pour votre sujet.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.title.length < 10) {
      toast({
        title: "Titre trop court",
        description: "Le titre doit contenir au moins 10 caractères.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Contenu requis",
        description: "Veuillez saisir le contenu de votre sujet.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.content.length < 20) {
      toast({
        title: "Contenu trop court",
        description: "Le contenu doit contenir au moins 20 caractères.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.categoryId) {
      toast({
        title: "Catégorie requise",
        description: "Veuillez sélectionner une catégorie pour votre sujet.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Récupérer le token d'authentification
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour créer un sujet.",
          variant: "destructive",
        });
        setShowAuthModal(true);
        return;
      }

      const response = await fetch("/api/forum/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur inconnue" }));
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      const newPost = await response.json();

      toast({
        title: "Sujet créé !",
        description: "Votre sujet a été publié avec succès.",
      });

      resetForm();
      setIsOpen(false);
      onPostCreated?.();

      // Rediriger vers le nouveau sujet
      window.location.href = `/forum/${newPost.id}`;
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de créer le sujet. Veuillez réessayer.";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Créer un sujet
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-purple-500" />
              Créer un nouveau sujet
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-200 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Titre du sujet
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Saisissez un titre accrocheur pour votre sujet..."
                className="bg-slate-800 border-slate-600 text-white placeholder:text-gray-400"
                maxLength={200}
                required
              />
              <div className="text-sm text-gray-400">
                {formData.title.length}/200 caractères (minimum 10)
              </div>
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <Label className="text-gray-200">Catégorie</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleInputChange("categoryId", value)}
                disabled={loadingCategories}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id}
                      className="text-white hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCategory && (
                <p className="text-sm text-gray-400">{selectedCategory.description}</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label className="text-gray-200 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags (optionnel)
              </Label>
              
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ajouter un tag..."
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 flex-1"
                  maxLength={30}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  disabled={!currentTag.trim() || formData.tags.includes(currentTag.trim())}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-purple-500 text-purple-400 bg-purple-950/30"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-purple-400 hover:text-purple-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-400">
                Les tags aident les autres utilisateurs à trouver votre sujet (max 5)
              </p>
            </div>

            {/* Contenu */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-200">
                Contenu du sujet
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Décrivez votre sujet en détail. Utilisez Markdown pour la mise en forme..."
                className="bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 min-h-[200px]"
                required
              />
              <div className="text-sm text-gray-400">
                {formData.content.length} caractères (minimum 20) - Markdown supporté
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-slate-600 text-white hover:bg-slate-700"
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Publication...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Publier le sujet
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal d'authentification */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={(open) => setShowAuthModal(open)} 
      />
    </>
  );
} 