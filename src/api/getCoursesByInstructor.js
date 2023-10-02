import { customFetch } from "./customFetch";

export const getCoursesByInstructor = async (id) => {
  const pathname = `api/cursos?populate=*&filters[instructor][id][$eq]=${id}&filters[status][$eq]=published`;

  return await customFetch(pathname);
};
