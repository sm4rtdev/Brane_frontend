import { customFetch } from "./customFetch";

export const getUser = async (temp) => {
  const pathname = `api/users/me?populate=*`;

  return await customFetch(pathname, "GET", null, temp);
};
