"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { reservationService } from "@/lib/services/reservation.service";

export function useReservation() {
  const queryClient = useQueryClient();

  const reserveMutation = useMutation({
    mutationFn: reservationService.reserve,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.concerts });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: reservationService.purchase,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.concerts });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
    },
  });

  return {
    reserveMutation,
    purchaseMutation,
  };
}

