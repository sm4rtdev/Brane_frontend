import { customFetch } from "./customFetch";

export const getMyTeachers = async () => {
  const pathname = `api/estudiante/profesores/me/`;

  return await customFetch(pathname);
};
