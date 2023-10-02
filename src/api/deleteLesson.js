import { customFetch } from "./customFetch";

export const deleteLesson = async (lessonID) => {
  const pathname = `api/clases/${lessonID}`;

  return await customFetch(pathname, "DELETE");
};
