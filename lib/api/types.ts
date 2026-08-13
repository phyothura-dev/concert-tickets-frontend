import type { z } from "zod";
import type {
  authUserResponseSchema,
  categorySchema,
  concertSchema,
  createConcertSchema,
  createTicketSchema,
  deletedResultSchema,
  loginSchema,
  registerSchema,
  createUserSchema,
  createCategorySchema,
  createSingerSchema,
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
export type CreateConcertInput = z.infer<typeof createConcertSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type ReserveInput = z.infer<typeof reserveSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateSingerInput = z.infer<typeof createSingerSchema>;

export type ApiEnvelope<T> = {
  status?: "success";
  message: string;
  data: T;
};
