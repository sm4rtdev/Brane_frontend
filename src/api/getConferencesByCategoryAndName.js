import { customFetch } from "./customFetch";

export const getConferencesByCategoryAndName = async (slug, query = "") => {
  const pathname = `api/cursos?populate=*&filters[status][$eq]=published&filters[categoria][slug][$eq]=${slug}&filters[name][$contains]=${query}&filters[tipo][$eq]=conferencia`;

  return await customFetch(pathname);
};
