"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { reservationService } from "@/lib/services/reservation.service";

export function useReservation() {
  const queryClient = useQueryClient();
  const reserveMutation = useMutation({
    mutationFn: reservationService.reserve,
    onSuccess: (reservation) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.concerts });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
      if (reservation.ticket) void queryClient.invalidateQueries({ queryKey: queryKeys.seats(reservation.ticket.id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservationHistory });
    },
  });
  return { reserveMutation };
}
