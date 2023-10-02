import { customFetch } from "./customFetch";

export const postSendResetEmail = async (object) => {
  const pathname = `api/auth/forgot-password`;

  return await customFetch(pathname, "POST", object);
};
