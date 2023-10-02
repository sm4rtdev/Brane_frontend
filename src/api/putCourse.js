import { customFetch } from "./customFetch";

export const putCourse = async (id, object) => {
  const pathname = `api/cursos/${id}`;

  return await customFetch(pathname, "PUT", object);
};
