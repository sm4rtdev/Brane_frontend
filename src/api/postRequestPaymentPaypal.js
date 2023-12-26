import { customFetch } from "./customFetch";

export const postRequestPaymentPaypal = async (object) => {
  const pathname = `api/pedido/paypal/create/`;

  return await customFetch(pathname, "POST", object);
};
