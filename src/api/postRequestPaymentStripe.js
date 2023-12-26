import { customFetch } from "./customFetch";

export const postRequestPaymentStripe = async (object) => {
  const pathname = `api/pedidos`;

  return await customFetch(pathname, "POST", object);
};
