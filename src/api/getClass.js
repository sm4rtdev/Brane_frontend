import { customFetch } from "./customFetch";

export const getClass = async (id) => {
  const pathname = `api/clases/${id}?populate=*`;

  return await customFetch(pathname);
};
