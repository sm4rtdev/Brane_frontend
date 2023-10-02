import { customFetch } from "./customFetch";

export const getMyCourseProgress = async (id) => {
  const pathname = `api/mis-cursos?populate=curso&filters[curso][id][$eq]=${id}`;

  return await customFetch(pathname);
};
