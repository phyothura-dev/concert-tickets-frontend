"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuantityStepper } from "./quantity-stepper";
import { ReservationCountdown } from "./reservation-countdown";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useReservation } from "@/hooks/use-reservation";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { toUserMessage } from "@/lib/api/errors";
import type { ConcertDto, ReservationCreated } from "@/lib/api/types";

export function ReservePanel({ concert }: { concert: ConcertDto }) {
  const router = useRouter();
  const userQuery = useCurrentUser();
  const { openSignIn } = useAuthModal();
  const { reserveMutation, purchaseMutation } = useReservation();
  const [quantity, setQuantity] = useState(1);
  const [reservation, setReservation] = useState<ReservationCreated | null>(null);
  const [expired, setExpired] = useState(false);
  const userLoading = userQuery.isLoading;
  const signedIn = Boolean(userQuery.data);


  const soldOut = concert.availableStock <= 0;
  const maxQuantity = Math.max(1, Math.min(5, concert.availableStock));
  const isBusy = reserveMutation.isPending || purchaseMutation.isPending;

  const handleReserve = () => {
    reserveMutation.mutate(
      { concertId: concert.id, quantity },
      {
        onSuccess: (result) => {
          setReservation(result);
          setExpired(false);
          router.refresh();
          toast.success("Tickets reserved");
        },
        onError: (error) => toast.error(toUserMessage(error)),
      },
    );
  };

  const handlePurchase = () => {
    if (!reservation || expired) return;

    purchaseMutation.mutate(
      { reservationId: reservation.reservationId },
      {
        onSuccess: () => {
          toast.success("Purchase completed");
          setReservation(null);
          router.refresh();
        },
        onError: (error) => toast.error(toUserMessage(error)),
      },
    );
  };

  const handleExpire = useCallback(() => {
    setExpired(true);
    toast.error("Reservation expired. Please reserve again.");
    router.refresh();
  }, [router]);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <span>Reserve tickets</span>
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
            Live hold
          </span>
        </CardTitle>
        <CardDescription>
          Hold up to 5 tickets, then confirm purchase before the timer ends.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-900">Quantity</p>
            <p className="text-sm text-zinc-500">Limit 1-5 per reservation</p>
          </div>
          <QuantityStepper
            value={quantity}
            max={maxQuantity}
            disabled={soldOut || isBusy || Boolean(reservation && !expired)}
            onChange={setQuantity}
          />
        </div>

        {reservation && !expired ? (
          <ReservationCountdown expiresAt={reservation.expiresAt} onExpire={handleExpire} />
        ) : null}

        {userLoading ? (
          <div className="h-24 animate-pulse rounded-2xl bg-zinc-100" />
        ) : !signedIn ? (
          <div className="space-y-3 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-medium text-zinc-950">
              Sign in to reserve this concert.
            </p>
            <p className="text-sm text-zinc-600">
              Your hold is tied to your account so the timer and purchase flow stay in sync.
            </p>
            <Button
              onClick={openSignIn}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 transition-all cursor-pointer"
            >
              Sign In
            </Button>
          </div>

        ) : !reservation || expired ? (
          <Button
            className="w-full"
            disabled={soldOut || isBusy}
            onClick={handleReserve}
          >
            {soldOut ? "Sold out" : reserveMutation.isPending ? "Reserving..." : "Reserve hold"}
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={isBusy}
            onClick={handlePurchase}
          >
            {purchaseMutation.isPending ? "Purchasing..." : "Confirm purchase"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
