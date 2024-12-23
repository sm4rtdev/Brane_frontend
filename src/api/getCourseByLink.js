import { customFetch } from "./customFetch";

export const getCourseByLink = async (link) => {
  const pathname = `api/cursos/link/${link}`;

  return await customFetch(pathname);
};
