"use client";

import { useState } from "react";
import { ArrowLeft, Heart, Eye, Calendar, Clock, Play, User, Trophy, Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { InterviewDetail, Question } from "./page";

// Composant pour afficher une question/réponse
function QuestionCard({ question }: { question: Question }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Question */}
          <div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                Q
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-lg leading-relaxed">
                  {question.question}
                </p>
                {question.timestamp && (
                  <div className="flex items-center gap-1 text-purple-400 text-sm mt-2">
                    <Clock className="w-3 h-3" />
                    <span>{question.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Réponse */}
          <div>
            <div className="flex items-start gap-3">
              <div className="bg-slate-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                R
              </div>
              <div className="flex-1">
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {question.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour le profil de l'interviewé
function IntervieweeProfile({ interviewee }: { interviewee: InterviewDetail["interviewee"] }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-xl">À propos de l'interviewé</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4 mb-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
            <Image
              src={interviewee.avatar}
              alt={`${interviewee.name} avatar`}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{interviewee.name}</h3>
            <p className="text-purple-400 font-medium">{interviewee.role}</p>
            {interviewee.team && (
              <p className="text-gray-400">{interviewee.team}</p>
            )}
          </div>
        </div>

        <p className="text-gray-200 leading-relaxed mb-6">
          {interviewee.bio}
        </p>

        <div>
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Principales réalisations
          </h4>
          <ul className="space-y-2">
            {interviewee.achievements.map((achievement, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-200">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour le lecteur vidéo (placeholder)
function VideoPlayer({ videoUrl, thumbnail, title }: { videoUrl?: string; thumbnail: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {!isPlaying ? (
        <>
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 p-0"
              onClick={() => setIsPlaying(true)}
            >
              <Play className="w-6 h-6 ml-1" />
            </Button>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-black flex items-center justify-center">
          <p className="text-white">Lecteur vidéo (placeholder)</p>
        </div>
      )}
    </div>
  );
}

interface InterviewDetailClientProps {
  interview: InterviewDetail;
  questions: Question[];
}

export default function InterviewDetailClient({ interview, questions }: InterviewDetailClientProps) {
  const [isLiked, setIsLiked] = useState(interview.isLiked);
  const [likes, setLikes] = useState(interview.likes);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "League of Legends": return "bg-blue-600";
      case "Valorant": return "bg-red-600";
      case "Rocket League": return "bg-orange-600";
      case "Industrie": return "bg-purple-600";
      default: return "bg-gray-600";
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${interview.title} - Interview exclusive sur SowEsport`;
    
    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header avec bouton retour */}
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/interviews">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 mb-6 p-0 h-auto font-normal"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux interviews
            </Button>
          </Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header de l'interview */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Titre et métadonnées */}
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className={`${getCategoryColor(interview.category)} text-white`}>
                        {interview.category}
                      </Badge>
                      {interview.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-purple-500 text-purple-400">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {interview.title}
                    </h1>

                    <p className="text-xl text-gray-300 leading-relaxed mb-6">
                      {interview.description}
                    </p>

                    {/* Statistiques et actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{interview.views.toLocaleString()} vues</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Publié {interview.publishedAt}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{interview.duration} de lecture</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          className={`text-gray-400 hover:text-white ${isLiked ? 'text-red-500' : ''}`}
                          onClick={handleLike}
                        >
                          <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                          {likes}
                        </Button>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                            onClick={() => setShowShareMenu(!showShareMenu)}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Partager
                          </Button>
                          {showShareMenu && (
                            <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg p-2 space-y-1 z-10">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-white hover:bg-slate-700"
                                onClick={() => handleShare("twitter")}
                              >
                                <Twitter className="w-4 h-4 mr-2" />
                                Twitter
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-white hover:bg-slate-700"
                                onClick={() => handleShare("facebook")}
                              >
                                <Facebook className="w-4 h-4 mr-2" />
                                Facebook
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-white hover:bg-slate-700"
                                onClick={() => handleShare("linkedin")}
                              >
                                <Linkedin className="w-4 h-4 mr-2" />
                                LinkedIn
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  {/* Informations sur l'interview */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-700">
                        <Image
                          src={interview.interviewer.avatar}
                          alt={`${interview.interviewer.name} avatar`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Interviewé par</p>
                        <p className="text-white font-medium">{interview.interviewer.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lecteur vidéo si c'est une interview vidéo */}
            {interview.isVideo && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <VideoPlayer
                    videoUrl={interview.videoUrl}
                    thumbnail={interview.thumbnail}
                    title={interview.title}
                  />
                </CardContent>
              </Card>
            )}

            {/* Contenu de l'interview */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8">
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-lg">
                    {interview.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions et réponses */}
            {questions.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-white text-2xl font-bold">
                  Questions & Réponses
                </h2>
                <div className="space-y-4">
                  {questions.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profil de l'interviewé */}
            <IntervieweeProfile interviewee={interview.interviewee} />

            {/* Interviews similaires */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Interviews similaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interview.relatedInterviews.slice(0, 3).map((relatedId, index) => (
                    <Link key={relatedId} href={`/interviews/${relatedId}`}>
                      <div className="group cursor-pointer">
                        <div className="bg-slate-700/50 rounded-lg p-4 group-hover:bg-slate-700 transition-colors">
                          <p className="text-white font-medium group-hover:text-purple-400 transition-colors">
                            Interview #{index + 1}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Cliquez pour découvrir
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 