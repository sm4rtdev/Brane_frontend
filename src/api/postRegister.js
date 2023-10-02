import { customFetch } from "./customFetch";

export const postRegister = async (object) => {
  const pathname = `api/auth/local/register`;

  return await customFetch(pathname, "POST", object);
};
