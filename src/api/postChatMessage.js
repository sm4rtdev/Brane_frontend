import { customFetch } from "./customFetch";

export const postChatMessage = async (object) => {
  const pathname = `api/comentarios`;

  return await customFetch(pathname, "POST", object);
};
