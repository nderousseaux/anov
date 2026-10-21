import { AdminNav } from "@/components/admin/AdminNav";
import { TableSettings } from "@/components/admin/seating/TableSettings";

export default function AdminTablesPage() {
  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <AdminNav />
      <div className="max-w-4xl mx-auto p-6 pb-8 space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Tables</h1>
        <TableSettings />
      </div>
    </div>
  );
}
