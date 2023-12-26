import { customFetch } from "./customFetch";

export const getLinkAccount = async (pasarela) => {
  if (pasarela === "paypal") {
    const pathname = `api/meta-usuario/paypal-connect`;
    return await customFetch(pathname);
  } else {
    const pathname = `api/meta-usuario/stripe-connect`;
    return await customFetch(pathname);
  }
};
