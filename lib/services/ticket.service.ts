import { z } from "zod";
import { apiFetch } from "@/lib/api/client";
import { envelopeSchema, ticketSchema } from "@/lib/api/schemas";
import type { ApiEnvelope, CreateTicketInput, TicketDto } from "@/lib/api/types";

const ticketListEnvelope = envelopeSchema(z.array(ticketSchema));
const ticketEnvelope = envelopeSchema(ticketSchema);

export const ticketService = {
  async listTickets() {
    const response = await apiFetch<ApiEnvelope<TicketDto[]>>("/tickets", {
      cache: "no-store",
    });
    return ticketListEnvelope.parse(response).data;
  },

  async createTicket(input: CreateTicketInput) {
    const response = await apiFetch<ApiEnvelope<TicketDto>>("/tickets", {
      method: "POST",
      body: input,
    });
    return ticketEnvelope.parse(response).data;
  },
  async updateTicket(id: string, input: CreateTicketInput) {
    const response = await apiFetch<ApiEnvelope<TicketDto>>(`/tickets/${id}`, {
      method: "PUT",
      body: input,
    });
    return ticketEnvelope.parse(response).data;
  },

  async deleteTicket(id: string) {
    const response = await apiFetch<ApiEnvelope<void>>(`/tickets/${id}`, {
      method: "DELETE",
    });
    return response.data;
  },
};

