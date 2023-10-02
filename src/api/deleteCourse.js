import { customFetch } from "./customFetch";

export const deleteCourse = async (courseID) => {
  const pathname = `api/cursos/${courseID}`;

  return await customFetch(pathname, "DELETE");
};
