import { customFetch } from "./customFetch";

export const getUserPurchaseHistory = async () => {
  const pathname = `api/pedido/find-me/?populate=*&filters[estado][$eq]=completado`;

  return await customFetch(pathname);
};
