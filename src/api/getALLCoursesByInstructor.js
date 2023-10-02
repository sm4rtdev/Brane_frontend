import { customFetch } from "./customFetch";

export const getALLCoursesByInstructor = async (id) => {
  const pathname = `api/cursos?populate=*&filters[instructor][id][$eq]=${id}`;

  return await customFetch(pathname);
};
