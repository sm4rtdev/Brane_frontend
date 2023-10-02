import { customFetch } from "./customFetch";

export const postLogin = async (object) => {
  const pathname = `api/auth/local`;

  return await customFetch(pathname, "POST", object);
};
