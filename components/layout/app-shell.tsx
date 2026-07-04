import { AppHeader } from "./app-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f3ff] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_18%_12%,rgba(124,58,237,0.16),transparent_32%),radial-gradient(circle_at_86%_18%,rgba(14,165,233,0.12),transparent_30%)]" />
      <AppHeader />
      <main className="mx-auto w-full max-w-8xl px-4 py-8 sm:px-6 lg:py-10 lg:px-10">
        {children}
      </main>
    </div>
  );
}
