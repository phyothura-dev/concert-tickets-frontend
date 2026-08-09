import { AdminGate } from "@/components/auth/auth-gate";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <div className="min-h-screen bg-surface-alt md:flex">
        <AdminSidebar />
        <main className="flex-1 md:pl-64">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminGate>
  );
}
