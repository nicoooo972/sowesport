import { useRouter } from "next/router";
import { useAdmin } from "@/hooks/useAdmin";

export function AdminProtected({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!isAdmin) {
    router.push("/");
    return null;
  }

  return <>{children}</>;
}
