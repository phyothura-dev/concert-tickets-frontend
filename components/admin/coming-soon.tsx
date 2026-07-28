import { LayoutDashboard } from "lucide-react";

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center rounded-xl border border-gray-800 border-dashed bg-white shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
        <LayoutDashboard className="h-8 w-8" />
      </div>
      <h2 className="mt-6 text-xl font-bold text-zinc-950">{title}</h2>
      <p className="mt-2 text-sm text-zinc-500">
        This section is currently under development.
      </p>
    </div>
  );
}
