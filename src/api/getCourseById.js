import { customFetch } from "./customFetch";

export const getCourseById = async (id) => {
  const pathname = `api/cursos?populate=*&filters[id][$eq]=${id}&filters[status][$eq]=published`;

  return await customFetch(pathname);
};
