import { customFetch } from "./customFetch";

export const getLinkStripeAccount = async () => {
  const pathname = `api/meta-usuario/stripe-connect`;

  return await customFetch(pathname);
};
