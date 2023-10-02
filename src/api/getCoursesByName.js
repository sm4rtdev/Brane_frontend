import { customFetch } from "./customFetch";

export const getCoursesByName = async (query) => {
  const pathname = `api/cursos?populate=*&filters[name][$contains]=${query}&filters[status][$eq]=published`;

  return await customFetch(pathname);
};
