"use client";

import { AdminProtected } from "@/components/AdminProtected";

export default function AdminPage() {
  return (
    <AdminProtected>
      <div className="container mx-auto py-24">
        <h1>Page d&apos;administration</h1>
        {/* Contenu admin */}
      </div>
    </AdminProtected>
  );
}
