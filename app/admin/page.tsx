import { Ticket, Music, Users } from "lucide-react";
import { concertService } from "@/lib/services/concert.service";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const concerts = await concertService.listConcerts();

  const totalStock = concerts.reduce((sum, c) => sum + c.totalStock, 0);
  const availableStock = concerts.reduce((sum, c) => sum + c.availableStock, 0);
  const ticketsSold = totalStock - availableStock;

  const eventsLive = concerts.length;
  const registeredUsers = 0; // API to be implemented later

  const currentDate = formatDate(new Date(), "MMMM yyyy");

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard Overview"
        description={`${currentDate} · All figures year-to-date`}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-950">
              {ticketsSold.toLocaleString()}
            </p>
            <p className="text-sm text-zinc-500">Tickets Sold</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Music className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-950">
              {eventsLive.toLocaleString()}
            </p>
            <p className="text-sm text-zinc-500">Events Live</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-950">
              {registeredUsers.toLocaleString()}
            </p>
            <p className="text-sm text-zinc-500">Registered Users</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-bold text-zinc-950">Recent Concerts</h2>
        </div>
        <div className="divide-y divide-border">
          {concerts.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-zinc-500">
              No concerts found.
            </div>
          ) : (
            concerts.map((concert) => {
              const isSoldOut = concert.availableStock === 0;
              const date = formatDate(concert.startsAt, "MMM d");

              return (
                <div
                  key={concert.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <h3 className="font-semibold text-zinc-900">
                      {concert.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {concert.venue} · {date}
                    </p>
                  </div>
                  <div>
                    <StatusBadge tone={isSoldOut ? "danger" : "success"}>
                      {isSoldOut ? "Sold Out" : "On Sale"}
                    </StatusBadge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
