import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tickets",
  description: "View your concert ticket reservation and purchase history.",
};

export default function MyTicketsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
