import { Ticket, Music, Users } from "lucide-react";
import { concertService } from "@/lib/services/concert.service";
import { ticketService } from "@/lib/services/ticket.service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [concerts] = await Promise.all([
    concertService.listConcerts(),
    ticketService.listTickets(),
  ]);

  const totalStock = concerts.reduce((sum, c) => sum + c.totalStock, 0);
  const availableStock = concerts.reduce((sum, c) => sum + c.availableStock, 0);
  const ticketsSold = totalStock - availableStock;

  const eventsLive = concerts.length;
  const registeredUsers = 0; // API to be implemented later

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {currentDate} · All figures year-to-date
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <div className="flex items-center gap-4 rounded-xl border-gray-800 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
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
        <div className="flex items-center gap-4 rounded-xl border-gray-800 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
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
        <div className="flex items-center gap-4 rounded-xl border-gray-800 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
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

      <div className="rounded-xl border-gray-800 bg-white shadow-sm">
        <div className="border-b-gray-700 px-6 py-4">
          <h2 className="text-base font-bold text-zinc-950">Recent Concerts</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {concerts.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-zinc-500">
              No concerts found.
            </div>
          ) : (
            concerts.map((concert) => {
              const isSoldOut = concert.availableStock === 0;
              const date = new Date(concert.startsAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

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
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        isSoldOut
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {isSoldOut ? "Sold Out" : "On Sale"}
                    </span>
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

