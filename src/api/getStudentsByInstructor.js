import { customFetch } from "./customFetch";

export const getStudentsByInstructor = async (slug) => {
  const pathname = `api/profesor/estudiantes/${slug}`;

  return await customFetch(pathname);
};
