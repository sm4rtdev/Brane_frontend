import { customFetch } from "./customFetch";

export const postRequestPaymentBrane = async (object) => {
  const pathname = `api/pedido/credit/create/`;

  return await customFetch(pathname, "POST", object);
};
