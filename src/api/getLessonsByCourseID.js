import { customFetch } from "./customFetch";

export const getLessonsByCourseID = async (courseID) => {
  const pathname = `api/clases?populate=*&filters[curso][id][$eq]=${courseID}`;

  return await customFetch(pathname);
};
