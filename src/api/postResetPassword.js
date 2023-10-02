import { customFetch } from "./customFetch";

export const postResetPassword = async (object) => {
  const pathname = `api/auth/reset-password`;

  return await customFetch(pathname, "POST", object);
};
