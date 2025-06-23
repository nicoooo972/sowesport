"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUserInteractions } from "@/hooks/useUserInteractions";
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Eye,
  MessageCircle,
  Link2,
  Facebook,
  Twitter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface InteractionButtonsProps {
  contentType: string;
  contentId: string;
  contentTitle?: string;
  initialLikes?: number;
  initialViews?: number;
  className?: string;
  showCounts?: boolean;
  variant?: "default" | "compact" | "floating";
}

const InteractionButtons = ({
  contentType,
  contentId,
  contentTitle,
  initialLikes = 0,
  initialViews = 0,
  className = "",
  showCounts = true,
  variant = "default"
}: InteractionButtonsProps) => {
  const { 
    toggleLike, 
    toggleBookmark, 
    shareContent, 
    checkUserInteractions, 
    loading 
  } = useUserInteractions();
  const { toast } = useToast();

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [interactionLoading, setInteractionLoading] = useState(false);

  useEffect(() => {
    loadUserInteractions();
  }, [contentId, contentType]);

  const loadUserInteractions = async () => {
    const interactions = await checkUserInteractions(contentType, contentId);
    setLiked(interactions.liked);
    setBookmarked(interactions.bookmarked);
  };

  const handleLike = async () => {
    setInteractionLoading(true);
    const newLikedState = await toggleLike(contentType, contentId, liked);
    setLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));
    setInteractionLoading(false);
  };

  const handleBookmark = async () => {
    setInteractionLoading(true);
    const newBookmarkedState = await toggleBookmark(
      contentType, 
      contentId, 
      bookmarked, 
      contentTitle
    );
    setBookmarked(newBookmarkedState);
    setInteractionLoading(false);
  };

  const handleShare = async (method: 'link' | 'social' | 'email') => {
    const currentUrl = window.location.href;
    
    if (method === 'link') {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans votre presse-papiers.",
      });
      await shareContent(contentType, contentId, 'link', contentTitle);
    }
  };

  const shareToSocial = (platform: 'facebook' | 'twitter') => {
    const currentUrl = window.location.href;
    const text = `Découvrez ${contentTitle || 'ce contenu'} sur So WE Sport`;
    
    let shareUrl = '';
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      shareContent(contentType, contentId, 'social', contentTitle);
    }
  };

  const buttonSize = variant === "compact" ? "sm" : "default";
  const iconSize = variant === "compact" ? "w-4 h-4" : "w-5 h-5";

  if (variant === "floating") {
    return (
      <div className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-40 space-y-2 ${className}`}>
        <div className="bg-white dark:bg-gray-900 rounded-full shadow-lg p-1 space-y-1">
          <Button
            size="sm"
            variant={liked ? "default" : "ghost"}
            onClick={handleLike}
            disabled={loading || interactionLoading}
            className={`rounded-full w-10 h-10 p-0 ${liked ? 'text-red-500 bg-red-50 hover:bg-red-100' : ''}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </Button>

          <Button
            size="sm"
            variant={bookmarked ? "default" : "ghost"}
            onClick={handleBookmark}
            disabled={loading || interactionLoading}
            className={`rounded-full w-10 h-10 p-0 ${bookmarked ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : ''}`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="rounded-full w-10 h-10 p-0">
                <Share2 className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleShare('link')}>
                <Link2 className="w-4 h-4 mr-2" />
                Copier le lien
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareToSocial('twitter')}>
                <Twitter className="w-4 h-4 mr-2" />
                Partager sur Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareToSocial('facebook')}>
                <Facebook className="w-4 h-4 mr-2" />
                Partager sur Facebook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {showCounts && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-2 text-center">
            <div className="text-xs text-gray-500">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Heart className="w-3 h-3" />
                <span>{likesCount}</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{initialViews}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        size={buttonSize}
        variant={liked ? "default" : "outline"}
        onClick={handleLike}
        disabled={loading || interactionLoading}
        className={`${liked ? 'text-red-500 border-red-500 bg-red-50 hover:bg-red-100' : ''}`}
      >
        <Heart className={`${iconSize} mr-2 ${liked ? 'fill-current' : ''}`} />
        {variant === "compact" ? likesCount : `J'aime ${showCounts ? `(${likesCount})` : ''}`}
      </Button>

      <Button
        size={buttonSize}
        variant={bookmarked ? "default" : "outline"}
        onClick={handleBookmark}
        disabled={loading || interactionLoading}
        className={`${bookmarked ? 'text-yellow-500 border-yellow-500 bg-yellow-50 hover:bg-yellow-100' : ''}`}
      >
        <Bookmark className={`${iconSize} mr-2 ${bookmarked ? 'fill-current' : ''}`} />
        {variant === "compact" ? '' : (bookmarked ? 'Sauvegardé' : 'Sauvegarder')}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={buttonSize} variant="outline">
            <Share2 className={`${iconSize} ${variant === "compact" ? '' : 'mr-2'}`} />
            {variant === "compact" ? '' : 'Partager'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleShare('link')}>
            <Link2 className="w-4 h-4 mr-2" />
            Copier le lien
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => shareToSocial('twitter')}>
            <Twitter className="w-4 h-4 mr-2" />
            Partager sur Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => shareToSocial('facebook')}>
            <Facebook className="w-4 h-4 mr-2" />
            Partager sur Facebook
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showCounts && variant !== "compact" && (
        <div className="flex items-center space-x-4 text-sm text-gray-500 ml-4">
          <span className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{initialViews} vues</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default InteractionButtons; 