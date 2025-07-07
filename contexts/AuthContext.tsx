"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  role: 'ADMIN' | 'MODERATOR' | 'USER' | string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data: userProfile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows found
            console.error("Erreur chargement profil:", profileError);
          } else {
            setProfile(userProfile);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Erreur dans fetchSessionAndProfile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        // Re-fetch profile on auth change
        if (newSession?.user) {
          supabase
            .from("profiles")
            .select("*")
            .eq("id", newSession.user.id)
            .single()
            .then(({ data, error }) => {
              if (error && error.code !== 'PGRST116') {
                console.error("Erreur re-fetch profil:", error);
                setProfile(null);
              } else {
                setProfile(data);
              }
            });
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};
