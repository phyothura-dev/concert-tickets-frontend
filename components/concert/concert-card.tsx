import { CalendarDays, MapPin, Ticket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ConcertDto } from "@/lib/api/types";
import { formatDateTime } from "@/lib/utils/format";
import Image from "next/image";

export function ConcertCard({
  concert,
  index = 0,
}: {
  concert: ConcertDto;
  index?: number;
}) {
  const soldOut = concert.availableStock <= 0;
  const soldPercent =
    concert.totalStock > 0
      ? Math.min(
          100,
          Math.round(
            ((concert.totalStock - concert.availableStock) /
              concert.totalStock) *
              100,
          ),
        )
      : 0;

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border-violet-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-200/60">
      <div className={`relative h-40 overflow-hidden bg-gradient-to-br  `}>
        <Image
          src={"/demo-preview.jpg"}
          width={100}
          height={100}
          alt={concert.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-2 text-base leading-5 text-slate-950">
          {concert.title}
        </CardTitle>
        <p className="text-sm text-slate-500">{concert.venue}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 p-4 pt-0 text-sm text-slate-600">
        <p className="flex items-center gap-2 text-xs">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          {formatDateTime(concert.startsAt)}
        </p>
        <p className="flex items-center gap-2 text-xs">
          <MapPin className="h-4 w-4 text-slate-400" />
          {concert.venue}
        </p>
        <div className="mt-auto space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span>{soldOut ? "Sold out" : `${soldPercent}% sold`}</span>
            <span
              className={
                soldOut ? "text-rose-600" : "font-semibold text-rose-500"
              }
            >
              {soldOut
                ? "0 left"
                : `${concert.availableStock.toLocaleString()} left`}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${soldOut ? "bg-rose-600" : "bg-violet-600"}`}
              style={{ width: `${soldOut ? 100 : soldPercent}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="items-end justify-between gap-3 p-4 pt-0">
        <div className="text-xs text-slate-500">
          <span className="block">Tickets</span>
          <span className="flex items-center gap-1 text-sm font-semibold text-slate-950">
            <Ticket className="h-3.5 w-3.5 text-violet-500" />
            {concert.totalStock.toLocaleString()}
          </span>
        </div>
        <Button
          asChild
          className="h-9 rounded-full bg-violet-600 px-5 text-white shadow-sm shadow-violet-300/70 hover:bg-violet-700"
          variant={soldOut ? "secondary" : "default"}
        >
          <Link href={`/concerts/${concert.id}`}>
            {soldOut ? "View details" : "Reserve tickets"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
