import { customFetch } from "./customFetch";

export const getCourseForEdition = async (instructorID, courseID) => {
  const pathname = `api/cursos?populate=*&filters[instructor][id][$eq]=${instructorID}&filters[id][$eq]=${courseID}`;

  return await customFetch(pathname);
};
