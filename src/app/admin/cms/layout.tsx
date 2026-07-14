import { AdminNav } from "@/components/admin/AdminNav";
import type { ReactNode } from "react";

export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <AdminNav />
      <div className="flex-1 overflow-auto bg-background text-foreground">
        {children}
      </div>
    </div>
  );
}
