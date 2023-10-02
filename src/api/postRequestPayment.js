import { customFetch } from "./customFetch";

export const postRequestPayment = async (object) => {
  const pathname = `api/pedidos`;

  return await customFetch(pathname, "POST", object);
};
