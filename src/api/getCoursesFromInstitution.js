import { customFetch } from "./customFetch";

export const getCoursesFromInstitution = async () => {
  const pathname = `api/users-permissions/users/institutionCurso/`;

  return await customFetch(pathname);
};
