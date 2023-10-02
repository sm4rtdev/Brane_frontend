import { customFetch } from "./customFetch";

export const getCoursesByCategory = async (category) => {
  const pathname = `api/cursos?populate=*&filters[status][$eq]=published&filters[categoria][slug][$eq]=${category}&pagination[limit]=6`;

  return await customFetch(pathname);
};
