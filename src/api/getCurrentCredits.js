import { customFetch } from "./customFetch";

export const getCurrentCredits = async () => {
  const pathname = `api/users-permissions/users/credits/`;

  return await customFetch(pathname);
};
