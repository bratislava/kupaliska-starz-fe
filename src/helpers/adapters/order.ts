import { CartItem, CustomerInfoFormValues, DiscountCodeState, OrderRequest } from "models";

export const orderFormValuesToOrderRequest = (form: {
  customer: CustomerInfoFormValues;
  cartItem: CartItem;
  photos: { photo?: string; childrenPhotos?: string[] };
  recaptchaToken: string,
  discountCodeState?: DiscountCodeState,
}): OrderRequest => ({
  tickets: [
    {
      quantity: form.cartItem.amount,
      ticketTypeId: form.cartItem.ticket.id,
      email: form.customer.email,
      ...(form.customer.name && {
        name: form.customer.name,
      }),
      ...(form.customer.age && {
        age: form.customer.age,
      }),
      ...(form.customer.zip && {
        zip: form.customer.zip,
      }),
      ...(form.customer.photo && {
        photo: form.photos.photo,
      }),
      ...(form.customer.children && {
        children: form.customer.children.map((child, index) => ({
          name: child.name,
          age: child.age,
          ...(child.photo &&
            form.photos.childrenPhotos && {
            photo: form.photos.childrenPhotos[index],
          }),
        })),
      }),
    },
  ],
  agreement: form.customer.agreement,
  recaptcha: form.recaptchaToken,
  ...(form.discountCodeState && form.discountCodeState.status === "OK") && { discountCode: form.discountCodeState.code }
});
