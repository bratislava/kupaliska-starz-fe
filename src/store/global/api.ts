import { ContactFormValues } from "components/ContactForm/ContactForm";
import { apiClient } from "helpers/apiClient";
// A mock function to mimic making an async request for data
export function fetchTickets() {
  return apiClient.get("/api/v1/ticketTypes");
}

export function fetchPools(number: number) {
  return apiClient.get(`/api/v1/swimmingPools`, {
    params: {
      limit: number,
      order: "ordering",
      direction: "asc",
    }
  });
}

export function fetchPool(id: string) {
  return apiClient.get(`/api/v1/swimmingPools/${id}`);
}

export function sendContactForm(data: ContactFormValues & { recaptcha: string, agreement: boolean }) {
  return apiClient.post("/api/v1/contact", data);
}
