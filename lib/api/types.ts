import type { z } from "zod";
import type {
  authUserResponseSchema,
  categorySchema,
  concertSchema,
  concertInputSchema,
  ticketInputSchema,
  deletedResultSchema,
  loginSchema,
  registerSchema,
  userInputSchema,
  categoryInputSchema,
  singerInputSchema,
  reservationSchema,
  seatSchema,
  paymentConfigSchema,
  paymentSchema,
  paymentListSchema,
  paymentMethodIdSchema,
  reserveSchema,
  signOutResultSchema,
  singerSchema,
  ticketSchema,
  userSchema,
} from "./schemas";

export type CategoryDto = z.infer<typeof categorySchema>;
export type SingerDto = z.infer<typeof singerSchema>;
export type ConcertDto = z.infer<typeof concertSchema>;
export type TicketDto = z.infer<typeof ticketSchema>;
export type UserDto = z.infer<typeof userSchema>;
export type AuthUserResponse = z.infer<typeof authUserResponseSchema>;
export type SignOutResult = z.infer<typeof signOutResultSchema>;
export type Reservation = z.infer<typeof reservationSchema>;
export type ReservationHistory = Reservation;
export type SeatDto = z.infer<typeof seatSchema>;
export type PaymentConfig = z.infer<typeof paymentConfigSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type PaymentList = z.infer<typeof paymentListSchema>;
export type PaymentMethodId = z.infer<typeof paymentMethodIdSchema>;
export type DeletedResult = z.infer<typeof deletedResultSchema>;
export type ConcertInput = z.infer<typeof concertInputSchema>;
export type TicketInput = z.infer<typeof ticketInputSchema>;
export type ReserveInput = z.infer<typeof reserveSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UserInput = z.infer<typeof userInputSchema>;
export type CreateUserInput = Omit<UserInput, "emailVerified">;
export type CategoryInput = z.infer<typeof categoryInputSchema>;
export type SingerInput = z.infer<typeof singerInputSchema>;

export type ApiEnvelope<T> = {
  status?: "success";
  message: string;
  data: T;
};
