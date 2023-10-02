import { customFetch } from "./customFetch";

export const getAllCourses = async () => {
  const pathname = `api/cursos?populate=*&filters[status][$eq]=published`;

  return await customFetch(pathname);
};
