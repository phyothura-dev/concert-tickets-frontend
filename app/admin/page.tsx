import Link from "next/link";
import { PlusCircle, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { concertService } from "@/lib/services/concert.service";
import { ticketService } from "@/lib/services/ticket.service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [concerts, tickets] = await Promise.all([
    concertService.listConcerts(),
    ticketService.listTickets(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin dashboard</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Manage concerts and ticket inventory.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/concerts/new">
              <PlusCircle className="h-4 w-4" />
              Concert
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/tickets/new">
              <Ticket className="h-4 w-4" />
              Ticket
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Concerts</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{concerts.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ticket inventories</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{tickets.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available stock</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {concerts.reduce((sum, concert) => sum + concert.availableStock, 0)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

