import { apiClientWithMsal } from "../../helpers/apiClient";

export interface TicketFromHistory {
  id: string;
  type: string;
  remainingEntries: number | null;
  ownerName: string;
  ownerId: string;
  entries: TicketFromHistoryEntry[];
  qrCode: string;
  price: number;
}

export interface TicketFromHistoryEntry {
  id: string;
  from: number | null;
  to: number | null;
  poolName: string;
}

export function fetchTicketsHistory() {
  return apiClientWithMsal.get<TicketFromHistory[]>("/api/v1/orders/tickets");
}
