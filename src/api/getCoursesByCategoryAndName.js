import { customFetch } from "./customFetch";

export const getCoursesByCategoryAndName = async (slug, query = "") => {
  const pathname = `api/cursos?populate=*&filters[status][$eq]=published&filters[categoria][slug][$eq]=${slug}&filters[name][$contains]=${query}`;

  return await customFetch(pathname);
};
