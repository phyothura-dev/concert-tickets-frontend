import { AdminGate } from "@/components/auth/auth-gate";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <div className="flex min-h-screen bg-[#f7f8fc]">
        <AdminSidebar />
        <main className="flex-1 pl-64">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminGate>
  );
}

