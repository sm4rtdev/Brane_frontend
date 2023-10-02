import { customFetch } from "./customFetch";

export const postNewCourse = async (object) => {
  const pathname = `api/cursos`;

  return await customFetch(pathname, "POST", object);
};
