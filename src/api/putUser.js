import { customFetch } from "./customFetch";

export const putUser = async (id, object, temp = false) => {
  const pathname = `api/users/${id}`;

  return await customFetch(pathname, "PUT", object, temp);
};
