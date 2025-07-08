"use client";

import { useMemo, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { InterviewDetail, Question } from "./page";
import { generateHTML } from '@tiptap/html';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import LinkExtension from '@tiptap/extension-link';
import { 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Calendar,
  Trophy,
  Play,
  ChevronDown,
  ChevronUp,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function InterviewContent({ content }: { content: string | null }) {
  const output = useMemo(() => {
    if (!content) return '';
    try {
      const jsonContent = typeof content === 'string' ? JSON.parse(content) : content;
      
      return generateHTML(jsonContent, [
        Document,
        Paragraph,
        Text,
        Heading.configure({ levels: [1, 2, 3] }),
        Bold,
        Italic,
        LinkExtension.configure({
          openOnClick: true,
          autolink: true,
          HTMLAttributes: {
            class: 'text-primary hover:underline transition-colors',
          },
        }),
      ]);
    } catch (e) {
      console.error("Erreur de parsing du contenu de l'interview:", e);
      return `<p>${content}</p>`;
    }
  }, [content]);

  return (
    <div 
      className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground leading-relaxed" 
      dangerouslySetInnerHTML={{ __html: output }} 
    />
  );
}

function QuestionAccordion({ question, index }: { question: Question, index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-l-4 border-l-primary/20 hover:border-l-primary">
        <CardHeader 
          className="cursor-pointer select-none hover:bg-muted/50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold pr-4 leading-relaxed">
              {question.question}
            </CardTitle>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0 pb-6">
                <div className="border-l-2 border-primary/20 pl-4">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {question.answer}
                  </p>
                  {question.timestamp_video && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                      <Play className="h-4 w-4" />
                      <span>Timestamp: {question.timestamp_video}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function InterviewDetailClient({ 
  interview, 
  questions 
}: { 
  interview: InterviewDetail, 
  questions: Question[] 
}) {
  const [isLiked, setIsLiked] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: interview.title,
          text: interview.description || '',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {interview.thumbnail && (
          <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
            <Image
              src={interview.thumbnail}
              alt={interview.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Play button for video interviews */}
            {interview.is_video && interview.video_url && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="rounded-full h-20 w-20 bg-primary/90 hover:bg-primary shadow-2xl"
                >
                  <Play className="h-8 w-8 ml-1" fill="currentColor" />
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {/* Content overlay */}
        <div className="relative -mt-32 md:-mt-40 z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-background/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border"
            >
              <div className="text-center space-y-4">
                <Badge variant="secondary" className="text-sm font-medium">
                  {interview.category}
                </Badge>
                
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                  {interview.title}
                </h1>
                
                {interview.description && (
                  <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    {interview.description}
                  </p>
                )}

                {/* Tags */}
                {interview.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 pt-4">
                    {interview.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pb-12">
        {/* Interview Metadata */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 mb-12"
        >
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              {/* Participants */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Interviewer */}
                <div className="text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-16 w-16 ring-4 ring-background shadow-lg">
                      <AvatarImage src={interview.interviewer_avatar || undefined} />
                      <AvatarFallback className="text-lg font-semibold">
                        {interview.interviewer_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{interview.interviewer_name}</h3>
                      <p className="text-sm text-muted-foreground">Interviewer</p>
                    </div>
                  </div>
                </div>

                {/* Interviewee */}
                <div className="text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-16 w-16 ring-4 ring-primary/20 shadow-lg">
                      <AvatarImage src={interview.interviewee_avatar || undefined} />
                      <AvatarFallback className="text-lg font-semibold">
                        {interview.interviewee_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{interview.interviewee_name}</h3>
                      <p className="text-sm text-primary font-medium">{interview.interviewee_role}</p>
                      {interview.interviewee_team && (
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          {interview.interviewee_team}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{interview.published_at}</span>
                  </div>
                  {interview.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{interview.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{interview.views.toLocaleString()} vues</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className="gap-2"
                  >
                    <Heart 
                      className={`h-4 w-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                    <span>{interview.likes + (isLiked ? 1 : 0)}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    <span>Partager</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bio Section */}
        {interview.interviewee_bio && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-12"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  À propos de {interview.interviewee_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {interview.interviewee_bio}
                </p>
                
                {interview.interviewee_achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                      Réalisations
                    </h4>
                    <div className="grid gap-2">
                      {interview.interviewee_achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-12"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <InterviewContent content={interview.content} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Questions Section */}
        {questions && questions.length > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Questions & Réponses</h2>
              <p className="text-muted-foreground">
                Découvrez les réponses détaillées aux questions les plus importantes
              </p>
            </div>
            
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionAccordion 
                  key={question.id} 
                  question={question} 
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 