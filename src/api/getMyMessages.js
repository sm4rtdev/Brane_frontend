import { customFetch } from "./customFetch";

export const getMyMessages = async () => {
  const pathname = `api/mensajes/me`;

  return await customFetch(pathname);
};
