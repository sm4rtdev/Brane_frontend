import { customFetch } from "./customFetch";

export const getCourseBySlug = async (slug) => {
  const pathname = `api/cursos/slug/${slug}`;

  return await customFetch(pathname);
};
