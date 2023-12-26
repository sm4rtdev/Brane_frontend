import { customFetch } from "./customFetch";

export const postRequestPaymentCardnet = async (object) => {
  const pathname = `api/pedido/cardnet/create/`;

  return await customFetch(pathname, "POST", object);
};
