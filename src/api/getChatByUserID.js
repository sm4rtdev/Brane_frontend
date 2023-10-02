import { customFetch } from "./customFetch";

export const getChatByUserID = async (id) => {
  const pathname = `api/mensajes/me/${id}`;

  return await customFetch(pathname);
};
