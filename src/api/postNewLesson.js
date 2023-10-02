import { customFetch } from "./customFetch";

export const postNewLesson = async (object) => {
  const pathname = `api/clases`;

  return await customFetch(pathname, "POST", object);
};
