import { customFetch } from "./customFetch";

export const getLinkToStripe = async () => {
  const pathname = `api/meta-usuario/stripe-connect`;

  return await customFetch(pathname);
};
