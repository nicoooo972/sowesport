import { notFound } from "next/navigation";
import InterviewDetailClient from "./InterviewDetailClient";
import { supabase } from "@/lib/supabase";

// Interfaces partagées (gardées pour la cohérence)
export interface InterviewDetail {
  id: string;
  title: string;
  description: string | null;
  content: string; // Devrait être un JSON ou un contenu riche
  interviewee_name: string;
  interviewee_role: string;
  interviewee_team?: string | null;
  interviewee_avatar: string | null;
  interviewee_bio: string | null;
  interviewee_achievements: string[];
  interviewer_name: string;
  interviewer_avatar: string | null;
  category: string;
  duration: string | null;
  published_at: string;
  views: number;
  likes: number;
  thumbnail: string | null;
  is_video: boolean;
  video_url?: string | null;
  tags: string[];
}

export interface Question {
  id: string;
  question: string;
  answer: string;
  timestamp_video?: string | null; // Renommé pour correspondre à la BDD
}

// Page serveur principale
export default async function InterviewDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let { data: interview, error: interviewError } = await supabase
    .from("interviews")
    .select("*")
    .eq("id", params.id)
    .single();

  if (interviewError || !interview) {
    const fallback = await supabase
      .from("interviews")
      .select("*")
      .eq("slug", params.id)
      .single();

    interview = fallback.data as any;
    interviewError = fallback.error as any;
  }

  if (interviewError || !interview) {
    console.error("Error fetching interview:", interviewError);
    notFound();
  }

  const { data: questions, error: questionsError } = await supabase
    .from("interview_questions")
    .select("*")
    .eq("interview_id", interview.id)
    .order("order_index", { ascending: true });

  if (questionsError) {
    console.error("Error fetching interview questions:", questionsError);
  }

  const formattedInterview: InterviewDetail = {
    id: interview.id,
    title: interview.title,
    description: interview.description,
    content: interview.content, // Supposons que c'est un JSON string
    interviewee_name: interview.interviewee_name,
    interviewee_role: interview.interviewee_role,
    interviewee_team: interview.interviewee_team,
    interviewee_avatar: interview.interviewee_avatar,
    interviewee_bio: interview.interviewee_bio,
    interviewee_achievements: interview.interviewee_achievements || [],
    interviewer_name: interview.interviewer_name,
    interviewer_avatar: interview.interviewer_avatar,
    category: interview.category,
    duration: interview.duration,
    published_at: new Date(interview.published_at).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    views: interview.views || 0,
    likes: interview.likes || 0,
    thumbnail: interview.thumbnail,
    is_video: interview.is_video || false,
    video_url: interview.video_url,
    tags: interview.tags || [],
  };

  const formattedQuestions: Question[] = (questions || []).map((q) => ({
    id: q.id,
    question: q.question,
    answer: q.answer,
    timestamp_video: q.timestamp_video,
  }));

  return (
    <InterviewDetailClient
      interview={formattedInterview}
      questions={formattedQuestions}
    />
  );
}
