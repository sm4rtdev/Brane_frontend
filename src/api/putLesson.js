import { customFetch } from "./customFetch";

export const putLesson = async (lessonID, object) => {
  const pathname = `api/clases/${lessonID}`;

  return await customFetch(pathname, "PUT", object);
};
