import { z } from "zod";
import { apiFetch } from "@/lib/api/client";
import { deletedResultSchema, envelopeSchema, seatSchema, ticketSchema } from "@/lib/api/schemas";
import type { ApiEnvelope, DeletedResult, SeatDto, TicketDto, TicketInput } from "@/lib/api/types";

const ticketListEnvelope = envelopeSchema(z.array(ticketSchema));
const ticketEnvelope = envelopeSchema(ticketSchema);
const deletedEnvelope = envelopeSchema(deletedResultSchema);

export const ticketService = {
  async listTickets() {
    const response = await apiFetch<ApiEnvelope<TicketDto[]>>("/tickets", {
      cache: "no-store",
    });
    return ticketListEnvelope.parse(response).data;
  },
  async listSeats(ticketId: string) {
    const response = await apiFetch<ApiEnvelope<SeatDto[]>>(`/tickets/${ticketId}/seats`, { cache: "no-store" });
    return envelopeSchema(seatSchema.array()).parse(response).data;
  },

  async createTicket(input: TicketInput) {
    const response = await apiFetch<ApiEnvelope<TicketDto>>("/tickets", {
      method: "POST",
      body: input,
    });
    return ticketEnvelope.parse(response).data;
  },
  async updateTicket(id: string, input: TicketInput) {
    const response = await apiFetch<ApiEnvelope<TicketDto>>(`/tickets/${id}`, {
      method: "PATCH",
      body: input,
    });
    return ticketEnvelope.parse(response).data;
  },

  async deleteTicket(id: string) {
    const response = await apiFetch<ApiEnvelope<DeletedResult>>(`/tickets/${id}`, {
      method: "DELETE",
    });
    return deletedEnvelope.parse(response).data;
  },
};
