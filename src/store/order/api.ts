import { apiClient, apiClientWithMsalIfAvailable } from "helpers/apiClient";
import { CheckPriceResponse, OrderRequest } from "models";

export function order(data: OrderRequest) {
  return apiClientWithMsalIfAvailable.post("/api/v1/orders", data);
}

export function getPrice(order: any, abortSignal?: AbortSignal) {
  return apiClientWithMsalIfAvailable.post<CheckPriceResponse>(
    "/api/v1/orders/getPrice",
    order,
    { signal: abortSignal }
  );
}

export function getFinalOrder(orderId: string, accessToken: string) {
  return apiClientWithMsalIfAvailable.get(`/api/v1/orders/${orderId}/successful`, {
    headers: {
      "Order-Authorization": accessToken,
    },
  });
}

export interface DiscountCodeResponse {
  discountCode: { code: string; amount: number };
}

export function checkDiscountCode(ticketTypeId: string, discountCode: string) {
  return apiClient.get<DiscountCodeResponse>(
    `/api/v1/orders/discountCodes/${discountCode}/ticketTypes/${ticketTypeId}`
  );
}
