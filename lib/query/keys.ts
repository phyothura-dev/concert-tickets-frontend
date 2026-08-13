export const queryKeys = {
  authUser: ["auth", "me"] as const,
  concerts: ["concerts"] as const,
  tickets: ["tickets"] as const,
  users: ["users"] as const,
  categories: ["categories"] as const,
  singers: ["singers"] as const,
  reservationHistory: ["reservations", "me"] as const,
  reservation: (id: string) => ["reservations", id] as const,
  seats: (ticketId: string) => ["tickets", ticketId, "seats"] as const,
  payments: ["payments"] as const,
  paymentList: (status: string, page: number) => ["payments", "list", status, page] as const,
  paymentConfig: ["payments", "config"] as const,
};
