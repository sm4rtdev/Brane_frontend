import { customFetch } from "./customFetch";

export const getAvailablePaymentMethods = async () => {
  const pathname = `api/users-permissions/users/getPaymentMethods/`;

  return await customFetch(pathname);
};
