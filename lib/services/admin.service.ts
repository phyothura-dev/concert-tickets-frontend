import { concertService } from "./concert.service";
import { ticketService } from "./ticket.service";

export const adminService = {
  createConcert: concertService.createConcert,
  createTicket: ticketService.createTicket,
};

