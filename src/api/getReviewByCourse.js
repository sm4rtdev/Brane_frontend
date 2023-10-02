import { customFetch } from "./customFetch";

export const getReviewByCourse = async (id) => {
  const pathname = `api/valoracion-cursos?populate=*&filters[curso][id][$eq]=${id}`;

  return await customFetch(pathname);
};
