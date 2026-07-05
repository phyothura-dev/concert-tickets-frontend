import type { z } from "zod";
import type {
  authUserResponseSchema,
  concertSchema,
  createConcertSchema,
  createTicketSchema,
  directPurchaseResultSchema,
  directPurchaseSchema,
  legacyPurchaseResultSchema,
  loginSchema,
  purchaseSchema,
  registerSchema,
  reservationCreatedSchema,
  reserveSchema,
  signOutResultSchema,
  ticketSchema,
  userSchema,
} from "./schemas";

export type ConcertDto = z.infer<typeof concertSchema>;
export type TicketDto = z.infer<typeof ticketSchema>;
export type UserDto = z.infer<typeof userSchema>;
export type AuthUserResponse = z.infer<typeof authUserResponseSchema>;
export type SignOutResult = z.infer<typeof signOutResultSchema>;
export type ReservationCreated = z.infer<typeof reservationCreatedSchema>;
export type LegacyPurchaseResult = z.infer<typeof legacyPurchaseResultSchema>;
export type DirectPurchaseResult = z.infer<typeof directPurchaseResultSchema>;
export type CreateConcertInput = z.infer<typeof createConcertSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type ReserveInput = z.infer<typeof reserveSchema>;
export type PurchaseInput = z.infer<typeof purchaseSchema>;
export type DirectPurchaseInput = z.infer<typeof directPurchaseSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export type ApiEnvelope<T> = {
  status?: "success";
  message: string;
  data: T;
};


