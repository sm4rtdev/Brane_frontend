import { customFetch } from "./customFetch";

export const getCommentsFromLesson = async (id) => {
  const pathname = `api/comentarios?populate=autor&filters[clase][id][$eq]=${id}`;

  return await customFetch(pathname);
};
