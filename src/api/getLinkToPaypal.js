import { customFetch } from "./customFetch";

export const getLinkToPaypal = async () => {
  const pathname = `api/meta-usuario/paypal-connect`;

  return await customFetch(pathname);
};
