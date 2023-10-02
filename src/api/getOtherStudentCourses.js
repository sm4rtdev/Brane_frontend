import { customFetch } from "./customFetch";

export const getOtherStudentCourses = async (slug) => {
  const pathname = `api/mis-curso/public/${slug}`;

  return await customFetch(pathname);
};
