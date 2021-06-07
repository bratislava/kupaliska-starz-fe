import { apiClient } from "helpers/apiClient";
import { OrderRequest } from "models";

export function order(data: OrderRequest) {
  return apiClient.post("/api/v1/orders", data);
}

export function getFinalOrder(orderId: string, accessToken: string) {
  return apiClient.get(`/api/v1/orders/${orderId}/successful`, {
    headers: {
      "Order-Authorization": accessToken,
    },
  });
}

export function checkDiscountCode(ticketTypeId: string, discountCode: string) {
  return apiClient.get(`/api/v1/orders/discountCodes/${discountCode}/ticketTypes/${ticketTypeId}`)
}
